'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table, { TableColumn } from '@/components/Table/Table';
import Button from '@/components/Button';

interface Vendor {
    id: number;
    code: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

function getApiUrl() {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3008';
}

export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetchVendors(token);
    }, [router]);

    const fetchVendors = async (token: string) => {
        try {
            const res = await fetch(`${getApiUrl()}/vendor`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.status === 401) {
                localStorage.removeItem('token');
                router.push('/login');
                return;
            }

            if (!res.ok) {
                throw new Error('Failed to fetch vendors');
            }

            const data = await res.json();
            setVendors(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch vendors');
        } finally {
            setLoading(false);
        }
    };

    const columns: TableColumn<Vendor>[] = [
        {
            key: 'id',
            label: 'ID',
            sortable: true,
            render: (value) => <span className="font-mono text-gray-400">#{value}</span>,
        },
        {
            key: 'code',
            label: 'Code',
            sortable: true,
            render: (value) => <span className="font-mono font-semibold text-blue-400">{value}</span>,
        },
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (value) => <span className="font-medium text-white">{value}</span>,
        },
        {
            key: 'description',
            label: 'Description',
            sortable: false,
            render: (value) => (
                <span className="text-gray-400 max-w-xs truncate block">
                    {value || '-'}
                </span>
            ),
        },
        {
            key: 'createdAt',
            label: 'Created',
            sortable: true,
            render: (value) => (
                <span className="text-gray-400 text-xs">
                    {new Date(value).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: 'updatedAt',
            label: 'Updated',
            sortable: true,
            render: (value) => (
                <span className="text-gray-400 text-xs">
                    {new Date(value).toLocaleDateString()}
                </span>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
                <div className="text-white text-lg">Loading vendors...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Vendors</h1>
                        <p className="text-gray-400">
                            Manage your vendors ({vendors.length} total)
                        </p>
                    </div>
                    <Button variant="primary">
                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Vendor
                    </Button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Table */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <Table
                        data={vendors}
                        columns={columns}
                        searchableColumns={['name', 'code', 'description']}
                        defaultRowsPerPage={10}
                    />
                </div>
            </div>
        </div>
    );
}
