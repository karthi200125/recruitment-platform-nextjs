"use client";

import { memo, useEffect, useState } from "react";
import Image from "next/image";

import Button from "@/components/Button";
import { Input } from "@/components/ui/input";

import type { ContactInfo, EasyApplyUser } from "@/types/easyApply";

interface EasyApplyUserInfoProps {
    user?: EasyApplyUser | null;
    currentStep?: number;
    initialContactInfo?: ContactInfo;
    onNext?: (step: number) => void;
    onUserdata?: (data: ContactInfo) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;

const EasyApplyUserInfo = ({ user, currentStep = 0, initialContactInfo, onNext, onUserdata }: EasyApplyUserInfoProps) => {
    const [email, setEmail] = useState(initialContactInfo?.email ?? "");
    const [phone, setPhone] = useState(initialContactInfo?.phone ?? "");
    
    useEffect(() => {
        if (initialContactInfo?.email || initialContactInfo?.phone) return;
        if (!user) return;

        setEmail(user.email ?? "");
        setPhone(user.phoneNo ?? "");
    }, [user]);

    const location = [user?.city, user?.state, user?.country].filter(Boolean).join(", ");

    const displayName =
        user?.firstName || user?.lastName ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : user?.username ?? "User";

    const isValid = EMAIL_REGEX.test(email.trim()) && PHONE_REGEX.test(phone.trim());

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isValid) return;

        onUserdata?.({ email: email.trim(), phone: phone.trim() });
        onNext?.(currentStep + 1);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">Contact Information</h2>
                <p className="mt-1 text-sm text-slate-500">
                    We've pre-filled your contact details from your profile. You can edit them for this application if needed.
                </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-slate-100">
                    <Image src={user?.profileImage || '/noProfile.webp'} alt={displayName} fill className="object-cover" />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-slate-900">{displayName}</h3>

                    {user?.profession && <p className="mt-1 text-sm text-slate-600">{user.profession}</p>}

                    <p className="mt-1 text-sm text-slate-500">{location || "Location not added"}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">
                        Email Address
                    </label>

                    <Input
                        id="email"
                        type="email"
                        value={email}
                        autoComplete="email"
                        placeholder="john@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                        Phone Number
                    </label>

                    <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        autoComplete="tel"
                        placeholder="9876543210"
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={!isValid}>
                        Next
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default memo(EasyApplyUserInfo);