"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/layout/locale-provider";

export function CountdownTimer() {
  const { t } = useI18n();
  const [seconds, setSeconds] = useState(4 * 3600 + 32 * 60 + 18);

  useEffect(() => {
    const interval = window.setInterval(() => setSeconds((value) => value <= 0 ? 6 * 3600 : value - 1), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const parts = [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60];
  return (
    <div className="flex items-center gap-2" aria-label={t("home.countdownLabel", { hours: parts[0], minutes: parts[1], seconds: parts[2] })}>
      <span className="me-1 text-[10px] font-black uppercase tracking-[.15em] text-neutral-400">{t("home.endsIn")}</span>
      {parts.map((part, index) => (
        <span key={index} className="flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-md bg-white text-sm font-black text-[#0a0a0a]">{String(part).padStart(2, "0")}</span>
          {index < 2 ? <span className="font-black text-primary">:</span> : null}
        </span>
      ))}
    </div>
  );
}
