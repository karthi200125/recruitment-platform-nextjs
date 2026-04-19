'use server';

import { db } from '@/lib/db';

// ✅ Standard response type
interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string; 
}

// ================= ACCEPT =================

export const employeeAccept = async (
    empId: number,
    userId: number
): Promise<ActionResponse<null>> => {
    try {
        // 🔒 Validate input
        if (!empId || !userId) {
            return { success: false, error: 'Invalid IDs' };
        }

        // ⚡ Use transaction (safe update)
        await db.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: userId },
                select: {
                    verifyEmps: true,
                    employees: true,
                },
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Remove from verify list
            const updatedVerify = user.verifyEmps.filter(
                (id) => id !== empId
            );

            // Prevent duplicate employees
            const updatedEmployees = user.employees.includes(empId)
                ? user.employees
                : [...user.employees, empId];

            await tx.user.update({
                where: { id: userId },
                data: {
                    verifyEmps: {
                        set: updatedVerify,
                    },
                    employees: {
                        set: updatedEmployees,
                    },
                },
            });
        });

        return {
            success: true,
            data: null,
            message: "Employee verified successfully",
        };
    } catch (error) {
        console.error('[EMPLOYEE_ACCEPT_ERROR]', error);

        return {
            success: false,
            error: 'Employee verification failed',
        };
    }
};

// ================= REJECT =================

export const employeeReject = async (
    empId: number,
    userId: number
): Promise<ActionResponse<null>> => {
    try {
        // 🔒 Validate input
        if (!empId || !userId) {
            return { success: false, error: 'Invalid IDs' };
        }

        await db.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: userId },
                select: {
                    verifyEmps: true,
                },
            });

            if (!user) {
                throw new Error('User not found');
            }

            const updatedVerify = user.verifyEmps.filter(
                (id) => id !== empId
            );

            await tx.user.update({
                where: { id: userId },
                data: {
                    verifyEmps: {
                        set: updatedVerify,
                    },
                },
            });
        });

        return {
            success: true,
            data: null,
            message: "Employee rejected successfully",
        };
    } catch (error) {
        console.error('[EMPLOYEE_REJECT_ERROR]', error);

        return {
            success: false,
            error: 'Employee rejection failed',
        };
    }
};