import { cn } from "@/lib/cn";

export function LoopMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M10.5 16c0-3.04 2.46-5.5 5.5-5.5h3.2c2.43 0 4.4 1.97 4.4 4.4s-1.97 4.4-4.4 4.4H16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M21.5 16c0 3.04-2.46 5.5-5.5 5.5h-3.2c-2.43 0-4.4-1.97-4.4-4.4s1.97-4.4 4.4-4.4H16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
