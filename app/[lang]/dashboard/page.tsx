"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, MessageSquareMore, UsersRound, Bot } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/**
 * Localized Analytics Dashboard
 * - Shadcn/ui + Recharts
 * - Fully i18n-ready via useLanguage() -> t()
 * - RTL/LTR aware using dir from language
 */

// Mock data (replace with API later)
const donutContacts = [
  { name: "active", value: 4 },
  { name: "new", value: 2 },
];

const campaigns = [
  { name: "Jan", delivered: 20, read: 60, sent: 10, failed: 0 },
  { name: "Feb", delivered: 18, read: 45, sent: 8, failed: 0 },
  { name: "Mar", delivered: 2, read: 10, sent: 1, failed: 0 },
  { name: "Apr", delivered: 55, read: 80, sent: 10, failed: 0 },
  { name: "May", delivered: 22, read: 28, sent: 9, failed: 0 },
  { name: "Jun", delivered: 18, read: 26, sent: 9, failed: 0 },
];

const donutMessages = [
  { name: "sent", value: 2 },
  { name: "received", value: 3 },
  { name: "read", value: 30 },
  { name: "failed", value: 0 },
];

const conversationsByAgents = [
  { agent: "Cranes", open: 6, pending: 12, close: 15, rating: 35 },
  { agent: "Concrete Mixers", open: 3, pending: 18, close: 8, rating: 25 },
  { agent: "Bulldozers", open: 8, pending: 14, close: 22, rating: 45 },
  { agent: "Dump Trucks", open: 15, pending: 25, close: 6, rating: 17 },
];

// Palette (Tailwind-neutral defaults)
const palette = ["#16a34a", "#22c55e", "#0ea5e9", "#f97316", "#a3a3a3"]; // green, light green, sky, orange, gray

