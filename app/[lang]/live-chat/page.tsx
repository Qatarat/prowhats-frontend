"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Paperclip,
  Mic,
  Image as ImageIcon,
  Smile,
  SendHorizontal,
  Filter,
  MoreVertical,
  Pin,
  ChevronDown,
  Bot,
  Search,
  Kanban,
  SquareUserRound,
} from "lucide-react";
import { CreateAgentDialog } from "./components/CreateAgentDialog";
import { Textarea } from "@/components/ui/textarea";

/**
 * Localized Chat UI — Fixed Scroll
 */

const chats = [
  {
    id: 1,
    name: "Sofia Lee",
    lastMessage: "Exploring new design trends is crucial",
    time: "3:15 AM",
    unread: 2,
    chip: { label: "Vector", tone: "sky" as const },
  },
  {
    id: 2,
    name: "Jordan Smith",
    lastMessage: "Collaboration tools can enable",
    time: "4:01 AM",
    unread: 1,
    chip: { label: "Constructions", tone: "blue" as const },
  },
  {
    id: 3,
    name: "Amir Khan",
    lastMessage: "This is a dummy message",
    time: "2:32 AM",
  },
  {
    id: 4,
    name: "Emma Liu",
    lastMessage: "Feedback is crucial for iterative...",
    time: "2:12 AM",
  },
];

const messages = [
  {
    id: 1,
    sender: "Amir Khan",
    text: "Hi",
    time: "Aug 2, 12:30 PM",
    incoming: true,
  },
  {
    id: 2,
    sender: "Amir Khan",
    text: "How is going the Prowhats design?",
    time: "Aug 2, 12:30 PM",
    incoming: true,
  },
  {
    id: 3,
    sender: "Me",
    text: "Component edit undo share polygon polygon team select...",
    time: "Aug 2, 12:30 PM",
    incoming: false,
  },
  {
    id: 4,
    sender: "Me",
    text: "Selection connection layout link ellipse background plugin start...",
    time: "Aug 2, 12:30 PM",
    incoming: false,
  },
  {
    id: 5,
    sender: "Me",
    text: "Frame export arrow select layer...",
    time: "Aug 2, 12:30 PM",
    incoming: false,
  },
];

function CountPill({ count, active }: { count: number; active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2 text-[11px] font-semibold",
        active
          ? "bg-emerald-100 text-emerald-700"
          : "bg-muted text-muted-foreground"
      )}
    >
      {count}
    </span>
  );
}

function Tag({
  label,
  tone,
}: {
  label: string;
  tone?: "sky" | "blue" | "slate";
}) {
  const toneMap: Record<string, string> = {
    sky: "bg-sky-100 text-sky-700",
    blue: "bg-blue-100 text-blue-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 text-[11px] font-medium",
        toneMap[tone ?? "slate"]
      )}
    >
      {label}
    </span>
  );
}

export default function LocalizedChatUI() {
  const { language, t } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const tr = (k: string, fallback: string) => t(k) ?? fallback;

  const [open, setOpen] = React.useState(false);

  return (
    <div dir={dir}>
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-wrap items-center gap-2 p-3">
          <Button variant="secondary" size="sm" className="gap-2">
            {tr("allMessages", "All messages")} <CountPill count={21} active />
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            {tr("unattended", "Unattended")} <CountPill count={21} />
          </Button>
        </div>
        <div>
          <Button onClick={() => setOpen(true)}>+ {t("createNewAgent")}</Button>
        </div>
      </div>
      <div className="grid grid-cols-12 h-[88vh] min-h-0 p-0 m-0">
        {/* LEFT: Inbox */}
        <div className="col-span-4 border bg-background flex flex-col min-h-0  border-b-0  border-r-0 border-l-0  p-3">
          {/* Tabs */}

          {/* Search + Actions */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className={cn(
                  "pl-9", // padding so text doesn't overlap the icon
                  dir === "rtl" && "pl-3 pr-9" // swap padding if RTL
                )}
                placeholder={tr(
                  "searchByNameOrPhone",
                  "Search with name or phone"
                )}
              />
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Kanban className="h-4 w-4"/> {tr("manage", "Manage")}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2 my-3">
              <Button variant="secondary" size="sm" className="gap-2">
                {tr("all", "All")} <CountPill count={21} active />
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                {tr("mine", "Mine")} <CountPill count={21} />
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                {tr("unassigned", "Unassigned")} <CountPill count={21} />
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              {tr("filter", "Filter")}
            </Button>
          </div>

          {/* Threads */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center justify-between gap-3 px-3 py-2 my-4 hover:bg-muted/40 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/avatar-shadcn.jpg" />
                      <AvatarFallback>{chat.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate max-w-[140px]">
                          {chat.name}
                        </span>
                        {chat.chip && (
                          <Tag label={chat.chip.label} tone={chat.chip.tone} />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {chat.lastMessage}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-muted-foreground">
                      {chat.time}
                    </span>
                    {chat.unread ? (
                      <span className="mt-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-semibold text-white px-1">
                        {chat.unread}
                      </span>
                    ) : (
                      <span className="h-5" />
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>



        {/* RIGHT: Conversation */}
        <div className="col-span-8 border bg-background flex flex-col min-h-0 border-b-0">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatar-shadcn.jpg" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">Amir Khan</div>
                <div className="text-xs text-muted-foreground">
                  {tr("replyTimer", "15h left for reply")}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm">
                <SquareUserRound className="h-4 w-4" />{" "}
                {tr("seeContact", "See contact")}
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.incoming ? "justify-start" : "justify-end"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-3 py-2 text-sm my-1",
                        msg.incoming ? "bg-muted" : "bg-white border"
                      )}
                    >
                      {msg.text}
                      <div className="mt-1 text-[10px] opacity-70">
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Composer */}
          {/* Composer */}
          <div className="p-3 border-t">
            <div
              className={cn(
                "gap-2 rounded-2xl border bg-white px-3 py-2",
                "shadow-sm"
              )}
              dir={dir}
            >
              <Textarea
                className={cn(
                  "ms-1 flex-1 resize-none border-0 bg-transparent px-0 py-2 shadow-none",
                  "focus-visible:ring-0 focus-visible:ring-offset-0"
                )}
                rows={1}
                placeholder={tr("typeMessage", "Type your message here...")}
              />
              <div className="flex items-center justify-between">
                {/* LEFT: tools + textarea */}
                <div className="flex">
                  <button className="h-7 w-7 inline-flex items-center justify-center rounded-full hover:bg-muted">
                    /
                  </button>
                  <button
                    type="button"
                    className="h-7 w-7 inline-flex items-center justify-center rounded-full hover:bg-muted"
                    aria-label="Attach file"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="h-7 w-7 inline-flex items-center justify-center rounded-full hover:bg-muted"
                    aria-label="Bot"
                  >
                    <Bot className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="h-7 w-7 inline-flex items-center justify-center rounded-full hover:bg-muted"
                    aria-label="Emoji"
                  >
                    <Smile className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="h-7 w-7 inline-flex items-center justify-center rounded-full hover:bg-muted"
                    aria-label="Voice message"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
                {/* message textarea */}
                {/* RIGHT: send */}
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-primary text-white h-9 rounded-xl px-4"
                    size="sm"
                  >
                    {tr("send", "Send")}
                    <span className="ms-2 inline-flex items-center gap-1 rounded-md px-2 py-[2px] text-[11px]">
                      <span className="font-mono">⌘</span>
                      <span className="font-mono">↩︎</span>
                    </span>
                  </Button>
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateAgentDialog open={open} setOpen={setOpen} />
    </div>
  );
}
