import { cn } from "@/lib/utils";
import { ApplicationStatus } from "@prisma/client";

import {
  getApplicationStatusLabel,
  getApplicationStatusStyle,
} from "@/lib/application-status";

interface DashboardStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const DashboardStatusBadge = ({
  status,
  className,
}: DashboardStatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-tight whitespace-nowrap",
        getApplicationStatusStyle(status),
        className
      )}
    >
      {getApplicationStatusLabel(status)}
    </span>
  );
};

export default DashboardStatusBadge;