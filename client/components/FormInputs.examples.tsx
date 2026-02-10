/**
 * Enhanced Form Input Components - Usage Guide
 * 
 * These components provide better UX for form inputs with automatic validation,
 * default values, and visual feedback.
 */

import { useState } from 'react';
import NumberInput from './NumberInput';
import TextInput from './TextInput';
import SelectInput from './SelectInput';

// ============================================================
// NumberInput - For numeric fields with validation
// ============================================================

/**
 * Features:
 * - Auto-resets to default value on invalid input
 * - Allows clearing temporarily (shows yellow indicator)
 * - Validates min/max constraints
 * - Shows placeholder with default value
 * - Visual feedback when field will reset
 */

function NumberInputExamples() {
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [tax, setTax] = useState(0);

    return (
        <div>
            {/* Basic quantity input - defaults to 1, min 1 */}
            <NumberInput
                value={quantity}
                onChange={setQuantity}
                min={1}
                step={1}
                defaultValue={1}
                label="Quantity"
            />

            {/* Price input - defaults to 0, min 0 */}
            <NumberInput
                value={price}
                onChange={setPrice}
                min={0}
                step={0.01}
                defaultValue={0}
                label="Unit Price"
            />

            {/* Tax percentage - defaults to 0, min 0, max 100 */}
            <NumberInput
                value={tax}
                onChange={setTax}
                min={0}
                max={100}
                step={0.01}
                defaultValue={0}
                label="Tax %"
            />
        </div>
    );
}

// ============================================================
// SelectInput - For dropdown selections
// ============================================================

/**
 * Features:
 * - Consistent styling with other inputs
 * - Optional error message display
 * - Supports all standard select attributes
 */

function SelectInputExamples() {
    const [status, setStatus] = useState('pending');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');

    return (
        <div>
            {/* Basic select */}
            <SelectInput
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
            </SelectInput>

            {/* Select with error */}
            <SelectInput
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                error={error}
                required
            >
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
            </SelectInput>
        </div>
    );
}

// ============================================================
// TextInput - For text fields
// ============================================================

/**
 * Features:
 * - Consistent styling
 * - Optional error message display
 * - Supports all standard input attributes
 */

function TextInputExamples() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    return (
        <div>
            {/* Basic text input */}
            <TextInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
            />

            {/* Text input with error */}
            <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                error={emailError}
            />
        </div>
    );
}

// ============================================================
// Complete Form Example
// ============================================================

function CompleteFormExample() {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: 1,
        price: 0,
        tax: 0,
        status: 'pending',
    });

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form className="space-y-4">
            {/* Text Input */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Name *
                </label>
                <TextInput
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                    placeholder="Enter product name"
                />
            </div>

            {/* Select Input */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                </label>
                <SelectInput
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    required
                >
                    <option value="">Select category</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                </SelectInput>
            </div>

            {/* Number Inputs */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Quantity *
                    </label>
                    <NumberInput
                        value={formData.quantity}
                        onChange={(value) => updateField('quantity', value)}
                        min={1}
                        step={1}
                        defaultValue={1}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price
                    </label>
                    <NumberInput
                        value={formData.price}
                        onChange={(value) => updateField('price', value)}
                        min={0}
                        step={0.01}
                        defaultValue={0}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tax %
                    </label>
                    <NumberInput
                        value={formData.tax}
                        onChange={(value) => updateField('tax', value)}
                        min={0}
                        max={100}
                        step={0.01}
                        defaultValue={0}
                    />
                </div>
            </div>

            <button type="submit" className="btn-primary">
                Submit
            </button>
        </form>
    );
}

/**
 * Best Practices:
 * 
 * 1. NumberInput:
 *    - Always set a sensible defaultValue (e.g., 0 for prices, 1 for quantities)
 *    - Set min/max constraints to prevent invalid values
 *    - Use step=1 for integers, step=0.01 for currency
 * 
 * 2. SelectInput:
 *    - Always include a placeholder option with empty value
 *    - Set required={true} when the field is mandatory
 *    - Provide error prop for validation feedback
 * 
 * 3. TextInput:
 *    - Use appropriate input type (email, tel, url, etc.)
 *    - Provide error prop for validation feedback
 *    - Consider adding placeholder text for better UX
 * 
 * 4. General:
 *    - Wrap inputs in divs with labels for better accessibility
 *    - Use consistent spacing (space-y-4 for form groups)
 *    - Provide visual feedback for required fields
 */
