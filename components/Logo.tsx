import Image from "next/image"
import Link from "next/link"

const Logo = () => {
  return (
    <Link href={'/'} className="h-[55px] flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 15.96.5 13.46.5c-1.48 0-2.67.74-3.46 1.87C9.21 1.24 8.02.5 6.54.5 4.04.5 2 2.54 2 4.66c0 .46.11.9.18 1.34H0v14h24V6h-4zm-6.54-3.5c1.31 0 2.54 1.2 2.54 2.16 0 .46-.19.88-.48 1.34h-4.12c-.29-.46-.48-.88-.48-1.34 0-.96 1.23-2.16 2.54-2.16zM4 4.66C4 3.7 5.23 2.5 6.54 2.5S9.08 3.7 9.08 4.66c0 .46-.19.88-.48 1.34H4.48C4.19 5.54 4 5.12 4 4.66z" />
        </svg>
      </div>
      <span className="text-base font-bold text-white tracking-tight uppercase">Jobify</span>
    </Link>
  )
}

export default Logo

// <Link href={'/'} className="text-white font-bold flex flex-row items-center gap-3 trans cursor-pointer hover:opacity-50">
//   <Image src='/logo.webp' alt="" width={40} height={40} className="object-contain" />
//   <h3 className="hidden sm:block font-bold">JOBIFY</h3>
// </Link>