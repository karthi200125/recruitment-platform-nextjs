"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import Button from "@/components/Button";
import { Input } from "@/components/ui/input";

interface SettingDangerZoneCardProps {
    onDelete?: () => void;
    isLoading?: boolean;
}

const CONFIRM_TEXT = "DELETE";

const SettingDangerZoneCard = ({
    onDelete,
    isLoading = false,
}: SettingDangerZoneCardProps) => {
    const [confirmText, setConfirmText] = useState("");

    const canDelete = confirmText === CONFIRM_TEXT;

    return (
        <div className="rounded-2xl border border-red-200 bg-white">
            <div className="border-b border-red-100 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Danger Zone
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Permanently delete your account.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6 p-6">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="font-medium text-red-700">
                        This action cannot be undone.
                    </p>

                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-red-600">
                        <li>Your profile will be permanently deleted.</li>
                        <li>Your job applications will be removed.</li>
                        <li>Your saved jobs will be removed.</li>
                        <li>Your followers and following will be removed.</li>
                        <li>You will lose access to your account forever.</li>
                    </ul>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                        Type{" "}
                        <span className="font-bold text-red-600">
                            {CONFIRM_TEXT}
                        </span>{" "}
                        to confirm.
                    </label>

                    <Input
                        value={confirmText}
                        onChange={(e) =>
                            setConfirmText(e.target.value.toUpperCase())
                        }
                        placeholder="Type DELETE"
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        variant="border"
                        disabled={!canDelete || isLoading}
                        isLoading={isLoading}
                        onClick={onDelete}
                    >
                        Delete Account
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SettingDangerZoneCard;