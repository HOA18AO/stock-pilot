'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

export interface TableColumn<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    searchableColumns?: string[];
    defaultRowsPerPage?: number;
}

export default function Table<T extends Record<string, any>>({
    data,
    columns,
    searchableColumns = [],
    defaultRowsPerPage = 10,
}: TableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
        new Set(columns.map((col) => col.key))
    );
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [isRowsOpen, setIsRowsOpen] = useState(false);
    const [isColumnsOpen, setIsColumnsOpen] = useState(false);
    const rowsRef = useRef<HTMLDivElement>(null);
    const columnsRef = useRef<HTMLDivElement>(null);

    // Handle click outside dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (rowsRef.current && !rowsRef.current.contains(target)) {
                setIsRowsOpen(false);
            }
            if (columnsRef.current && !columnsRef.current.contains(target)) {
                setIsColumnsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter data based on search
    const filteredData = useMemo(() => {
        if (!searchQuery) return data;

        return data.filter((row) =>
            searchableColumns.some((col) => {
                const value = row[col];
                return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
            })
        );
    }, [data, searchQuery, searchableColumns]);

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(start, start + rowsPerPage);
    }, [sortedData, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(sortedData.length / rowsPerPage);

    const handleSort = (key: string) => {
        setSortConfig((current) => {
            if (current?.key === key) {
                return current.direction === 'asc'
                    ? { key, direction: 'desc' }
                    : null;
            }
            return { key, direction: 'asc' };
        });
    };

    const toggleColumn = (key: string) => {
        setVisibleColumns((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const visibleColumnDefs = columns.filter((col) => visibleColumns.has(col.key));

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Search */}
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    {/* Rows per page dropdown */}
                    <div ref={rowsRef} className="relative">
                        <button
                            onClick={() => {
                                setIsRowsOpen(!isRowsOpen);
                                setIsColumnsOpen(false);
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6m0 0L7 12m6-6l6 6" />
                            </svg>
                            {rowsPerPage} rows
                        </button>
                        {isRowsOpen && (
                            <div className="absolute left-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 z-10">
                                {[10, 20, 50].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => {
                                            setRowsPerPage(num);
                                            setCurrentPage(1);
                                            setIsRowsOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition ${rowsPerPage === num ? 'bg-blue-600 text-white' : 'text-gray-200'
                                            }`}
                                    >
                                        {num} rows
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Column selector */}
                    <div ref={columnsRef} className="relative">
                        <button
                            onClick={() => {
                                setIsColumnsOpen(!isColumnsOpen);
                                setIsRowsOpen(false);
                            }}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                            </svg>
                            Columns
                        </button>
                        {isColumnsOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 z-10">
                                {columns.map((col) => (
                                    <label
                                        key={col.key}
                                        className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer transition"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={visibleColumns.has(col.key)}
                                            onChange={() => toggleColumn(col.key)}
                                            className="mr-2 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="text-white text-sm">{col.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-700">
                <table className="w-full">
                    <thead className="bg-gray-800 border-b border-gray-700">
                        <tr>
                            {visibleColumnDefs.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                                >
                                    {col.sortable !== false ? (
                                        <button
                                            onClick={() => handleSort(col.key)}
                                            className="flex items-center gap-2 hover:text-white"
                                        >
                                            {col.label}
                                            {sortConfig?.key === col.key && (
                                                <svg
                                                    className={`w-4 h-4 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                </svg>
                                            )}
                                        </button>
                                    ) : (
                                        col.label
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-800">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={visibleColumnDefs.length}
                                    className="px-6 py-8 text-center text-gray-400"
                                >
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-800 transition-colors">
                                    {visibleColumnDefs.map((col) => (
                                        <td key={col.key} className="px-6 py-4 text-sm text-gray-300">
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                    Showing {paginatedData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{' '}
                    {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} results
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-4 py-2 rounded-lg ${currentPage === pageNum
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
