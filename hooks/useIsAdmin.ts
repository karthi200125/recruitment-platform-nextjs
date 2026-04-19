
import { useCurrentRole } from "./useCurrentRole";

export const useIsAdmin = () => {
    const role = useCurrentRole();

    return role === 'ADMIN';
};