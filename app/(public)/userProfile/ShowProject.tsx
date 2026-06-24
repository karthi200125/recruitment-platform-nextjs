import Image from 'next/image'
import noImage from '../../../public/noImage.webp'

const ShowProject = ({ project }: any) => {
    return (
        <div className='w-full max-h-max md:p-5 flex flex-col md:flex-row items-start gap-5'>
            <div className='w-full md:w-[70%] h-[200px] md:h-[400px] overflow-hidden relative rounded-md md:rounded-[20px] border'>
                <Image src={project?.proImage || noImage.src} alt="" fill className="w-full h-full absolute top-0 left-0 bg-neutral-200 object-cover" />
            </div>
            <div className="space-y-5 w-full md:w-[30%]">
                <h2 className="font-bold capitalize">{project?.proName}</h2>
                <a href={project?.proLink} className="text-[var(--lighttext)] line-clamp-1 text-blue-400 text-sm">{project?.proLink}</a>
                <h4>{project?.proDesc}</h4>
            </div>
        </div>
    )
}

export default ShowProject