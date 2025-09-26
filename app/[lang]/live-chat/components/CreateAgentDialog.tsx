"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UploadCloud } from "lucide-react";

type FormData = {
  name: string;
  phone: string;
  email?: string;
  role: string;
  active: boolean;
  avatar?: File | null;
};

export function CreateAgentDialog({
  onSubmit,
  open,
  setOpen,
}:any) {
  const { language, t } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      role: "agent",
      active: true,
      avatar: null,
    },
  });

  const avatarFile = watch("avatar");

  const tr = (k: string, fallback: string) => t(k) ?? fallback;

  const submit = (data: FormData) => {
    onSubmit?.(data);
    setOpen(false);
    reset();
  };

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValue("avatar", file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent dir={dir} className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {tr("createNewAgent", "Create New Agent")}
          </DialogTitle>
        </DialogHeader>

        <form className={cn("grid gap-4")} onSubmit={handleSubmit(submit)}>
          {/* Upload */}
          <div className="grid gap-2">
            <Label className="text-xs text-muted-foreground">
              {tr(
                "uploadProfilePhotoOptional",
                "Upload Profile Photo (optional)"
              )}
            </Label>
            <div className={cn("flex items-center gap-3")}>
              <input
                id="agent-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFilePick}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center"
                onClick={() => document.getElementById("agent-photo")?.click()}
              >
                <UploadCloud className="h-4 w-4 me-2" />
                {avatarFile ? avatarFile.name : tr("chooseFile", "Choose file")}
              </Button>
            </div>
          </div>

          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">
              {tr("name", "Name")} <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="name"
              placeholder={tr("namePlaceholderAgent", "Pedro Duarte")}
              {...register("name", { required: true })}
            />
          </div>

          {/* WhatsApp Number */}
          <div className="grid gap-2">
            <Label htmlFor="phone">
              {tr("whatsAppNumber", "WhatsApp Number")}{" "}
              <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="phone"
              inputMode="tel"
              placeholder="+1 234 567 890"
              {...register("phone", { required: true })}
            />
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">{tr("emailAddress", "Email Address")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={tr("enterAgentEmail", "Enter agent's work email")}
              {...register("email")}
            />
          </div>

          {/* Role */}
          <div className="grid gap-2">
            <Label htmlFor="role">
              {tr("role", "Role")} <span className="text-rose-600">*</span>
            </Label>
            <Select
              defaultValue="agent"
              onValueChange={(v) => setValue("role", v)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder={tr("selectRole", "Select role")} />
              </SelectTrigger>
              <SelectContent align={dir === "rtl" ? "start" : "end"}>
                <SelectItem value="agent">
                  {tr("roleAgent", "Agent")}
                </SelectItem>
                <SelectItem value="supervisor">
                  {tr("roleSupervisor", "Supervisor")}
                </SelectItem>
                <SelectItem value="admin">
                  {tr("roleAdmin", "Admin")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active status */}
          <div className="grid gap-2">
            <Label>{tr("activeStatus", "Active Status")}</Label>
            <div
              className={cn(
                "flex items-center justify-between rounded-md border p-3"
              )}
            >
              <div className="text-sm text-muted-foreground">
                {tr("activeStatusHint", "Agent can log in and receive chats")}
              </div>
              <Switch
                dir={"ltr"}
                checked={watch("active")}
                onCheckedChange={(v) => setValue("active", v)}
                aria-label={tr("activeStatus", "Active Status")}
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter
            className={cn(
              "flex items-center gap-2 sm:justify-between",
              dir === "rtl" ? "flex-row-reverse" : ""
            )}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {tr("cancel", "Cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {tr("createAgent", "Create Agent")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
