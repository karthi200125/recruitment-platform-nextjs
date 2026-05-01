"use client";

import { memo } from "react";

interface Company {
  companyAbout?: string | null;
}

const AboutCompanyProfile = ({
  company,
}: {
  company?: Company | null;
}) => {
  return (
    <div className="p-5 border rounded-md space-y-5">
      <h3 className="font-bold">About Company</h3>

      <p className="text-[var(--lighttext)] text-sm">
        {company?.companyAbout ||
          "No company description provided."}
      </p>
    </div>
  );
};

export default memo(AboutCompanyProfile);