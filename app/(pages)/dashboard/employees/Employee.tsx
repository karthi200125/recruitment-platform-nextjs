'use client';

import { memo, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Prisma } from '@prisma/client';
import { FaCheckCircle } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';

import { employeeAccept, employeeReject } from '@/actions/company/employeeAction';
import { useCustomToast } from '@/lib/CustomToast';
import Button from '@/components/Button';
import Batch from '@/components/Batch';

import noAvatar from '../../../../public/noImage.webp';


type EmployeeUser = Prisma.UserGetPayload<{}>;

interface EmployeeProps {
    user: EmployeeUser;
    currentUserId: number;
    isVerify?: boolean;
    onSuccess?: () => void;
}


const Employee = ({
    user,
    currentUserId,
    isVerify,
    onSuccess,
}: EmployeeProps) => {
    const [isAcceptPending, startAcceptTransition] = useTransition();
    const [isRejectPending, startRejectTransition] = useTransition();

    const { showErrorToast, showSuccessToast } = useCustomToast();



    const handleAccept = () => {
        startAcceptTransition(async () => {
            const res = await employeeAccept(user.id, currentUserId);

            if (res?.success) {
                showSuccessToast(res.message || "Success");
                onSuccess?.();
            } else {
                showErrorToast(res?.error || 'Something went wrong');
            }
        });
    };

    const handleReject = () => {
        startRejectTransition(async () => {
            const res = await employeeReject(user.id, currentUserId);

            if (res?.success) {
                showSuccessToast(res.message || "Success");
                onSuccess?.();
            } else {
                showErrorToast(res?.error || 'Something went wrong');
            }
        });
    };



    return (
        <div className="flex items-start gap-4 p-4 rounded-2xl border bg-white/70 backdrop-blur-sm hover:shadow-md transition-all duration-200">
            {/* Avatar */}
            <div className="shrink-0">
                <Image
                    src={user?.userImage || noAvatar.src}
                    alt={user?.username || 'User'}
                    width={50}
                    height={50}
                    className="rounded-xl object-cover bg-neutral-200"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
                {/* User Info */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                            href={`/userProfile/${user.id}`}
                            className="font-semibold hover:underline"
                        >
                            {user.username}
                        </Link>

                        {user.isPro && <Batch type="premium" />}
                    </div>

                    {user.profession && (
                        <p className="text-sm text-neutral-500">
                            {user.profession}
                        </p>
                    )}
                </div>

                {/* Actions */}
                {isVerify && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button
                            variant="border"
                            icon={
                                <FaCheckCircle size={14} className="text-green-500" />
                            }
                            className="!h-[32px] !px-3 text-green-600 border-green-400 hover:bg-green-50"
                            onClick={handleAccept}
                            isLoading={isAcceptPending}
                        >
                            Accept
                        </Button>

                        <Button
                            variant="border"
                            icon={
                                <MdCancel size={14} className="text-red-500" />
                            }
                            className="!h-[32px] !px-3 text-red-600 border-red-400 hover:bg-red-50"
                            onClick={handleReject}
                            isLoading={isRejectPending}
                        >
                            Reject
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(Employee);