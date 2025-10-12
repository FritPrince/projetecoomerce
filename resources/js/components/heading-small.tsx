import React from 'react';

interface HeadingSmallProps {
    title: string;
    description: string;
    className?: string;
}

export default function HeadingSmall({ title, description, className = '' }: HeadingSmallProps) {
    return (
        <div className={`space-y-1 ${className}`}>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
            </p>
        </div>
    );
}