import { getCompanyNames } from "@/actions/company/get-companies";
import { getStates } from "@/lib/getOptionsData";
import FilterNavbarClient from "./FilterNavbarClient";

export const FilterNavbar = async () => {
    const [companynames, states] = await Promise.all([
        getCompanyNames(),
        getStates(),
    ]);

    return (
        <FilterNavbarClient
            companynames={companynames}
            states={states}
        />
    );
};

export default FilterNavbar;