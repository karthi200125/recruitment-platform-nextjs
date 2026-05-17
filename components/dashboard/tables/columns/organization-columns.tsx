"use client";

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";

import { Prisma } from "@prisma/client";

import {
  MoreHorizontal,
  Users,
  Pencil,
  Trash2,
  Eye,
  Building2,
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type OrganizationPostedJob =
  Prisma.JobGetPayload<{
    include: {
      company: true;

      jobApplications: {
        select: {
          id: true;
        };
      };
    };
  }>;

// ─────────────────────────────────────────────
// Organization Posted Jobs Columns
// ─────────────────────────────────────────────

export const OrganizationPostedColumns: ColumnDef<OrganizationPostedJob>[] =
  [
    // Job
    {
      accessorKey: "jobTitle",

      header: "Job",

      cell: ({ row }) => {
        const job = row.original;

        return (
          <div className="flex min-w-[260px] items-start gap-3">
            {/* Logo */}
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <Building2 className="h-5 w-5 text-slate-500" />
            </div>

            {/* Info */}
            <div className="min-w-0 space-y-1">
              <Link
                href={`/jobs/${job.id}`}
                className="line-clamp-1 text-sm font-semibold text-slate-900 hover:text-indigo-600"
              >
                {job.jobTitle}
              </Link>

              <p className="line-clamp-1 text-xs text-slate-500">
                {job.company.companyName}
              </p>

              {/* Mobile */}
              <div className="flex items-center gap-2 pt-1 lg:hidden">
                <span className="rounded-full bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700">
                  {
                    job.jobApplications
                      .length
                  }{" "}
                  Applicants
                </span>
              </div>
            </div>
          </div>
        );
      },
    },

    // Applicants
    {
      accessorKey: "applicants",

      header: "Applicants",

      cell: ({ row }) => {
        const job = row.original;

        return (
          <div className="hidden lg:block">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />

              <span className="text-sm font-medium text-slate-700">
                {
                  job.jobApplications
                    .length
                }
              </span>
            </div>
          </div>
        );
      },
    },

    // Status
    {
      accessorKey: "status",

      header: "Status",

      cell: ({ row }) => {
        const job = row.original;

        const isActive =
          job.status === "ACTIVE";

        return (
          <div className="hidden lg:block">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
                }`}
            >
              {isActive
                ? "Active"
                : "Closed"}
            </span>
          </div>
        );
      },
    },

    // Created
    {
      accessorKey: "createdAt",

      header: "Posted",

      cell: ({ row }) => {
        const job = row.original;

        return (
          <div className="hidden lg:block">
            <p className="text-sm text-slate-600">
              {formatDistanceToNow(
                new Date(job.createdAt),
                {
                  addSuffix: true,
                }
              )}
            </p>
          </div>
        );
      },
    },

    // Actions
    {
      id: "actions",

      cell: ({ row }) => {
        const job = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-52 rounded-xl"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />

                    View Job
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/jobs/${job.id}/applications`}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Users className="h-4 w-4" />

                    View Applicants
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                  <Pencil className="h-4 w-4" />

                  Edit Job
                </DropdownMenuItem>

                <DropdownMenuItem className="flex cursor-pointer items-center gap-2 text-red-600 focus:text-red-600">
                  <Trash2 className="h-4 w-4" />

                  Delete Job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];