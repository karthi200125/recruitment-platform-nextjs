import { getCompanyProfileData } from "@/actions/company/get-company-profile-data";
import CompanySlideClient from "./companySlideClient";

interface CompanySlidesServerProps {
    userId: number;
}

const CompanySlidesServer = async ({
    userId,
}: CompanySlidesServerProps) => {
    const data = await getCompanyProfileData(userId);

    if (!data?.company) {
        return null;
    }

    return (
        <CompanySlideClient
            company={data.company}
        />
    );
};

export default CompanySlidesServer;