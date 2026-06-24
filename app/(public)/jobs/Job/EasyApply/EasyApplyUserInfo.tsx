"use client";

import Button from "@/components/Button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import noProfile from "../../../../../public/noProfile.webp";
import { EasyApplyUser, ContactInfo } from "@/types/easyApply";


/* ================= TYPES ================= */

interface EasyApplyUserInfoProps {
    user?: EasyApplyUser | null;
    currentStep?: number;
    onNext?: (step: number) => void;
    onUserdata?: (data: ContactInfo) => void;
}

/* ================= COMPONENT ================= */

const EasyApplyUserInfo = ({
    user,
    currentStep = 0,
    onNext,
    onUserdata,
}: EasyApplyUserInfoProps) => {
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    // ✅ Sync user data when loaded (React Query safe)
    useEffect(() => {
        if (user) {
            setEmail(user.email ?? "");
            setPhone(user.phoneNo ?? "");
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !phone) return;

        onUserdata?.({
            email,
            phone,
        });

        onNext?.(currentStep + 1);
    };

    const location = [user?.city, user?.state, user?.country]
        .filter(Boolean)
        .join(", ");

    return (
        <div className="w-full space-y-5">
            <div className="space-y-2">
                <h3>Contact Info</h3>

                {/* User Card */}
                <div className="w-full border p-5 rounded-md flex gap-5">
                    <div className="h-[80px] w-[80px] relative rounded-md overflow-hidden bg-neutral-200">
                        <Image
                            src={user?.userImage || noProfile}
                            alt="User profile"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="space-y-2 w-[70%]">
                        <h4 className="font-bold capitalize">
                            {user?.username || "User"}
                        </h4>

                        <h5 className="text-[var(--lighttext)]">
                            {location || "Location not set"}
                        </h5>
                    </div>
                </div>

                {/* Form */}
                <form
                    className="w-full border p-5 rounded-md space-y-4"
                    onSubmit={handleSubmit}
                >
                    <div className="space-y-2">
                        <h4 className="font-semibold">Email</h4>
                        <Input
                            value={email}
                            name="email"
                            type="email"
                            placeholder="example@gmail.com"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold">Phone Number</h4>
                        <Input
                            value={phone}
                            name="phone"
                            type="tel"
                            placeholder="9876543210"
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <Button disabled={!email || !phone}>
                        Next
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default EasyApplyUserInfo;