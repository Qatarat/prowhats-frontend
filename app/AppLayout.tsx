"use client";

import { AppSidebar } from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useLanguage } from "@/contexts/LanguageContext";
import authQuery from "@/features/auth/authQuery";
import { authAction } from "@/features/auth/authSlice";
import { useAppSelector } from "@/lib/store/store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { DirectionProvider } from "@radix-ui/react-direction";
import { LangSwitch } from "@/components/LangSwitch";

const SUPPORTED_LANGS = ["en", "ar", "id"] as const;

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const dispatch = useDispatch();

  console.log("params", path?.split("/")?.[1]);

  const { userLoading, user } = useAppSelector((s) => s.auth);

  const [tokenChecked, setTokenChecked] = React.useState(false);

  useEffect(() => {
    if (!path) return;
    // get first non-empty segment
    const seg = path.split("/").filter(Boolean)[0] as
      | (typeof SUPPORTED_LANGS)[number]
      | undefined;

    if (seg && SUPPORTED_LANGS.includes(seg as any)) {
      // only update if it actually changed to avoid loops
      if (language !== seg) {
        toggleLanguage(seg as "en" | "ar"); // seg is "en" | "ar" | "id"
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem("country", seg);
      }
    } else {
      // if no valid lang in URL, prepend the current language
      const to = `/${language}${path.startsWith("/") ? "" : "/"}${path}`;
      if (path !== to) router.replace(to);
    }
  }, [path, language, router, toggleLanguage]);

  // --- 1) Read token safely (client only) and fetch profile
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("country", path?.split(" / ")?.[1]);

    const token = window.localStorage.getItem("access_token");
    const admin = window.localStorage.getItem("admin") == "true";
    if (!admin) {
      window.localStorage.setItem("admin", "false");
    }

    if (token) {
      setTokenChecked(true);
      if (admin) {
        dispatch(authQuery.endpoints.getAdminProfile.initiate("") as any);
      } else {
        dispatch(authQuery.endpoints.getProfile.initiate("") as any);
      }
    } else {
      dispatch(authAction.setUserLoading(false));
    }
  }, [dispatch, user]);

  // --- 2) Ensure language prefix is present
  useEffect(() => {
    if (!path) return;
    if (path === "/") {
      const to = `/${language}/dashboard`;
      if (path !== to) router.replace(to);
      return;
    }
    const seg = path.split("/").filter(Boolean)[0];
    if (!SUPPORTED_LANGS.includes(seg as any)) {
      const to = `/${language}${path}`;
      if (path !== to) router.replace(to);
    }
  }, [path, language, router]);

  // Helper: am I on an auth route?
  const isAuthRoute = useMemo(() => {
    if (!path) return false;
    return path.includes("/login") || path.includes("/verify-otp");
  }, [path]);

  // --- 3) Route after auth resolves (no loops)
  useEffect(() => {
    if (userLoading || !path) return;

    // not logged in -> only redirect if we're not already on an auth page
    if (!user?.id) {
      const to = `/${language}/login` || `/${language}/admin/login`;
      if (!isAuthRoute && path !== to) router.replace(to);
      return;
    }

    // logged in -> keep current page; if on auth page, move to dashboard
    if (isAuthRoute) {
      const to = `/${language}/dashboard`;
      if (path !== to) router.replace(to);
    }
  }, [userLoading, user?.id, isAuthRoute, language, path, router]);

  const dir = language === "ar" ? "rtl" : "ltr";

  // --- Loading gate
  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className={`font-${language}`} dir={dir}>
      {isAuthRoute ? (
        <DirectionProvider dir={dir}>
          {/* <div className="flex justify-end p-3  bg-gray-50">
            <LangSwitch />
          </div> */}
          {children}
        </DirectionProvider>
      ) : (
        tokenChecked && (
          <SidebarProvider defaultOpen={false} language={language}>
            <AppSidebar />

            <SidebarInset
              dir={dir}
              className="flex min-h-dvh flex-col w-[100%] lg:w-[80%] md:w-[70%]"
            >
              <header className="sticky top-0 z-40 border-b bg-background">
                <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-between px-4">
                  {/* Left side */}
                  <div className="flex min-w-0 items-center gap-2">
                    <SidebarTrigger className="shrink-0" />
                    <Separator
                      orientation="vertical"
                      className="mx-2 hidden h-4 sm:block"
                    />
                  </div>

                  {/* Right side */}
                  <LangSwitch />
                </div>
              </header>

              <main className="flex-1">
                <div className="mx-auto w-full max-w-screen-2xl overflow-auto">
                  {children}
                </div>
              </main>
            </SidebarInset>
          </SidebarProvider>
        )
      )}
    </div>
  );
}
