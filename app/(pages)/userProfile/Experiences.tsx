"use client";

import { useDispatch } from "react-redux";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import { UserExperienceForm } from "@/app/Forms/UserExperienceForm";
import DeleteExperienceForm from "@/app/Forms/DeleteExperienceForm";
import { openModal } from "@/app/Redux/ModalSlice";

import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Model from "@/components/Model/Model";

import ExperiencesSkeleton from "@/Skeletons/ExperiencesSkeleton";

import { GoPlus } from "react-icons/go";
import { LuPencil } from "react-icons/lu";
import { CiTrash } from "react-icons/ci";

import Image from "next/image";
import noImage from "../../../public/noImage.webp";

interface Experience {
  id: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  description?: string | null;
}

interface ExperiencesProps {
  experiences?: Experience[];
  isLoading?: boolean;
  profileUserId?: number;
}

const Experiences = ({
  experiences = [],
  isLoading = false,
  profileUserId,
}: ExperiencesProps) => {
  const dispatch = useDispatch();
  const { user } = useCurrentUser();

  const isCurrentUser = user?.id === profileUserId;

  return (
    <section className="relative w-full min-h-[100px] rounded-[20px] border p-5 space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Experience</h3>

        {isCurrentUser && (
          <Model
            bodyContent={<UserExperienceForm />}
            modalId="userExpModal"
            title="Add your Experience"
            className="min-w-[300px] lg:w-[1000px]"
          >
            <Button
              variant="border"
              icon={<GoPlus size={20} />}
              onClick={() =>
                dispatch(openModal("userExpModal"))
              }
            >
              Add
            </Button>
          </Model>
        )}
      </div>

      {/* LOADING */}
      {isLoading && <ExperiencesSkeleton />}

      {/* EMPTY */}
      {!isLoading && experiences.length === 0 && (
        <p className="text-sm text-neutral-400">
          No experience added yet.
        </p>
      )}

      {/* DATA */}
      {!isLoading &&
        experiences.map((exp) => {
          const editId = `edit-exp-${exp.id}`;
          const deleteId = `delete-exp-${exp.id}`;

          return (
            <div
              key={exp.id}
              className="relative flex gap-5 items-start min-h-[100px]"
            >
              <Image
                src={noImage.src}
                alt="experience"
                width={50}
                height={50}
                className="bg-neutral-200"
              />

              <div>
                <h4 className="font-bold capitalize">
                  {exp.companyName}
                </h4>

                <h5 className="text-[var(--lighttext)]">
                  {exp.startDate} - {exp.endDate}
                </h5>

                <h5 className="capitalize">
                  {exp.position}
                </h5>

                {exp.description && (
                  <p className="text-neutral-400 text-sm">
                    {exp.description}
                  </p>
                )}
              </div>

              {/* ACTIONS */}
              {isCurrentUser && (
                <div className="absolute right-3 top-3 flex gap-4">

                  {/* EDIT */}
                  <Model
                    bodyContent={
                      <UserExperienceForm
                        experience={exp}
                        edit
                      />
                    }
                    modalId={editId}
                    title="Edit Experience"
                    className="lg:w-[1000px]"
                  >
                    <Icon
                      icon={<LuPencil size={20} />}
                      isHover
                      onClick={() =>
                        dispatch(openModal(editId))
                      }
                    />
                  </Model>

                  {/* DELETE */}
                  <Model
                    bodyContent={
                      <DeleteExperienceForm exp={exp} />
                    }
                    modalId={deleteId}
                    title="Delete Experience"
                    className="w-[400px]"
                  >
                    <Icon
                      icon={<CiTrash size={20} />}
                      isHover
                      onClick={() =>
                        dispatch(openModal(deleteId))
                      }
                    />
                  </Model>
                </div>
              )}
            </div>
          );
        })}
    </section>
  );
};

export default Experiences;