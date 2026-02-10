import { useState, useEffect } from 'react';

interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number;
    placeholder?: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
    label?: string;
}

export default function NumberInput({
    value,
    onChange,
    min = 0,
    max,
    step = 0.01,
    defaultValue = 0,
    placeholder,
    className = '',
    required = false,
    disabled = false,
    label,
}: NumberInputProps) {
    const [inputValue, setInputValue] = useState(value.toString());
    const [isFocused, setIsFocused] = useState(false);
    const [showReset, setShowReset] = useState(false);

    // Update input value when prop value changes
    useEffect(() => {
        if (!isFocused) {
            setInputValue(value.toString());
        }
    }, [value, isFocused]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setInputValue(rawValue);

        // Allow empty string while typing
        if (rawValue === '' || rawValue === '-') {
            setShowReset(true);
            return;
        }

        const numValue = parseFloat(rawValue);

        // Valid number - update immediately
        if (!isNaN(numValue)) {
            setShowReset(false);
            onChange(numValue);
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        setShowReset(false);

        // Parse the current input value
        const numValue = parseFloat(inputValue);

        // Reset to default if invalid
        if (inputValue === '' || isNaN(numValue)) {
            onChange(defaultValue);
            setInputValue(defaultValue.toString());
            return;
        }

        // Apply min/max constraints
        let finalValue = numValue;

        if (min !== undefined && numValue < min) {
            finalValue = defaultValue;
        }

        if (max !== undefined && numValue > max) {
            finalValue = defaultValue;
        }

        // Update with validated value
        onChange(finalValue);
        setInputValue(finalValue.toString());
    };

    const handleFocus = () => {
        setIsFocused(true);
        setShowReset(false);
    };

    const baseClassName = `w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield] ${
        showReset ? 'border-yellow-500' : ''
    } ${className}`;

    return (
        <div className="relative w-full">
            <input
                type="number"
                step={step}
                min={min}
                max={max}
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={placeholder || `Default: ${defaultValue}`}
                className={baseClassName}
                required={required}
                disabled={disabled}
                aria-label={label}
            />
            {showReset && (
                <div className="absolute -bottom-5 left-0 text-xs text-yellow-400">
                    Will reset to {defaultValue}
                </div>
            )}
        </div>
    );
}
