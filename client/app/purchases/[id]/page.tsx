'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/Button';
import ReceiveProductsModal from '@/components/ReceiveProductsModal';

interface PurchaseDetail {
    id: number;
    purchaseId: number;
    productCode: string;
    unitCost: number;
    quantity: number;
    additionalFee: number;
    tax: number;
    totalCost: number;
    description: string | null;
    product?: {
        code: string;
        name: string;
    };
    purchaseReceipts?: PurchaseReceipt[];
}

interface PurchaseReceipt {
    id: number;
    purchaseCode: string;
    purchaseDetailId: number;
    serialCode: string;
    quantity: number;
    createdAt: string;
}

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
    purchaseDetails?: PurchaseDetail[];
}

function getApiUrl() {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3008';
}

export default function PurchaseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const purchaseId = params.id as string;
    
    const [purchase, setPurchase] = useState<Purchase | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [showReceiveModal, setShowReceiveModal] = useState(false);
    const [receiveLoading, setReceiveLoading] = useState(false);
    const [statusToggleLoading, setStatusToggleLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetchPurchaseDetail(token);
    }, [purchaseId, router]);

    const fetchPurchaseDetail = async (token: string) => {
        try {
            const res = await fetch(`${getApiUrl()}/purchase/${purchaseId}`, {
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
                throw new Error('Failed to fetch purchase details');
            }

            const data = await res.json();
            setPurchase(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch purchase details');
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (detailId: number) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(detailId)) {
                newSet.delete(detailId);
            } else {
                newSet.add(detailId);
            }
            return newSet;
        });
    };

    const isAllProductsReceived = () => {
        if (!purchase?.purchaseDetails) return false;
        return purchase.purchaseDetails.every(detail => {
            const received = detail.purchaseReceipts?.length || 0;
            return received >= detail.quantity;
        });
    };

    const handleReceiveProducts = async (data: { items: Array<{ purchaseDetailId: number; serialCodes: string[] }> }) => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        setReceiveLoading(true);
        try {
            const res = await fetch(`${getApiUrl()}/purchase/${purchaseId}/receive`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (res.status === 401) {
                localStorage.removeItem('token');
                router.push('/login');
                return;
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData?.message || 'Failed to receive products');
            }

            const updatedPurchase = await res.json();
            setPurchase(updatedPurchase);
        } catch (err) {
            throw err;
        } finally {
            setReceiveLoading(false);
        }
    };

    const handleToggleDraftStatus = async () => {
        if (!purchase) return;

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        if (purchase.status !== 'pending' && purchase.status !== 'draft') {
            return;
        }

        const nextStatus = purchase.status === 'pending' ? 'draft' : 'pending';

        setStatusToggleLoading(true);
        setError('');

        try {
            const res = await fetch(`${getApiUrl()}/purchase/${purchase.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: nextStatus }),
            });

            if (res.status === 401) {
                localStorage.removeItem('token');
                router.push('/login');
                return;
            }

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData?.message || 'Failed to update purchase status');
            }

            await fetchPurchaseDetail(token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update purchase status');
        } finally {
            setStatusToggleLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
                <div className="text-white text-lg">Loading purchase details...</div>
            </div>
        );
    }

    if (error || !purchase) {
        return (
            <div className="min-h-screen bg-gray-900 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                        {error || 'Purchase not found'}
                    </div>
                    <Button variant="secondary" onClick={() => router.push('/purchases')} className="mt-4">
                        Back to Purchases
                    </Button>
                </div>
            </div>
        );
    }

    const statusColors = {
        draft: 'bg-gray-700 text-gray-300',
        pending: 'bg-yellow-900 text-yellow-300',
        processing: 'bg-blue-900 text-blue-300',
        completed: 'bg-green-900 text-green-300',
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => router.push('/purchases')}
                            className="flex items-center text-gray-400 hover:text-white mb-2 transition"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Purchases
                        </button>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold text-white">Purchase Order Details</h1>
                            {(purchase.status === 'pending' || purchase.status === 'draft') && (
                                <Button
                                    variant="secondary"
                                    onClick={handleToggleDraftStatus}
                                    disabled={statusToggleLoading}
                                    className={purchase.status === 'draft'
                                        ? 'bg-green-700 hover:bg-green-600 focus:ring-green-500 text-white'
                                        : 'bg-gray-700 hover:bg-gray-600 text-white'}
                                >
                                    {statusToggleLoading
                                        ? 'Updating...'
                                        : 'Draft'}
                                </Button>
                            )}
                        </div>
                        <p className="text-gray-400 mt-1">{purchase.code}</p>
                    </div>
                    <div className="flex gap-3">
                        {purchase.status !== 'draft' && (
                            isAllProductsReceived() ? (
                                <button
                                    disabled
                                    className="px-4 py-2 bg-gray-600 text-gray-400 rounded cursor-not-allowed flex items-center gap-2"
                                >
                                    ✓ Received
                                </button>
                            ) : (
                                <Button onClick={() => setShowReceiveModal(true)}>Receive Products</Button>
                            )
                        )}
                        <Button variant="outline">Print</Button>
                    </div>
                </div>

                {/* Purchase Information Card */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Purchase Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Vendor</p>
                            <p className="text-white font-semibold">
                                {purchase.vendor?.name || purchase.vendorCode}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Type</p>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                    purchase.type === 'purchase'
                                        ? 'bg-green-900 text-green-300'
                                        : 'bg-red-900 text-red-300'
                                }`}
                            >
                                {purchase.type}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Status</p>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                    statusColors[purchase.status as keyof typeof statusColors] || 'bg-gray-700 text-gray-300'
                                }`}
                            >
                                {purchase.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Original Amount</p>
                            <p className="text-white font-mono">${purchase.originalAmount.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Additional Fees</p>
                            <p className="text-white font-mono">${purchase.additionalFee.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Tax</p>
                            <p className="text-white font-mono">${purchase.tax.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Final Amount</p>
                            <p className="text-2xl text-white font-mono font-bold">${purchase.finalAmount.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Created</p>
                            <p className="text-white">{new Date(purchase.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Last Updated</p>
                            <p className="text-white">{new Date(purchase.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                    {purchase.description && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-400 mb-1">Description</p>
                            <p className="text-white">{purchase.description}</p>
                        </div>
                    )}
                </div>

                {/* Purchase Details Table */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Products & Line Items</h2>
                    
                    {!purchase.purchaseDetails || purchase.purchaseDetails.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            No purchase details found
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {purchase.purchaseDetails.map((detail) => (
                                <div key={detail.id} className="border border-gray-700 rounded-lg overflow-hidden">
                                    {/* Purchase Detail Row */}
                                    <div
                                        onClick={() => toggleRow(detail.id)}
                                        className="bg-gray-700 p-4 cursor-pointer hover:bg-gray-650 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <svg
                                                    className={`w-5 h-5 text-gray-400 transition-transform ${
                                                        expandedRows.has(detail.id) ? 'rotate-90' : ''
                                                    }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                                                    <div>
                                                        <p className="text-xs text-gray-400">Product</p>
                                                        <p className="text-white font-semibold">
                                                            {detail.product?.name || detail.productCode}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{detail.productCode}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Unit Cost</p>
                                                        <p className="text-white font-mono">${detail.unitCost.toFixed(2)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Quantity</p>
                                                        <p className="text-white">{detail.quantity}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Additional Fee</p>
                                                        <p className="text-white font-mono">${detail.additionalFee.toFixed(2)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Tax</p>
                                                        <p className="text-white">{detail.tax}%</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">Total Cost</p>
                                                        <p className="text-white font-mono font-bold">${detail.totalCost.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {detail.description && (
                                            <div className="mt-2 ml-9">
                                                <p className="text-xs text-gray-400">Notes:</p>
                                                <p className="text-sm text-gray-300">{detail.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Expanded Purchase Receipts */}
                                    {expandedRows.has(detail.id) && (
                                        <div className="bg-gray-800 p-4 border-t border-gray-700">
                                            <h4 className="text-sm font-semibold text-gray-300 mb-3">Purchase Receipts ({detail.purchaseReceipts?.length || 0})</h4>
                                            {!detail.purchaseReceipts || detail.purchaseReceipts.length === 0 ? (
                                                <p className="text-gray-500 text-sm">No receipts found for this item</p>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="border-b border-gray-700">
                                                                <th className="text-left py-2 px-3 text-gray-400 font-medium">Serial Code</th>
                                                                <th className="text-left py-2 px-3 text-gray-400 font-medium">Quantity</th>
                                                                <th className="text-left py-2 px-3 text-gray-400 font-medium">Created</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {detail.purchaseReceipts.map((receipt) => (
                                                                <tr key={receipt.id} className="border-b border-gray-700 last:border-0">
                                                                    <td className="py-2 px-3">
                                                                        <span className="font-mono text-blue-400">{receipt.serialCode}</span>
                                                                    </td>
                                                                    <td className="py-2 px-3">
                                                                        <span className={`${receipt.quantity === 1 ? 'text-green-400' : 'text-red-400'}`}>
                                                                            {receipt.quantity > 0 ? '+' : ''}{receipt.quantity}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2 px-3 text-gray-400">
                                                                        {new Date(receipt.createdAt).toLocaleString()}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Receive Products Modal */}
            {purchase && purchase.purchaseDetails && (
                <ReceiveProductsModal
                    isOpen={showReceiveModal}
                    purchaseDetails={purchase.purchaseDetails}
                    onClose={() => setShowReceiveModal(false)}
                    onSubmit={handleReceiveProducts}
                    isLoading={receiveLoading}
                />
            )}
        </div>
    );
}