function StatCard({
  icon: Icon,
  title,
  value,
  delta,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  delta?: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {delta && (
          <p className="text-xs text-muted-foreground mt-1">{delta}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function LocalizedAnalyticsDashboard() {
  const { language, t } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  // helper for t with fallbacks
  const tr = (k: string, fallback: string) => t(k) ?? fallback;

  return (
    <div dir={dir} className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {language === "ar"
              ? `${tr("goodEvening", "مساء الخير")}, ${tr("userName", "Anas")}`
              : `${tr("goodEvening", "Good evening")}, ${tr("userName", "Anas")}`}
          </h1>
          <p className="text-sm text-muted-foreground">
            {tr(
              "dashboardSubtitle2",
              "Here is the overview about how business gaining lead."
            )}
          </p>
        </div>

        <div className={cn("flex items-center gap-2")}>          
          <Select defaultValue="6m">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={tr("lastSixMonths", "Last 6 months")} />
            </SelectTrigger>
            <SelectContent align={dir === "rtl" ? "start" : "end"}>
              <SelectItem value="1m">{tr("lastMonth", "Last month")}</SelectItem>
              <SelectItem value="3m">{tr("last3Months", "Last 3 months")}</SelectItem>
              <SelectItem value="6m">{tr("lastSixMonths", "Last 6 months")}</SelectItem>
              <SelectItem value="12m">{tr("lastYear", "Last 12 months")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={MessageSquareMore}
          title={tr("openConversation", "Open Conversation")}
          value="00"
          delta={"+12% " + tr("fromLastMonth", "from last month")}
        />
        <StatCard
          icon={TrendingUp}
          title={tr("totalConversation", "Total Conversation")}
          value="02"
          delta={"+12% " + tr("fromLastMonth", "from last month")}
        />
        <StatCard
          icon={UsersRound}
          title={tr("contacts", "Contacts")}
          value="3.5k"
          delta={"+12% " + tr("fromLastMonth", "from last month")}
        />
        <StatCard
          icon={Bot}
          title={tr("chatbotSessions", "Chatbot Sessions")}
          value="00"
          delta={"+12% " + tr("fromLastMonth", "from last month")}
        />
      </div>

      {/* Middle Row: Contacts Donut + Campaigns Bar */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">{tr("contacts", "Contacts")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 items-center gap-4">
            <div className="col-span-1 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ReTooltip formatter={(v: any, n: any) => [v, tr(n as string, String(n))]} />
                  <Pie data={donutContacts} dataKey="value" nameKey="name" innerRadius={50} outerRadius={70} paddingAngle={3}>
                    {donutContacts.map((_, i) => (
                      <Cell key={i} fill={palette[i % palette.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="col-span-1 space-y-2">
              <div className="text-3xl font-semibold">455022</div>
              <div className="text-sm text-muted-foreground">{tr("total", "Total")}</div>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: palette[0] }} />
                {tr("currentlyActive", "Currently active")}: 4
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: palette[1] }} />
                {tr("newAdded", "New added")}: 2
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">{tr("campaigns", "Campaigns")}</CardTitle>
            <Select defaultValue="6m">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={tr("lastSixMonths", "Last 6 months")} />
              </SelectTrigger>
              <SelectContent align={dir === "rtl" ? "start" : "end"}>
                <SelectItem value="1m">{tr("lastMonth", "Last month")}</SelectItem>
                <SelectItem value="3m">{tr("last3Months", "Last 3 months")}</SelectItem>
                <SelectItem value="6m">{tr("lastSixMonths", "Last 6 months")}</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaigns} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ReTooltip />
                <Bar dataKey="delivered" name={tr("delivered", "Delivered")} fill={palette[0]} radius={[6, 6, 0, 0]} />
                <Bar dataKey="failed" name={tr("failed", "Failed")} fill={palette[4]} radius={[6, 6, 0, 0]} />
                <Bar dataKey="read" name={tr("read", "Read")} fill={palette[2]} radius={[6, 6, 0, 0]} />
                <Bar dataKey="sent" name={tr("sent", "Sent")} fill={palette[3]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversations + Messages */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">{tr("conversations", "Conversations")}</CardTitle>
            <Tabs defaultValue="monthly" className="w-auto">
              <TabsList>
                <TabsTrigger value="weekly">{tr("weekly", "Weekly")}</TabsTrigger>
                <TabsTrigger value="monthly">{tr("monthly", "Monthly")}</TabsTrigger>
              </TabsList>
              <TabsContent value="weekly" className="sr-only" />
              <TabsContent value="monthly" className="sr-only" />
            </Tabs>
          </CardHeader>
          <CardContent>
            {/* Simple stacked bar indicator */}
            <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/3 bg-blue-500" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" />{tr("open", "Open")}</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" />{tr("unassigned", "Unassigned")}</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-rose-500" />{tr("closed", "Close")}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">{tr("messages", "Messages")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 items-center gap-4">
            <div className="col-span-1 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutMessages} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                    {donutMessages.map((_, i) => (
                      <Cell key={i} fill={palette[i % palette.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="col-span-1 space-y-2">
              <div className="text-3xl font-semibold">455022</div>
              <div className="text-sm text-muted-foreground">{tr("total", "Total")}</div>
              <Separator />
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: palette[3] }} />{tr("sent", "Sent")}: 2</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: palette[0] }} />{tr("received", "Received")}: 3</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: palette[2] }} />{tr("read", "Read")}: 30</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-gray-400" />{tr("failed", "Failed")}: 0</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom: Table */}
      <Card className="shadow-sm">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{tr("conversationByAgents", "Conversation by Agents")}</CardTitle>
          <Tabs defaultValue="monthly" className="w-auto">
            <TabsList>
              <TabsTrigger value="weekly">{tr("weekly", "Weekly")}</TabsTrigger>
              <TabsTrigger value="monthly">{tr("monthly", "Monthly")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="py-2 text-left font-medium">{tr("agents", "Agents")}</th>
                <th className="py-2 text-left font-medium">{tr("open", "Open")}</th>
                <th className="py-2 text-left font-medium">{tr("pending", "Pending")}</th>
                <th className="py-2 text-left font-medium">{tr("close", "Close")}</th>
                <th className="py-2 text-left font-medium">{tr("rating", "Rating")}</th>
              </tr>
            </thead>
            <tbody>
              {conversationsByAgents.map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2">{row.agent}</td>
                  <td className="py-2">{row.open}</td>
                  <td className="py-2">{row.pending}</td>
                  <td className="py-2">{row.close}</td>
                  <td className="py-2">{row.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 🔤 Translation keys to add (en/ar)
 * goodEvening, userName, dashboardSubtitle2, lastMonth, last3Months, lastSixMonths, lastYear,
 * openConversation, totalConversation, contacts, chatbotSessions, fromLastMonth,
 * total, currentlyActive, newAdded, campaigns, conversations, weekly, monthly,
 * open, unassigned, closed, messages, sent, received, read, failed,
 * conversationByAgents, agents, pending, close, rating
 */
