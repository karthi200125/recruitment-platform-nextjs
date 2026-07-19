"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import {
    MoreHorizontal,
    SquarePen,
    Trash2,
    ArrowUpRight,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Button from "@/components/Button";
import { openModal } from "@/store/ModalSlice";

interface DashboardActionButtonProps {
    edit?: {
        modalId: string;
        data?: unknown;
        label?: string;
        onClick?: () => void;
    };

    delete?: {
        modalId: string;
        data?: unknown;
        label?: string;
        onClick?: () => void;
    };

    navigate?: {
        href: string;
        label?: string;
    };

    align?: "start" | "center" | "end";
}

const DashboardActionButton = ({
    edit,
    delete: deleteAction,
    navigate,
    align = "end",
}: DashboardActionButtonProps) => {
    const dispatch = useDispatch();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="border"                    
                    className="h-9 w-9 rounded-lg"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align={align}
                className="min-w-[190px]"
            >
                {navigate && (
                    <DropdownMenuItem asChild>
                        <Link
                            href={navigate.href}
                            className="flex cursor-pointer items-center gap-2"
                        >
                            <ArrowUpRight className="h-4 w-4" />
                            {navigate.label ?? "View"}
                        </Link>
                    </DropdownMenuItem>
                )}

                {edit && (
                    <DropdownMenuItem
                        onClick={() => {
                            edit.onClick?.();
                            dispatch(openModal(edit.modalId));
                        }}
                        className="cursor-pointer"
                    >
                        <SquarePen className="mr-2 h-4 w-4" />
                        {edit.label ?? "Edit"}
                    </DropdownMenuItem>
                )}

                {deleteAction && (
                    <DropdownMenuItem
                        onClick={() => {
                            deleteAction.onClick?.();
                            dispatch(
                                openModal(deleteAction.modalId)
                            );
                        }}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deleteAction.label ?? "Delete"}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DashboardActionButton;