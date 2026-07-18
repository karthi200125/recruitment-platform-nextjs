"use client";

import Link from "next/link";
import { Role } from "@prisma/client";
import { Plus, Briefcase, Users } from "lucide-react";
import { useDispatch } from "react-redux";

import Button from "@/components/Button";
import Model from "@/components/Model";

import InviteRecruiter from "@/app/(protected)/dashboard/(inviteRecruiter)/InviteRecruiter";

import { openModal } from "@/store/ModalSlice";

interface RoleActionProps {
    role: Role;
    isCompanyMember?: boolean;
}

const RoleAction = ({
    role,
    isCompanyMember = false,
}: RoleActionProps) => {
    const dispatch = useDispatch();

    if (role === Role.CANDIDATE) {
        return (
            <Link href="/jobs">
                <Button variant="default">
                    <Briefcase className="h-4 w-4" />
                    Browse Jobs
                </Button>
            </Link>
        );
    }

    if (role === Role.RECRUITER) {
        return (
            <Link
                href={
                    isCompanyMember
                        ? "/create-job"
                        : "/jobs"
                }
            >
                <Button variant="default">
                    {isCompanyMember ? (
                        <>
                            <Plus className="h-4 w-4" />
                            Post Job
                        </>
                    ) : (
                        <>
                            <Briefcase className="h-4 w-4" />
                            Browse Jobs
                        </>
                    )}
                </Button>
            </Link>
        );
    }

    return (
        <Model
            modalId="InviteRecruiterModal"
            title="Invite Recruiters"
            className="lg:max-w-5xl"
            bodyContent={<InviteRecruiter />}
        >
            <Button
                variant="default"
                onClick={() =>
                    dispatch(
                        openModal("InviteRecruiterModal")
                    )
                }
            >
                <Users className="h-4 w-4" />
                Invite Recruiters
            </Button>
        </Model>
    );
};

export default RoleAction;