'use client';

import { useEffect, useRef } from 'react';
import { X, Keyboard } from 'lucide-react';

import JobsSearchBar from '@/components/JobsSearchBar';

interface SearchModalProps {
    open: boolean;
    onClose: () => void;
}

const SearchModal = ({
    open,
    onClose,
}: SearchModalProps) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;

        closeButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            ref={overlayRef}
            onClick={(event) => {
                if (event.target === overlayRef.current) {
                    onClose();
                }
            }}
            className="fixed inset-0 z-[999] flex items-start justify-center bg-black/60 px-4 pt-20 backdrop-blur-sm sm:pt-24"
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-modal-title"
        >
            <div className="w-full max-w-5xl max-h-max rounded-2xl border border-neutral-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">

                    <div>
                        <h2
                            id="search-modal-title"
                            className="text-base font-semibold text-neutral-900"
                        >
                            Find your next role
                        </h2>

                        <p className="mt-1 text-xs text-neutral-500">
                            Search thousands of verified opportunities.
                        </p>
                    </div>

                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close search modal"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Search */}

                <div className="px-6 py-6">
                    <JobsSearchBar className="w-full" />
                </div>

                {/* Footer */}

                <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50 px-6 py-3">
                    <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                        <span className="flex items-center gap-1">
                            <kbd className="rounded border bg-white px-1.5 py-0.5 font-mono text-[10px]">
                                ↵
                            </kbd>
                            Search
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="rounded border bg-white px-1.5 py-0.5 font-mono text-[10px]">
                                Esc
                            </kbd>
                            Close
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                        <Keyboard size={12} />
                        <span>Powered by Jobify Search</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;