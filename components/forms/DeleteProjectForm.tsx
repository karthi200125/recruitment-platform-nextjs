'use client'

import { deleteProject } from "@/actions/user/delete-project";
import Button from "@/components/Button"
import { useCustomToast } from "@/lib/CustomToast";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image"
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { closeModal } from "@/store/ModalSlice";
import { useDispatch } from "react-redux";
import noImage from '../../public/noImage.webp'

const DeleteProjectForm = ({ project }: any) => {
    const [isLoading, startTransition] = useTransition();
    const queryClient = useQueryClient();
    const { showSuccessToast, showErrorToast } = useCustomToast()
    const dispatch = useDispatch()

    const { userId } = useParams()
    const id = Number(userId)

    const HandleDelete = () => {
        startTransition(() => {
            deleteProject(project?.id)
                .then((data: any) => {
                    if (data?.success) {
                        queryClient.invalidateQueries({ queryKey: ['getUserProjects', id] })
                        queryClient.invalidateQueries({ queryKey: ['getuser', id] })
                        showSuccessToast(data?.success)
                        dispatch(closeModal('projectDeleteModal'))
                    }
                    if (data?.error) {
                        showErrorToast(data?.error)
                        dispatch(closeModal('projectDeleteModal'))
                    }
                })
        })
    }

    return (
        <div className="w-full space-y-5">
            <div className='flex flex-row gap-5 items-start min-h-[100px]'>
                <Image src={project?.proImage || noImage.src} alt={project?.proName} width={50} height={50} className='bg-neutral-200 h-full w-full flex-1 rounded-md' />
                <div className="space-y-1 flex-1">
                    <h4 className='capitalize font-bold'>{project?.proName}</h4>
                    <h6>{project?.proLink}</h6>
                    <h6 className='line-clamp-2 text-[var(--lighttext)]'>{project?.proDesc}</h6>
                </div>
            </div>
            <Button className='w-full' isLoading={isLoading} onClick={HandleDelete}>Delete Project</Button>
        </div>
    )
}

export default DeleteProjectForm