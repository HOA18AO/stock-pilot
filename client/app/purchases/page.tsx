'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table, { TableColumn } from '@/components/Table/Table';
import Button from '@/components/Button';
import PurchaseFormModal from '@/components/PurchaseFormModal';

interface Purchase {
    id: number;
    code: string;
    type: string;
    vendorCode: string;
    originalAmount: number;
    additionalFee: number;
    tax: number;
    finalAmount: number;
    status: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    vendor?: {
        code: string;
        name: string;
    };
}

function getApiUrl() {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3008';
}

export default function PurchasesPage() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetchPurchases(token);
    }, [router]);

    const fetchPurchases = async (token: string) => {
        try {
            const res = await fetch(`${getApiUrl()}/purchase`, {
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
                throw new Error('Failed to fetch purchases');
            }

            const data = await res.json();
            setPurchases(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch purchases');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSuccess = () => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchPurchases(token);
        }
        setShowCreateModal(false);
    };

    const handleRowClick = (purchase: Purchase) => {
        router.push(`/purchases/${purchase.id}`);
    };

    const columns: TableColumn<Purchase>[] = [
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
            key: 'vendor',
            label: 'Vendor',
            sortable: true,
            render: (value) => (
                <span className="text-white">
                    {value?.name || '-'}
                </span>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (value) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        value === 'purchase'
                            ? 'bg-green-900 text-green-300'
                            : 'bg-red-900 text-red-300'
                    }`}
                >
                    {value}
                </span>
            ),
        },
        {
            key: 'originalAmount',
            label: 'Original Amount',
            sortable: true,
            render: (value) => (
                <span className="text-gray-300 font-mono">
                    ${typeof value === 'number' ? value.toFixed(2) : '0.00'}
                </span>
            ),
        },
        {
            key: 'finalAmount',
            label: 'Final Amount',
            sortable: true,
            render: (value) => (
                <span className="text-white font-mono font-semibold">
                    ${typeof value === 'number' ? value.toFixed(2) : '0.00'}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value) => {
                const statusColors = {
                    draft: 'bg-gray-700 text-gray-300',
                    pending: 'bg-yellow-900 text-yellow-300',
                    processing: 'bg-blue-900 text-blue-300',
                    completed: 'bg-green-900 text-green-300',
                };
                const colorClass = statusColors[value as keyof typeof statusColors] || 'bg-gray-700 text-gray-300';
                
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
                        {value}
                    </span>
                );
            },
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
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
                <div className="text-white text-lg">Loading purchases...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Purchase Orders</h1>
                        <p className="text-gray-400">
                            Manage your purchase orders ({purchases.length} total)
                        </p>
                    </div>
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Purchase Order
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
                        data={purchases}
                        columns={columns}
                        searchableColumns={['code', 'vendor.name', 'type', 'status']}
                        defaultRowsPerPage={10}
                        onRowClick={handleRowClick}
                    />
                </div>
            </div>

            {/* Create Purchase Modal */}
            <PurchaseFormModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
}
