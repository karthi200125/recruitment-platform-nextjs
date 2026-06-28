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
import { AppDispatch, RootState } from "@/store/Store";
import React, { ReactElement, ReactNode, useCallback, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

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
    const dispatch = useDispatch<AppDispatch>();
    const isOpen = useSelector((state: RootState) => state.modal.modals[modalId], shallowEqual);

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
            <DialogContent className={`${className} max-h-screen md:max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl ring-1 ring-slate-900/5 bg-white`}>
                {title &&
                    <DialogHeader className="borderb pb-3 sticky top-0 left-0 bg-white">
                        <h2
                            id={`${title}-title`}
                            className="text-lg font-bold text-slate-900"
                        >
                            {title}
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">{desc}</p>
                        {/* {title && <DialogTitle className="capitalize">{title}</DialogTitle>}
                    {desc && <DialogDescription>{desc}</DialogDescription>} */}
                    </DialogHeader>
                }
                <div className="w-full max-h-max px-1 pb-6">
                    {clonedBodyContent}
                </div>
            </DialogContent>
        </Dialog >
    );
};

export default Model;
