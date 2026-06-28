'use client';

import { ReactNode } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { X } from "lucide-react";

import Icon from "./Icon";

interface BottomDrawerProps {
    children: ReactNode;
    body?: ReactNode;
    className?: string;
}

const BottomDrawer = ({
    children,
    body,
    className,
}: BottomDrawerProps) => {
    return (
        <div className="relative !w-full md:hidden">
            <Drawer>
                <DrawerTrigger asChild className="w-full">
                    <button className="w-full">
                        {children}
                    </button>
                </DrawerTrigger>

                <DrawerContent className="h-[90%] w-full">
                    <div className="absolute right-3 top-2">
                        <DrawerClose>
                            <Icon icon={<X size={20} />} isHover />
                        </DrawerClose>
                    </div>

                    <div className={`h-full w-full overflow-y-auto ${className ?? ""}`}>
                        {body}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default BottomDrawer;