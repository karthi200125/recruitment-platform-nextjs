"use client";

import { Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

import { getCompaniesEmployees } from "@/actions/user/get-company-employees";
import Employee from "@/app/(protected)/dashboard/employees/Employee";
import EmployeesSkeleton from "@/components/skeletons/EmployeesSkeleton";

interface CompanyEmployeesProps {
  employeeIds?: number[];
}

type EmployeeType = Prisma.UserGetPayload<{}>;

const CompanyEmployees = ({
  employeeIds,
}: CompanyEmployeesProps) => {
  const { data = [], isPending } = useQuery({
    queryKey: ["company-employees", employeeIds],
    queryFn: () => getCompaniesEmployees(employeeIds ?? []),
    enabled: !!employeeIds?.length,
  });

  return (
    <div className="rounded-[10px] border p-2 md:p-5">
      {isPending && <EmployeesSkeleton />}

      {!isPending && data.length === 0 && (
        <p className="text-sm text-neutral-500">
          No Employees yet!
        </p>
      )}

      {!isPending && data.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.map((emp: EmployeeType) => (
            <Employee
              key={emp.id}
              user={emp}
              isVerify={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(CompanyEmployees);