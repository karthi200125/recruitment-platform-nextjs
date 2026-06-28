import DeleteProjectForm from '@/components/forms/DeleteProjectForm';
import { UserProjectForm } from '@/components/forms/UserProjectForm';
import Icon from '@/components/Icon';
import Model from '@/components/Model';
import { openModal } from '@/store/ModalSlice';
import { Pencil, Trash2 } from "lucide-react";
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import noImage from '@/public/noImage.webp';


import { Prisma } from "@prisma/client";

interface ProjectCardProps {
    project: Prisma.ProjectGetPayload<{}>;
    onClick: () => void;
    isCurrentUser: boolean;
}

const ProjectCard = ({ project, onClick, isCurrentUser }: ProjectCardProps) => {

    const dispatch = useDispatch()

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(openModal('projectEditModal'));
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(openModal('projectDeleteModal'))
    };

    return (
        <div onClick={onClick} className='border rounded-[20px] p-3 space-y-5 max-h-max hover:bg-neutral-50 cursor-pointer trans bg-white text-start'>

            <div className='w-full h-[150px] overflow-hidden relative rounded-[10px]'>
                <Image src={project.proImage || noImage.src} alt={project.proName} fill className="w-full h-full absolute top-0 left-0 bg-neutral-200 object-cover" />
            </div>
            <div className="space-y-2">
                <h4 className="text-start font-bold capitalize">{project.proName}</h4>
                <h6 className="text-start text-[var(--lighttext)] line-clamp-1">{project.proLink}</h6>
                <h5 className='text-start line-clamp-4'>{project.proDesc}</h5>
                {isCurrentUser &&
                    <div className="flex items-center justify-between flex-row">
                        <Model
                            bodyContent={<UserProjectForm isEdit project={project} />}
                            title='Edit Project'
                            desc='edit your project Details'
                            className='min-w-[300px] md:w-[800px]'
                            modalId='projectEditModal'
                        >
                            <Icon icon={<Pencil size={20} />} isHover title='Edit Project' onClick={handleEditClick} />
                        </Model>
                        <Model
                            bodyContent={<DeleteProjectForm project={project} />}
                            title='Delete Project'
                            desc='Delete your project'
                            className='w-full md:w-[400px]'
                            modalId='projectDeleteModal'
                        >
                            <Icon icon={<Trash2 size={20} />} isHover title='Delete Project' onClick={handleDeleteClick} />
                        </Model>
                    </div>
                }
            </div>
        </div>
    )
}

export default ProjectCard