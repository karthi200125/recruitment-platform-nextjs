"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { useDispatch } from "react-redux";

import { deleteJob } from "@/actions/job/delete-job";
import Button from "@/components/Button";
import { useCustomToast } from "@/lib/CustomToast";
import { closeModal } from "@/store/ModalSlice";

import JobList from "../Job/JobLists/JobList";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { JobWithCompany } from "@/types";


interface DeleteJobFormProps {
  job: JobWithCompany;
}

interface DeleteJobResponse {
  success?: string;
  error?: string;
}

const DeleteJobForm = ({
  job,
}: DeleteJobFormProps) => {
  const [isLoading, startTransition] =
    useTransition();

  const dispatch = useDispatch();

  const queryClient =
    useQueryClient();

  const { showSuccessToast, showErrorToast } =
    useCustomToast();

  const { user } = useCurrentUser()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result: DeleteJobResponse =
          await deleteJob(job.id);

        if (result.success) {
          showSuccessToast(
            result.success
          );

          if (user?.id) {
            await queryClient.invalidateQueries({
              queryKey: [
                "getUser",
                user.id,
              ],
            });
          }
        }

        if (result.error) {
          showErrorToast(
            result.error
          );
        }
      } catch (error) {
        console.error(
          "[DELETE_JOB]",
          error
        );

        showErrorToast(
          "Failed to delete job."
        );
      } finally {
        dispatch(
          closeModal(
            "deletejobmodal"
          )
        );
      }
    });
  };

  return (
    <div className="space-y-5">
      <JobList job={job} />

      <Button
        onClick={handleDelete}
        isLoading={isLoading}
        className="w-full"
      >
        Delete Job
      </Button>
    </div>
  );
};

export default DeleteJobForm;