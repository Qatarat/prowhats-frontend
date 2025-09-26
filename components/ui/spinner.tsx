// components/ui/spinner.tsx
"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  size?: number;            // px
  className?: string;       // extra tailwind
  ariaLabel?: string;
};

export function Spinner({ size = 18, className, ariaLabel = "Loading" }: Props) {
  return (
    <Loader2
      aria-label={ariaLabel}
      className={cn("animate-spin text-muted-foreground", className)}
      style={{ width: size, height: size }}
    />
  );
}
