import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ProfileProvider } from "@/components/profile-provider";
import { RestTimerProvider } from "@/components/rest-timer";
import { BottomNav } from "@/components/bottom-nav";
import { PwaRegister } from "@/components/pwa-register";
import { ResetScript } from "@/components/reset-script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "Fitness OS",
  title: {
    default: "Fitness OS",
    template: "%s · Fitness OS",
  },
  description: "Your personal calisthenics Fitness OS — train, eat, and track your cut.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Fitness OS",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0F" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-[100dvh] bg-background font-sans text-foreground antialiased">
        <ResetScript />
        {/* Soft blue-tinted backdrop for the premium fitness-OS feel. */}
        <div className="app-backdrop pointer-events-none fixed inset-0 -z-10" aria-hidden />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <ProfileProvider>
            <RestTimerProvider>
              <main>{children}</main>
              <BottomNav />
            </RestTimerProvider>
          </ProfileProvider>
        </ThemeProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
