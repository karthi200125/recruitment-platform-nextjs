import { Prisma } from "@prisma/client";
import Image from "next/image";

import noImage from "../../../public/noImage.webp";

interface ShowProjectProps {
    project: Prisma.ProjectGetPayload<{}>;
}

const ShowProject = ({ project }: ShowProjectProps) => {
    return (
        <div className="flex max-h-max w-full flex-col items-start gap-5 md:flex-row md:p-5">
            <div className="relative h-[200px] w-full overflow-hidden rounded-md border md:h-[400px] md:w-[70%] md:rounded-[20px]">
                <Image
                    src={project.proImage || noImage.src}
                    alt={project.proName}
                    fill
                    className="absolute left-0 top-0 h-full w-full bg-neutral-200 object-cover"
                />
            </div>

            <div className="w-full space-y-5 md:w-[30%]">
                <h2 className="font-bold capitalize">
                    {project.proName}
                </h2>

                <a
                    href={project.proLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="line-clamp-1 text-sm text-blue-400"
                >
                    {project.proLink}
                </a>

                <h4>{project.proDesc}</h4>
            </div>
        </div>
    );
};

export default ShowProject;