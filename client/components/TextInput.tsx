import { InputHTMLAttributes } from 'react';

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
    className?: string;
    error?: string;
}

export default function TextInput({ className = '', error, ...props }: TextInputProps) {
    const baseClassName = `w-full bg-gray-700 border ${
        error ? 'border-red-500' : 'border-gray-600'
    } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 ${
        error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
    } ${className}`;

    return (
        <div className="w-full">
            <input {...props} className={baseClassName} />
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
}
