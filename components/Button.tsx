import React, { ButtonHTMLAttributes, ReactNode } from "react";

import Loader from "./loader/Loader";

interface ButtonProps {
    children: ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    isLoading?: boolean;
    variant?: "border" | "default";
    className?: string;
    icon?: ReactNode;
    type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
}

const Button = ({
    children,
    onClick,
    disabled = false,
    isLoading = false,
    variant = "default",
    className = "",
    icon,
    type = "button",
}: ButtonProps) => {
    const buttonClassNames = `
    ${className}
    text-sm font-bold h-[40px] flex flex-row items-center justify-center gap-2
    px-5 rounded-full trans
    hover:opacity-80
    ${variant === "border"
            ? "bg-[var(--white)] border border-solid border-[var(--voilet)] text-[var(--voilet)]"
            : "bg-[var(--voilet)] text-white"
        }
    ${isLoading || disabled
            ? "cursor-not-allowed opacity-50 hover:opacity-50"
            : "cursor-pointer"
        }
  `;

    return (
        <button
            type={type}
            className={buttonClassNames}
            disabled={isLoading || disabled}
            onClick={onClick}
        >
            {!isLoading && icon && <div>{icon}</div>}

            {isLoading ? (
                <div
                    className={`flex flex-row items-center gap-2 font-bold ${variant === "border" ? "text-[var(--voilet)]" : ""
                        }`}
                >
                    <Loader />
                    <h4>Loading</h4>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export default React.memo(Button);