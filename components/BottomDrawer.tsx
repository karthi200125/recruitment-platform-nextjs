'use client';

import { ReactNode } from "react";
import { X } from "lucide-react";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
} from "@/components/ui/drawer";

interface BottomDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: ReactNode;
    children: ReactNode;
    className?: string;
}

// Controlled, reusable bottom drawer — mobile/tablet only by convention
// (wrap usages in a `md:hidden` context, same as everywhere else in this
// app). Controlled (open/onOpenChange) rather than trigger-wrapped, since
// most real use cases (like job selection here) already have their own
// trigger elsewhere — a list row, a card, a button — and just need the
// drawer's visibility driven by existing state, not a second trigger button
// bolted on top of it.
const BottomDrawer = ({ open, onOpenChange, title, children, className }: BottomDrawerProps) => {
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="flex h-[90vh] w-full flex-col outline-none lg:hidden">
                {/* Fixed header: drag handle (rendered by DrawerContent itself),
                    optional title, and close button — never scrolls */}
                <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 px-5 py-3">
                    <div className="min-w-0 flex-1">{title}</div>

                    <DrawerClose asChild>
                        <button
                            type="button"
                            aria-label="Close"
                            className="ml-3 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X className="h-5 w-5" strokeWidth={2} />
                        </button>
                    </DrawerClose>
                </div>

                {/* Scrollable body — only this area scrolls, not the whole drawer */}
                <div className={`flex-1 overflow-y-auto ${className ?? ""}`}>
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default BottomDrawer;