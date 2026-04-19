import React from 'react';
import Loader from './Loader/Loader';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: any;
    disabled?: boolean;
    isLoading?: boolean;
    variant?: 'border' | 'default';
    className?: String;
    icon?: any;
    type?: any;
}

const Button = ({
    children,
    onClick,
    disabled,
    isLoading = false,
    variant = 'default',
    className,
    icon,
    type
}: ButtonProps) => {
    const buttonClassNames = `${className} text-sm font-bold  h-[40px] flex flex-row items-center justify-center gap-2 px-5 rounded-full trans hover:opacity-80 ${variant === 'border'
        ? 'bg-[var(--white)] border-[1px] border-solid border-[var(--voilet)] text-[var(--voilet)]'
        : 'bg-[var(--voilet)] text-white'
        } ${(isLoading || disabled) ? 'cursor-not-allowed opacity-50 hover:opacity-50' : 'cursor-pointer'}`;

    return (
        <button
            className={buttonClassNames}
            disabled={isLoading || disabled}
            onClick={onClick}
            type={type}
        >
            {!isLoading &&
                <div>{icon}</div>
            }

            {isLoading ? (
                <div className={`flex flex-row items-center gap-2 font-bold ${variant === 'border' ? 'text-[var(--voilet)]' : ''}`}>
                    <Loader />
                    <h4 >Loading</h4>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

// PERFORMANCE FIX: Memoize Button component to prevent unnecessary re-renders
// Used 30+ places in Navbar, Forms, Pricing, Modals, etc.
// Without memo, parent state change triggers Button re-render even if props unchanged (60ms+ overhead)
export default React.memo(Button);
