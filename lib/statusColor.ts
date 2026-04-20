export type ApplicationStatus =
    | "APPLIED"
    | "VIEWED"
    | "SHORTLISTED"
    | "REJECTED";

export function getStatusColor(status: ApplicationStatus | string) {
    switch (status) {
        case "APPLIED":
            return "bg-gray-100 text-gray-700 border border-gray-200";

        case "VIEWED":
            return "bg-blue-100 text-blue-700 border border-blue-200";

        case "SHORTLISTED":
            return "bg-green-100 text-green-700 border border-green-200";

        case "REJECTED":
            return "bg-red-100 text-red-700 border border-red-200";

        default:
            return "bg-gray-100 text-gray-700 border border-gray-200";
    }
}
