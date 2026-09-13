"use client";

import type {
    ButtonHTMLAttributes,
    ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";

import Loader from "./loader/CustomLoader";

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    isLoading?: boolean;
    variant?: "border" | "default";
    icon?: ReactNode;
}

const Button = ({
    children,
    isLoading = false,
    variant = "default",
    icon,
    className,
    disabled,
    type = "button",
    ...props
}: ButtonProps) => {
    const isDisabled = disabled || isLoading;

    return (
        <button
            {...props}
            type={type}
            disabled={isDisabled}
            aria-busy={isLoading}
            className={twMerge(
                `
                flex h-10 flex-row items-center justify-center gap-2
                rounded-full px-5 text-sm font-bold
                transition-opacity duration-200
                hover:opacity-80
                `,
                variant === "border"
                    ? `
                      border border-solid
                      border-[var(--voilet)]
                      bg-[var(--white)]
                      text-[var(--voilet)]
                      `
                    : `
                      bg-[var(--voilet)]
                      text-white
                      `,
                isDisabled
                    ? `
                      cursor-not-allowed
                      opacity-50
                      hover:opacity-50
                      `
                    : "cursor-pointer",
                className
            )}
        >
            {isLoading ? (
                <span
                    className={twMerge(
                        "flex items-center gap-2 font-bold",
                        variant === "border"
                            ? "text-[var(--voilet)]"
                            : ""
                    )}
                >
                    <Loader />
                    <span>Loading</span>
                </span>
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;