import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  isText?: boolean;
}

const Logo = ({ isText = true }: LogoProps) => {
  return (
    <Link href={'/'} className="h-[55px] flex items-center gap-2.5">

      <Image
        src="/logo.png"
        alt="Profile Light Logo"
        width={212}
        height={212}
        priority
        sizes="(max-width: 640px) 120px, (max-width: 1024px) 160px, 200px"
        className="h-auto w-[50px] object-contain select-none drop-shadow-[0_20px_40px_rgba(99,102,241,0.25)]"
      />
      {isText &&
        <span className="text-base font-bold text-white tracking-tight uppercase">Jobify</span>
      }
    </Link>
  )
}

export default Logo
