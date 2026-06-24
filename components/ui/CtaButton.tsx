import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CtaButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "default" | "lg";
  className?: string;
  showArrow?: boolean;
  target?: "_self" | "_blank";
  prefetch?: boolean;
  ariaLabel?: string;
}

const CtaButton = ({
  href,
  children,
  variant = "primary",
  size = "default",
  className,
  showArrow = false,
  target = "_self",
  prefetch = true,
  ariaLabel,
}: CtaButtonProps) => {
  return (
    <Link
      href={href}
      target={target}
      prefetch={prefetch}
      aria-label={ariaLabel}
      className={cn(
        "group inline-flex items-center justify-center rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:scale-[0.98]",

        size === "default" && "h-14 px-8 text-sm",
        size === "lg" && "h-16 px-10 text-base",

        variant === "primary" &&
        "bg-white font-semibold text-black hover:scale-[1.02] hover:bg-white/90",

        variant === "secondary" &&
        "border border-white/10 bg-white/[0.03] font-medium text-white/80 backdrop-blur-xl hover:border-white/20 hover:bg-white/[0.06] hover:text-white",

        className
      )}
    >
      <span>{children}</span>

      {showArrow && (
        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </Link>
  );
};

export default CtaButton;