import { Building2 } from "lucide-react";

const CompaniesEmpty = () => {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Building2 className="h-8 w-8 text-slate-400" />
            </div>

            <h2 className="mt-6 text-lg font-semibold text-slate-900">
                No companies found
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                There are currently no verified companies available. Please
                check back later as new companies join the platform.
            </p>
        </div>
    );
};

export default CompaniesEmpty;