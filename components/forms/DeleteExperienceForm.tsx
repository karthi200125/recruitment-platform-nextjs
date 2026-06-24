'use client'

import Button from "@/components/Button"
import { useCustomToast } from "@/lib/CustomToast";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image"
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "@/store/ModalSlice";
import { deleteExperience } from "@/actions/user/delete-experience";
import noImage from '@/public/noImage.webp'

const DeleteExperienceForm = ({ exp }: any) => {

    const [isLoading, startTransition] = useTransition();
    const queryClient = useQueryClient();

    const dispatch = useDispatch()

    const { userId } = useParams()
    const id = Number(userId)
    const { showSuccessToast, showErrorToast } = useCustomToast()

    const HandleDelete = () => {
        startTransition(() => {
            deleteExperience(exp?.id)
                .then((data: any) => {
                    if (data?.success) {
                        showSuccessToast(data?.success)
                        queryClient.invalidateQueries({ queryKey: ['getuserExperience', id] })
                        dispatch(closeModal('userDeleteExpModal'))
                    }
                    if (data?.error) {
                        showErrorToast(data?.error)
                        dispatch(closeModal('userDeleteExpModal'))
                    }
                })
        })
    }

    return (
        <div className="w-full">
            <div className='relative flex flex-row gap-5 items-start min-h-[100px]' key={exp?.id}>
                <Image src={noImage.src} alt='' width={50} height={50} className='bg-neutral-200 object-cover' />
                <div>
                    <h4 className='capitalize font-bold'>{exp?.companyName}</h4>
                    <h5 className='capitalize'>{exp?.position}</h5>
                    <h5 className='capitalize text-[var(--lighttext)]'>{exp?.startDate} - {exp?.endDate}</h5>
                    <h5>{exp?.description}%</h5>
                </div>
            </div>
            <Button className='w-full' isLoading={isLoading} onClick={HandleDelete}>Delete experience</Button>
        </div>
    )
}

export default DeleteExperienceForm