"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DirectionProvider } from "@radix-ui/react-direction";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppSelector } from "@/lib/store/store";
import { getPermissions } from "@/utils/permissions";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Home,
  MessageSquareText,
  Radio,
  Users2,
  Folder,
  Bell,
  Globe,
  Settings as SettingsIcon,
  MoreVertical,
  User as UserIcon,
  NotebookPen,
  MessageCircleMore,
  User, // fallback for contacts
} from "lucide-react";

/* ---------------- helpers ---------------- */
const truncate = (s?: string, n = 40) =>
  s ? (s.length > n ? s.slice(0, n).trimEnd() + "…" : s) : "";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const { user, userLoading } = useAppSelector((s) => s.auth);
  const perms = getPermissions(user?.role);

  const [isAdmin, setIsAdmin] = React.useState<boolean>(() => {
    try {
      return (
        typeof window !== "undefined" &&
        localStorage.getItem("admin") === "true"
      );
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        setIsAdmin(localStorage.getItem("admin") === "true");
      }
    } catch {}
  }, []);

  const hasPerm = React.useCallback(
    (key: string) => Boolean(perms?.[key]),
    [perms]
  );

  const handleSignOut = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.href = `/${language}/login`;
  };

  /* ---------------- menu model (like screenshot) ---------------- */

  const generalNav = React.useMemo(
    () => [
      { title: t("dashboard") ?? "Dashboard", href: "/dashboard", icon: Home },
      {
        title: t("whatsAppChat") ?? "WhatsApp Chat",
        href: "/whatsapp-chat",
        icon: MessageSquareText,
      },
      {
        title: t("liveChat") ?? "Live Chat",
        href: "/live-chat",
        icon: MessageCircleMore,
      },
      {
        title: t("broadcast") ?? "Broadcast",
        href: "/broadcast",
        icon: Radio,
      },
      {
        title: t("contacts") ?? "Contacts",
        href: "/contacts",
        icon: NotebookPen,
      },
      {
        title: t("fileManager") ?? "File Manager",
        href: "/files",
        icon: Folder,
      },
    ],
    [t]
  );

  const workspaceNav = React.useMemo(
    () => [
      {
        title: t("users") ?? "Users",
        href: "/users",
        icon: User,
        adminOnly: true,
      },
      {
        title: t("teams") ?? "Teams",
        href: "/teams",
        icon: Users2,
        adminOnly: true,
      },
    ],
    [t]
  );

  // Optional: enforce admin-only routes like your original code
  const adminOnlyPaths = [
    "/roles",
    "/users",
    "/review-management",
    "/user-questions",
    "/dashboard",
  ];
  const permGuardedPaths: Record<string, string[]> = {
    "view-admin": ["/admin"],
  };

  React.useEffect(() => {
    if (!pathname || userLoading) return;

    for (const [permKey, paths] of Object.entries(permGuardedPaths)) {
      if (paths.some((p) => pathname.startsWith(`/${language}${p}`))) {
        const allowed = hasPerm(permKey) || isAdmin;
        if (!allowed) {
          router.replace(`/${language}/dashboard`);
          return;
        }
      }
    }

    if (!isAdmin) {
      const shouldBlock = adminOnlyPaths.some((p) =>
        pathname.startsWith(`/${language}${p}`)
      );
      if (shouldBlock) {
        router.replace(`/${language}/dashboard`);
      }
    }
  }, [pathname, language, isAdmin, hasPerm, userLoading, router]);

  const dir = language === "ar" ? "rtl" : "ltr";
  return (
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <DirectionProvider dir={language === "ar" ? "rtl" : "ltr"}>
        <Sidebar
          {...props}
          className={language === "ar" ? "left-auto border-l-1" : ""}
        >
          {/* Header */}
          <SidebarHeader>
            <SidebarMenu className="p-[14px]">
              <SidebarMenuItem className="flex items-center">
                <SidebarMenuButton size="lg" asChild>
                  {language == "ar" ? (
                    <Link href={`/${language}/dashboard`}>
                      <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-bold text-xl text-[#334155]">
                          ProWhats
                        </span>
                        <span className="text-[#334155]">Business admin</span>
                      </div>
                      <div className="flex  items-center justify-center rounded-lg">
                        <img src="/logo.svg" className="w-12" />
                      </div>
                    </Link>
                  ) : (
                    <Link href={`/${language}/dashboard`}>
                      <div className="flex items-center justify-center rounded-lg">
                        <img src="/logo.svg" className="w-12" />
                      </div>
                      <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-bold text-xl text-[#334155]">
                          ProWhats
                        </span>
                        <span className="text-[#334155]">Business admin</span>
                      </div>
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          {/* Content */}
          <SidebarContent className="px-2">
            {/* General */}
            <SidebarGroup className="mt-1">
              <SidebarGroupLabel className="px-3 py-2 text-[12px] font-medium text-muted-foreground">
                {t("general") ?? "General"}
              </SidebarGroupLabel>

              <SidebarMenu className="space-y-1">
                {generalNav.map((item) => {
                  const Icon = item.icon;
                  const href = `/${language}${item.href}`;
                  const active = isActive(href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center rounded-xl px-[10px] py-[8px] text-[14px]",
                          "transition-colors",
                          active
                            ? "bg-muted font-semibold"
                            : "hover:bg-muted/70"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-[#334155]" />
                        <span className="ms-3 truncate text-[#334155]">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>

            {/* Workspace Management */}
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 py-2 text-[12px] font-medium text-muted-foreground">
                {t("workspaceManagement") ?? "Workspace Management"}
              </SidebarGroupLabel>

              <SidebarMenu className="space-y-1">
                {workspaceNav.map((item) => {
                  const Icon = item.icon;
                  const href = `/${language}${item.href}`;
                  const active = isActive(href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center rounded-xl text-[14px] px-[10px] py-[8px]",
                          active
                            ? "bg-muted font-semibold"
                            : "hover:bg-muted/70"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-[#334155]" />
                        <span className="ms-3 truncate text-[#334155]">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          {/* Footer with user card (pinned) */}
          <SidebarFooter className="mt-auto px-2 pb-3">
            <div className="my-3 h-px bg-sidebar-border/70" />
            <div className="space-y-1 px-1">
              {[
                {
                  title: t("notifications") ?? "Notifications",
                  icon: Bell,
                  href: "/notifications",
                },
                {
                  title: t("language") ?? "Language",
                  icon: Globe,
                  href: "/language",
                },
                {
                  title: t("settings") ?? "Settings",
                  icon: SettingsIcon,
                  href: "/settings",
                },
              ].map(({ title, icon: Icon, href }) => {
                const fullHref = `/${language}${href}`;
                const active = isActive(fullHref);
                return (
                  <Link
                    key={href}
                    href={fullHref}
                    className={cn(
                      "flex items-center rounded-xl px-[10px] py-[8px] text-[14px]",
                      active ? "bg-muted font-semibold" : "hover:bg-muted/70"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[#334155]" />
                    <span className="ms-3 truncate text-[#334155]">
                      {title}
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="my-3 h-px bg-sidebar-border/70" />
            <div className="rounded-2xl  border-sidebar-border p-2">
              <div
                className={cn(
                  "flex items-center justify-between gap-2",
                  dir === "rtl" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-3",
                    dir === "rtl" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatar-shadcn.jpg" alt="Avatar" />
                    <AvatarFallback>
                      {(user?.name?.[0]?.toUpperCase() ?? "U") as string}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "leading-tight",
                      dir === "rtl" ? "text-right" : "text-left"
                    )}
                  >
                    <div className="font-semibold text-[14px]">
                      {user?.name?.split(" ")?.[0] ?? "User"}
                    </div>
                    <div className="text-[12px] text-muted-foreground">
                      {user?.email ? `${truncate(user.email, 22)}` : ""}
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    {/* <DropdownMenuItem>View profile</DropdownMenuItem> */}
                    <DropdownMenuItem
                      className="text-rose-600 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      {t("signOut") ?? "Sign out"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>{" "}
      </DirectionProvider>
    </div>
  );
}
