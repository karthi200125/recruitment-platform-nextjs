"use client";

import { ReactNode } from "react";
import Model from "@/components/Model";
import { UploadType } from "@/lib/upload/upload-types";
import { UploadFile } from "./UploadFile";

interface UploadModalProps {
    modalId: string;
    type: UploadType;
    children: ReactNode;
    className?: string;
    triggerCls?: string;
}

const UploadModal = ({
    modalId,
    type,
    children,
    className,
    triggerCls,
}: UploadModalProps) => {
    return (
        <Model
            modalId={modalId}
            triggerCls={triggerCls}
            className={`${className || "lg:max-w-lg"}`}
            bodyContent={
                <UploadFile
                    type={type}
                />
            }
        >
            {children}
        </Model>
    );
};

export default UploadModal;