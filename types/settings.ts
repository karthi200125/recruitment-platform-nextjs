import { Role } from "@prisma/client";

export interface AccountData {
    id: number;
    username: string;
    email: string;
    role: Role | null;
    authProvider: string;
    createdAt: Date;
}

export interface ChangeEmailFormData {
    email: string;
}

export interface ActionResponse<T = unknown> {
    success?: string;
    error?: string;
    data?: T;
}

export interface ChangePasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface DeleteAccountFormData {
    confirmation: string;
}