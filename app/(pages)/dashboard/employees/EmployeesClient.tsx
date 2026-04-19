'use client';

import { Prisma } from '@prisma/client';

import Employee from './Employee';
import EmployeesSkeleton from '@/Skeletons/EmployeesSkeleton';

// ================= TYPES =================

type EmployeeUser = Prisma.UserGetPayload<{}>;

interface EmployeesClientProps {
    user: {
        employees: number[];
        verifyEmps: number[];
    };
    companyEmps: EmployeeUser[];
    verificationEmps: EmployeeUser[];
    currentUserId: number;
}

// ================= COMPONENT =================

const EmployeesClient = ({
    user,
    companyEmps,
    verificationEmps,
    currentUserId,
}: EmployeesClientProps) => {
    return (
        <div className="w-full min-h-screen px-2 md:px-4 py-6 space-y-6">
            {/* 🔹 Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-xl md:text-2xl font-semibold">
                    Employees Dashboard
                </h1>
                <p className="text-sm text-neutral-500">
                    Manage your employees and verification requests
                </p>
            </div>

            {/* 🔹 Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* ================= VERIFICATION ================= */}
                <EmployeeSection
                    title="Verification Requests"
                    count={user.verifyEmps?.length ?? 0}
                    data={verificationEmps}
                    emptyText="No verification requests yet"
                    isVerify
                />

                {/* ================= EMPLOYEES ================= */}
                <EmployeeSection
                    title="Company Employees"
                    count={user.employees?.length ?? 0}
                    data={companyEmps}
                    emptyText="No employees added yet"
                />
            </div>
        </div>
    );
};

export default EmployeesClient;

// ================= SECTION =================

interface EmployeeSectionProps {
    title: string;
    count: number;
    data: EmployeeUser[];
    emptyText: string;
    isVerify?: boolean;
}

const EmployeeSection = ({
    title,
    count,
    data,
    emptyText,
    isVerify = false,
}: EmployeeSectionProps) => {
    return (
        <section className="rounded-2xl border bg-white/70 backdrop-blur-sm p-5 shadow-sm space-y-4">
            {/* 🔹 Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    {title}{' '}
                    <span className="text-neutral-400 text-sm">
                        ({count})
                    </span>
                </h2>
            </div>

            {/* 🔹 Content */}
            {data.length === 0 ? (
                <EmptyState text={emptyText} />
            ) : (
                <div className="space-y-3">
                    {data.map((emp) => (
                        <div
                            key={emp.id}
                            className="group p-3 rounded-xl border bg-white hover:shadow-sm transition-all duration-200"
                        >
                            <Employee
                                currentUserId={currentUserId}
                                user={emp}
                                isVerify={isVerify}
                            />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

// ================= EMPTY STATE =================

const EmptyState = ({ text }: { text: string }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-neutral-500 text-sm">
            <div className="text-3xl mb-2">👥</div>
            <p>{text}</p>
        </div>
    );
};