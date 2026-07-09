import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex items-end justify-between gap-4 pt-1", className)}>
      <div className="min-w-0">
        {subtitle && (
          <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
        )}
        <h1 className="truncate text-[28px] font-bold leading-tight tracking-tight">{title}</h1>
      </div>
      {action}
    </header>
  );
}
