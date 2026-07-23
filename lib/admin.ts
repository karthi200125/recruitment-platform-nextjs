export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

export const isAdmin = (
    email?: string | null
): boolean => {
    return (
        !!email &&
        email.toLowerCase() ===
        ADMIN_EMAIL.toLowerCase()
    );
};