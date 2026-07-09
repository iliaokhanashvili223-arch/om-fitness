"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Dumbbell, LineChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Today", icon: Home },
  { href: "/workout", label: "Workouts", icon: Dumbbell },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center">
      <div className="pointer-events-auto mx-auto mb-[max(env(safe-area-inset-bottom),0.75rem)] w-[min(100%-1.5rem,27rem)] rounded-[2.125rem] border border-border bg-card/95 px-2.5 py-2.5 shadow-nav backdrop-blur-xl">
        <ul className="flex items-center justify-between">
          {TABS.map((tab) => {
            const active = isActive(pathname, tab.href);
            const Icon = tab.icon;
            return (
              <li key={tab.href} className="flex-1">
                <Link
                  href={tab.href}
                  className="relative flex flex-col items-center gap-1 rounded-2xl px-1 py-1.5"
                  aria-current={active ? "page" : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-2xl bg-primary-soft"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "relative z-10 h-[22px] w-[22px] transition-colors",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                    strokeWidth={active ? 2.4 : 1.9}
                  />
                  <span
                    className={cn(
                      "relative z-10 text-[10px] font-semibold transition-colors",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {tab.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
