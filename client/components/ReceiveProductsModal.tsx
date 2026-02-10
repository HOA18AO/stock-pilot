'use client';

import { useState } from 'react';
import Button from './Button';

interface ReceiveProductsModalProps {
  isOpen: boolean;
  purchaseDetails: Array<{
    id: number;
    productCode: string;
    quantity: number;
    purchaseReceipts?: Array<{ id: number; serialCode: string }>;
  }>;
  onClose: () => void;
  onSubmit: (data: { items: Array<{ purchaseDetailId: number; serialCodes: string[] }> }) => Promise<void>;
  isLoading?: boolean;
}

export default function ReceiveProductsModal({
  isOpen,
  purchaseDetails,
  onClose,
  onSubmit,
  isLoading = false,
}: ReceiveProductsModalProps) {
  const [serialCodesInput, setSerialCodesInput] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [submitError, setSubmitError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (detailId: number, value: string) => {
    setSerialCodesInput((prev) => ({
      ...prev,
      [detailId]: value,
    }));

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[detailId];
      return newErrors;
    });
  };

  const countSerialCodes = (text: string): string[] => {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const handleSubmit = async () => {
    setSubmitError('');
    const newErrors: Record<number, string> = {};
    const items: Array<{ purchaseDetailId: number; serialCodes: string[] }> = [];

    // Validate all products
    for (const detail of purchaseDetails) {
      const input = serialCodesInput[detail.id] || '';
      const serialCodes = countSerialCodes(input);
      const alreadyReceived = detail.purchaseReceipts?.length || 0;
      const remaining = detail.quantity - alreadyReceived;

      if (serialCodes.length === 0) {
        // Optional field - only validate if something is entered
        continue;
      }

      if (serialCodes.length > remaining) {
        newErrors[detail.id] = `You've entered ${serialCodes.length} codes but only ${remaining} units remain (Already received: ${alreadyReceived}/${detail.quantity})`;
      } else if (serialCodes.length < remaining && serialCodes.length > 0) {
        // Show warning but allow partial receive
        const warning = `You've entered ${serialCodes.length} codes for ${remaining} remaining units. You can receive more later.`;
        console.warn(warning);
      }

      if (!newErrors[detail.id]) {
        items.push({
          purchaseDetailId: detail.id,
          serialCodes,
        });
      }
    }

    // Show errors if any
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Don't submit if no items have serial codes
    if (items.length === 0) {
      setSubmitError('Please enter at least one serial code');
      return;
    }

    try {
      await onSubmit({ items });
      // Reset form on success
      setSerialCodesInput({});
      onClose();
    } catch (error: any) {
      setSubmitError(error?.message || 'Failed to receive products');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">Receive Products</h2>

        {submitError && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded mb-4">
            {submitError}
          </div>
        )}

        <div className="space-y-6">
          {purchaseDetails.map((detail) => {
            const alreadyReceived = detail.purchaseReceipts?.length || 0;
            const remaining = detail.quantity - alreadyReceived;
            const currentInput = serialCodesInput[detail.id] || '';
            const serialCodes = countSerialCodes(currentInput);
            const inputCount = serialCodes.length;
            const isComplete = alreadyReceived >= detail.quantity;
            const hasError = errors[detail.id];
            const inputIsTooMany = inputCount > remaining;
            const inputIsPartial = inputCount > 0 && inputCount < remaining;

            return (
              <div key={detail.id} className="border border-gray-700 rounded p-4 bg-gray-750">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-white font-semibold">{detail.productCode}</h3>
                    <p className="text-gray-400 text-sm">
                      Already received: {alreadyReceived} / {detail.quantity}
                    </p>
                  </div>
                  {isComplete && (
                    <span className="bg-green-900 text-green-200 px-3 py-1 rounded text-sm font-semibold">
                      ✓ Complete
                    </span>
                  )}
                  {!isComplete && remaining > 0 && (
                    <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded text-sm">
                      {remaining} left
                    </span>
                  )}
                </div>

                {isComplete ? (
                  <div className="text-gray-500 text-sm italic">All units received</div>
                ) : (
                  <div>
                    <textarea
                      value={currentInput}
                      onChange={(e) => handleInputChange(detail.id, e.target.value)}
                      placeholder="Enter serial codes, one per line"
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded p-2 text-sm font-mono resize-none"
                      rows={3}
                      disabled={isLoading}
                    />

                    <div className="mt-2 flex justify-between items-start">
                      <div className="text-sm">
                        <span className="text-gray-400">Serial codes entered: </span>
                        <span
                          className={`font-semibold ${
                            inputIsTooMany
                              ? 'text-red-400'
                              : inputCount === remaining
                                ? 'text-green-400'
                                : inputIsPartial
                                  ? 'text-yellow-400'
                                  : 'text-white'
                          }`}
                        >
                          {inputCount}
                        </span>
                        <span className="text-gray-400"> / {remaining}</span>
                      </div>

                      {inputCount > 0 && inputCount !== remaining && (
                        <p className="text-xs text-gray-400">
                          {inputIsTooMany
                            ? `❌ Too many (max ${remaining})`
                            : inputIsPartial
                              ? `⚠️ Partial (you can receive more later)`
                              : ''}
                        </p>
                      )}
                    </div>

                    {hasError && <p className="text-red-400 text-sm mt-1">{hasError}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50"
          >
            Cancel
          </button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Receiving...' : 'Receive Products'}
          </Button>
        </div>
      </div>
    </div>
  );
}
