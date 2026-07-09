import { cn } from "@/lib/utils";

/** Centered mobile-first column with safe-area aware padding for the bottom nav. */
export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-md px-5 pb-safe-nav pt-[max(env(safe-area-inset-top),1.25rem)]">
      <div className={cn("flex flex-col gap-5", className)}>{children}</div>
    </div>
  );
}
