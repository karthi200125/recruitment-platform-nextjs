'use client';

import React from 'react';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from '@/components/ui/tooltip';

interface IconProps {
    icon: React.ReactNode;
    href?: string;
    className?: string;
    count?: number;
    title?: string;
    tooltipBg?: 'white' | 'black';
    isHover?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Icon = ({
    icon,
    href,
    className = '',
    count = 0,
    title,
    tooltipBg = 'black',
    isHover = false,
    onClick,
}: IconProps) => {
    const commonClassName = `
    ${className}
    ${isHover ? 'hover:bg-neutral-100 w-[40px] h-[40px]' : ''}
    relative
    cursor-pointer
    trans
    rounded-[10px]
    flexcenter
  `;

    const content = (
        <>
            {icon}

            {count > 0 && (
                <span
                    className="absolute top-[-6px] right-[-9px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
                    aria-label={`${count} notifications`}
                >
                    {count}
                </span>
            )}
        </>
    );

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {href ? (
                        <Link
                            href={href}
                            aria-label={title}
                            className={commonClassName}
                        >
                            {content}
                        </Link>
                    ) : (
                        <button
                            type="button"
                            aria-label={title}
                            onClick={onClick}
                            className={commonClassName}
                        >
                            {content}
                        </button>
                    )}
                </TooltipTrigger>

                {title && (
                    <TooltipContent
                        className={`rounded-[5px] px-3 py-2 text-xs ${tooltipBg === 'white'
                            ? 'border bg-white text-black'
                            : 'bg-black text-white'
                            }`}
                    >
                        <p className="font-bold">{title}</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );
};

export default React.memo(Icon);