"use client"
import { useLanguage } from "@/contexts/LanguageContext";

// app/page.tsx
export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">{t("dashboard")}</h1>
      <p>{t("dashboardSubtitle")}</p>
    </div>
  );
}
