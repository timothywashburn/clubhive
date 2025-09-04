import { ReactNode } from 'react';

export interface SegmentedButtonOption<T = string> {
    value: T;
    label: string;
    icon?: ReactNode;
}

interface SegmentedButtonProps<T = string> {
    options: SegmentedButtonOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
}

export function SegmentedButton<T = string>({ options, value, onChange, className = '' }: SegmentedButtonProps<T>) {
    return (
        <div className={`inline-flex bg-surface-variant rounded-lg p-1 border border-outline-variant ${className}`}>
            {options.map(option => (
                <button
                    key={String(option.value)}
                    onClick={() => onChange(option.value)}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer
                        ${
                            value === option.value
                                ? 'bg-primary text-on-primary shadow-sm'
                                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface'
                        }
                    `}
                >
                    {option.icon}
                    {option.label}
                </button>
            ))}
        </div>
    );
}
