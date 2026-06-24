"use client";


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { closeModal, openModal } from "@/store/ModalSlice";
import React, { memo, useCallback, useMemo, ReactNode, ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ModelProps {
    modalId: string;
    children: ReactNode;
    className?: string;
    triggerCls?: string;
    title?: string;
    desc?: string;
    bodyContent?: ReactElement<{ onClose: () => void }>;
}

const Model = ({ modalId, children, className, title, desc, bodyContent, triggerCls }: ModelProps) => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: any) => state.modal.modals[modalId] || false);

    const handleClose = useCallback(() => {
        dispatch(closeModal(modalId));
    }, [dispatch, modalId]);

    const handleOpen = useCallback(() => {
        dispatch(openModal(modalId));
    }, [dispatch, modalId]);

    const clonedBodyContent = useMemo(() =>
        bodyContent && React.isValidElement(bodyContent)
            ? React.cloneElement(bodyContent, { onClose: handleClose })
            : null,
        [bodyContent, handleClose]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogTrigger asChild>
                <button onClick={handleOpen} className={triggerCls}>
                    {children}
                </button>
            </DialogTrigger>
            <DialogContent className={`${className} max-h-screen md:max-h-[90vh] overflow-y-auto`}>
                <DialogHeader className="borderb pb-3 sticky top-0 left-0 bg-white">
                    {title && <DialogTitle className="capitalize">{title}</DialogTitle>}
                    {desc && <DialogDescription>{desc}</DialogDescription>}
                </DialogHeader>
                <div className="w-full max-h-max px-1 pb-6">
                    {clonedBodyContent}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default memo(Model);
