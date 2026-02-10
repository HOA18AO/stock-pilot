'use client';

import { useState, useEffect } from 'react';
import Button from './Button';
import NumberInput from './NumberInput';
import SelectInput from './SelectInput';

interface Vendor {
    code: string;
    name: string;
}

interface Product {
    code: string;
    name: string;
}

interface LineItem {
    id: string;
    productCode: string;
    unitCost: number;
    quantity: number;
    additionalFee: number;
    tax: number;
    notes: string;
}

interface PurchaseFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

function getApiUrl() {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3008';
}

export default function PurchaseFormModal({ isOpen, onClose, onSuccess }: PurchaseFormModalProps) {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [vendorCode, setVendorCode] = useState('');
    const [status, setStatus] = useState('pending');
    const [description, setDescription] = useState('');
    const [lineItems, setLineItems] = useState<LineItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchVendorsAndProducts();
            resetForm();
        }
    }, [isOpen]);

    const fetchVendorsAndProducts = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const [vendorsRes, productsRes] = await Promise.all([
                fetch(`${getApiUrl()}/vendor`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
                fetch(`${getApiUrl()}/product`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
            ]);

            if (vendorsRes.ok) {
                const vendorsData = await vendorsRes.json();
                setVendors(vendorsData);
            }

            if (productsRes.ok) {
                const productsData = await productsRes.json();
                setProducts(productsData);
            }
        } catch (err) {
            console.error('Failed to fetch vendors/products:', err);
        }
    };

    const resetForm = () => {
        setVendorCode('');
        setStatus('pending');
        setDescription('');
        setLineItems([]);
        setError('');
    };

    const addLineItem = () => {
        const newItem: LineItem = {
            id: Date.now().toString(),
            productCode: '',
            unitCost: 0,
            quantity: 1,
            additionalFee: 0,
            tax: 0,
            notes: '',
        };
        setLineItems([...lineItems, newItem]);
    };

    const removeLineItem = (id: string) => {
        setLineItems(lineItems.filter(item => item.id !== id));
    };

    const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
        setLineItems(lineItems.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculateItemTotal = (item: LineItem): number => {
        const baseAmount = item.unitCost * item.quantity;
        const taxAmount = baseAmount * (item.tax / 100);
        return baseAmount + item.additionalFee + taxAmount;
    };

    const calculateTotals = () => {
        let originalAmount = 0;
        let totalFees = 0;
        let totalTax = 0;

        lineItems.forEach(item => {
            const baseAmount = item.unitCost * item.quantity;
            originalAmount += baseAmount;
            totalFees += item.additionalFee;
            totalTax += baseAmount * (item.tax / 100);
        });

        const finalAmount = originalAmount + totalFees + totalTax;

        return { originalAmount, totalFees, totalTax, finalAmount };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!vendorCode) {
            setError('Please select a vendor');
            return;
        }

        if (lineItems.length === 0) {
            setError('Please add at least one product');
            return;
        }

        // Validate all line items
        for (const item of lineItems) {
            if (!item.productCode) {
                setError('Please select a product for all line items');
                return;
            }
            if (item.unitCost <= 0) {
                setError('Unit cost must be greater than 0');
                return;
            }
            if (item.quantity < 1) {
                setError('Quantity must be at least 1');
                return;
            }
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);

        try {
            const totals = calculateTotals();

            // Build purchase details with auto-generated receipts
            const purchaseDetails = lineItems.map(item => {
                const baseAmount = item.unitCost * item.quantity;
                const taxAmount = baseAmount * (item.tax / 100);
                const totalCost = baseAmount + item.additionalFee + taxAmount;

                return {
                    productCode: item.productCode,
                    unitCost: item.unitCost,
                    quantity: item.quantity,
                    additionalFee: item.additionalFee,
                    tax: item.tax,
                    totalCost,
                    description: item.notes || null,
                    // Receipts will be auto-generated by backend
                };
            });

            const payload = {
                type: 'purchase',
                vendorCode,
                originalAmount: totals.originalAmount,
                additionalFee: totals.totalFees,
                tax: totals.totalTax,
                finalAmount: totals.finalAmount,
                status,
                description: description || null,
                purchaseDetails,
            };

            const res = await fetch(`${getApiUrl()}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create purchase order');
            }

            onSuccess();
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create purchase order');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const totals = calculateTotals();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">Create Purchase Order</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                        disabled={loading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
                    <div className="p-6 space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Header Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Vendor *
                                </label>
                                <SelectInput
                                    value={vendorCode}
                                    onChange={(e) => setVendorCode(e.target.value)}
                                    required
                                >
                                    <option value="">Select a vendor</option>
                                    {vendors.map(vendor => (
                                        <option key={vendor.code} value={vendor.code}>
                                            {vendor.name} ({vendor.code})
                                        </option>
                                    ))}
                                </SelectInput>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Status
                                </label>
                                <SelectInput
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                </SelectInput>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={2}
                                placeholder="Optional notes about this purchase order"
                            />
                        </div>

                        {/* Line Items */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Products</h3>
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={addLineItem}
                                >
                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Product
                                </Button>
                            </div>

                            {lineItems.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    No products added yet. Click "Add Product" to get started.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {lineItems.map((item, index) => (
                                        <div key={item.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                                            <div className="flex items-start justify-between mb-3">
                                                <h4 className="font-semibold text-white">Product {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeLineItem(item.id)}
                                                    className="text-red-400 hover:text-red-300 transition"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                <div className="lg:col-span-2">
                                                    <label className="block text-xs font-medium text-gray-300 mb-1">
                                                        Product *
                                                    </label>
                                                    <SelectInput
                                                        value={item.productCode}
                                                        onChange={(e) => updateLineItem(item.id, 'productCode', e.target.value)}
                                                        className="text-sm"
                                                        required
                                                    >
                                                        <option value="">Select product</option>
                                                        {products.map(product => (
                                                            <option key={product.code} value={product.code}>
                                                                {product.name} ({product.code})
                                                            </option>
                                                        ))}
                                                    </SelectInput>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-300 mb-1">
                                                        Unit Cost *
                                                    </label>
                                                    <NumberInput
                                                        value={item.unitCost}
                                                        onChange={(value) => updateLineItem(item.id, 'unitCost', value)}
                                                        min={0}
                                                        step={0.01}
                                                        defaultValue={0}
                                                        className="bg-gray-800 text-sm"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-300 mb-1">
                                                        Quantity *
                                                    </label>
                                                    <NumberInput
                                                        value={item.quantity}
                                                        onChange={(value) => updateLineItem(item.id, 'quantity', Math.round(value))}
                                                        min={1}
                                                        step={1}
                                                        defaultValue={1}
                                                        className="bg-gray-800 text-sm"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-300 mb-1">
                                                        Additional Fee
                                                    </label>
                                                    <NumberInput
                                                        value={item.additionalFee}
                                                        onChange={(value) => updateLineItem(item.id, 'additionalFee', value)}
                                                        min={0}
                                                        step={0.01}
                                                        defaultValue={0}
                                                        className="bg-gray-800 text-sm"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-300 mb-1">
                                                        Tax (%)
                                                    </label>
                                                    <NumberInput
                                                        value={item.tax}
                                                        onChange={(value) => updateLineItem(item.id, 'tax', value)}
                                                        min={0}
                                                        max={100}
                                                        step={0.01}
                                                        defaultValue={0}
                                                        className="bg-gray-800 text-sm"
                                                    />
                                                </div>

                                                <div className="lg:col-span-3">
                                                    <label className="block text-xs font-medium text-gray-300 mb-1">
                                                        Notes
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.notes}
                                                        onChange={(e) => updateLineItem(item.id, 'notes', e.target.value)}
                                                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Optional notes for this item"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-3 pt-3 border-t border-gray-600">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-400">Item Total:</span>
                                                    <span className="text-lg font-semibold text-white">
                                                        ${calculateItemTotal(item).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Totals Summary */}
                        {lineItems.length > 0 && (
                            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                                <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Original Amount:</span>
                                        <span className="font-mono">${totals.originalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Additional Fees:</span>
                                        <span className="font-mono">${totals.totalFees.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Tax:</span>
                                        <span className="font-mono">${totals.totalTax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-gray-600">
                                        <span>Final Amount:</span>
                                        <span className="font-mono">${totals.finalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700 bg-gray-800">
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading || lineItems.length === 0}
                        >
                            {loading ? 'Creating...' : 'Create Purchase Order'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
