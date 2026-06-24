'use client'

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTrigger
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import Icon from "./Icon";

interface BottomDrawerProps {
    children: React.ReactNode;
    body?: any;
    className?: any;
}

const BottomDrawer = ({ children, body, className }: BottomDrawerProps) => {
    return (
        <div className="!w-full md:hidden relative">
            <Drawer >
                <DrawerTrigger asChild className="w-full">
                    <button className="w-full">
                        {children}
                    </button>
                </DrawerTrigger>
                <DrawerContent className="h-[90%] w-full">
                    <div className="absolute top-2 right-3">
                        <DrawerClose>
                            <Icon icon={<X size={20} />} isHover />
                        </DrawerClose>
                    </div>

                    <div className={`w-full h-full overflow-y-auto ${className}`}>
                        {body}
                    </div>

                </DrawerContent>
            </Drawer>
        </div>

    )
}

export default BottomDrawer