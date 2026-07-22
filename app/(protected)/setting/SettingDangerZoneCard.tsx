"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { AlertTriangle } from "lucide-react";

import Button from "@/components/Button";
import { Input } from "@/components/ui/input";
import { useCustomToast } from "@/lib/CustomToast";
import { deleteAccount } from "@/actions/settings";

const CONFIRM_TEXT = "DELETE";

const SettingDangerZoneCard = () => {
    const [confirmText, setConfirmText] = useState("");
    const [isPending, startTransition] = useTransition();
    const { showErrorToast } = useCustomToast();
    const router = useRouter();

    const canDelete = confirmText === CONFIRM_TEXT;

    const handleDelete = () => {
        if (!canDelete || isPending) return;

        startTransition(async () => {
            const result = await deleteAccount();

            if (result.error) {
                showErrorToast(result.error);
                return;
            }
            
            await signOut({ redirect: false });
            router.push("/signin");
        });
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm shadow-red-100/50">
            <div className="border-b border-red-100 bg-gradient-to-r from-red-50/60 to-transparent px-7 py-6">
                <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                        <AlertTriangle className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Danger Zone</h2>
                        <p className="mt-1 text-sm text-slate-500">Permanently delete your account.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6 p-7">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="font-medium text-red-700">This action cannot be undone.</p>
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
                        Type <span className="font-bold text-red-600">{CONFIRM_TEXT}</span> to confirm.
                    </label>

                    <Input
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                        placeholder="Type DELETE"
                        disabled={isPending}
                    />
                </div>

                <div className="flex justify-end">
                    <Button variant="border" disabled={!canDelete || isPending} isLoading={isPending} onClick={handleDelete}>
                        Delete Account
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SettingDangerZoneCard;