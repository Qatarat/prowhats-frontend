"use client";

import * as React from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type UploadDropzoneProps = {
  onFiles?: (files: File[]) => void;
  accept?: string[];
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
};

export function UploadDropzone({
  onFiles,
  accept = [".pdf", ".doc", ".docx", ".txt"],
  multiple = true,
  maxFiles = 10,
  maxSizeMB = 20,
  disabled,
  className = "",
}: UploadDropzoneProps) {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const [isDragging, setIsDragging] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const dragCounter = React.useRef(0);

  const acceptAttr = React.useMemo(() => accept.join(","), [accept]);
  const acceptHuman = React.useMemo(
    () => accept.map((a) => a.replace(".", "")).join(", "),
    [accept]
  );

  const resetErrorsSoon = () => {
    setTimeout(() => setErrors([]), 3500);
  };

  const validateAndSet = React.useCallback(
    (picked: File[]) => {
      const newErrors: string[] = [];

      // limit count
      let arr = picked;
      if (picked.length > maxFiles) {
        newErrors.push(t(`maxFiles_${maxFiles}`));
        arr = picked.slice(0, maxFiles);
      }

      // extension + size checks
      const okExt = (f: File) =>
        accept.length === 0 ||
        accept.some((ext) => f.name.toLowerCase().endsWith(ext.toLowerCase()));

      const okSize = (f: File) => f.size <= maxSizeMB * 1024 * 1024;

      const valid = arr.filter((f) => {
        const keep = okExt(f) && okSize(f);
        if (!okExt(f)) newErrors.push(t(`unsupportedType_${f.name}`));
        if (!okSize(f)) newErrors.push(t(`tooLarge_${f.name}_${maxSizeMB}`));
        return keep;
      });

      setFiles(valid);
      if (newErrors.length) {
        setErrors(newErrors);
        resetErrorsSoon();
      }
      onFiles?.(valid);
    },
    [accept, maxFiles, maxSizeMB, onFiles, t]
  );

  const handleBrowse = () => inputRef.current?.click();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    validateAndSet(Array.from(list));
    e.target.value = "";
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    const list = e.dataTransfer.files;
    if (!list?.length) return;
    validateAndSet(Array.from(list));
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
        onClick={!disabled ? handleBrowse : undefined}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") handleBrowse();
        }}
        onDragEnter={!disabled ? onDragEnter : undefined}
        onDragLeave={!disabled ? onDragLeave : undefined}
        onDragOver={!disabled ? onDragOver : undefined}
        onDrop={!disabled ? onDrop : undefined}
        className={[
          "group relative mx-auto grid place-items-center rounded-2xl border border-dashed",
          "bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm",
          "p-8 sm:p-10 text-center shadow-sm transition",
          "hover:shadow-md",
          "border-neutral-300 dark:border-neutral-800",
          isDragging
            ? "ring-2 ring-offset-2 ring-primary/50 border-primary/60"
            : "",
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
        style={{ minHeight: 180 }}
      >
        <div
          className={[
            "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full",
            "border bg-white dark:bg-neutral-900",
            isDragging
              ? "border-primary/40"
              : "border-neutral-200 dark:border-neutral-800",
          ].join(" ")}
        >
          <Upload className="h-5 w-5" />
        </div>

        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          {t("clickUploadOrDrag")}
        </h3>

        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {t("supportedFileTypes")}: {acceptHuman}
        </p>

        <div className="mt-5">
          <Button
            type="button"
            className="w-full"
            size="sm"
            disabled={disabled}
          >
            {t("browseFiles")}
          </Button>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={acceptAttr}
          className="sr-only"
          onChange={handleInputChange}
          tabIndex={-1}
          aria-hidden="true"
          disabled={disabled}
        />
      </div>

      {!!files.length && (
        <ul className="mt-4 space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between rounded-xl border bg-white/70 dark:bg-neutral-900/50 px-3 py-2 text-sm"
            >
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0" />
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="block max-w-[220px] truncate"
                        aria-label={f.name}
                      >
                        {f.name}
                      </span>
                    </TooltipTrigger>

                    <TooltipContent
                      side={isRTL ? "left" : "right"}
                      align="start"
                      dir={isRTL ? "rtl" : "ltr"}
                      className="max-w-[420px] break-words"
                    >
                      {f.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="shrink-0 text-neutral-500 dark:text-neutral-400">
                  · {(f.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
                <button
                  type="button"
                  onClick={() =>
                    setFiles((prev) => {
                      const updated = prev.filter((_, idx) => idx !== i);
                      onFiles?.(updated); // <-- update parent
                      return updated;
                    })
                  }
                  className="rounded-md p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  aria-label={`${t("removeFile")} ${f.name}`}
                >
                  <X className="h-4 w-4" />
                </button>

            </li>
          ))}
        </ul>
      )}

      {!!errors.length && (
        <div className="mt-3 space-y-1">
          {errors.map((e, i) => (
            <p
              key={`err-${i}`}
              className="text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {e}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
