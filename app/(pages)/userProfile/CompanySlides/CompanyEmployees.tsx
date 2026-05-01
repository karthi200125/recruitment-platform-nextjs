"use client";

import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

import { getCompaniesEmployees } from "@/actions/getCompanyEmployees";
import EmployeesSkeleton from "@/Skeletons/EmployeesSkeleton";
import Employee from "../../dashboard/employees/Employee";

interface CompanyEmployeesProps {
  employeeIds?: number[];
}

const CompanyEmployees = ({
  employeeIds,
}: CompanyEmployeesProps) => {
  const { data = [], isPending } = useQuery({
    queryKey: ["company-employees", employeeIds],
    queryFn: () => getCompaniesEmployees(employeeIds || []),
    enabled: !!employeeIds?.length,
  });

  return (
    <div className="p-2 md:p-5 border rounded-[10px]">

      {isPending && <EmployeesSkeleton />}

      {!isPending && data.length === 0 && (
        <p className="text-neutral-500 text-sm">
          No Employees yet!
        </p>
      )}

      {!isPending && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((emp: any) => (
            <Employee key={emp.id} user={emp} isVerify={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(CompanyEmployees);