'use client';

import React, { useState, useEffect } from 'react';

/**
 * LiveDeviceClock - Anti-Lag Isolated Digital Clock
 * Adheres to NFR-02 & PRD Section 4.1:
 * Keeps time state strictly isolated inside this component to avoid re-rendering
 * parent shells or page components every second.
 */
export const LiveDeviceClock: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('--:--:--');
  const [dateStr, setDateStr] = useState<string>('Memuat waktu...');
  const [timeZoneStr, setTimeZoneStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Format time HH:mm:ss
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}:${seconds}`);

      // Format full date in Indonesian (e.g. Jumat, 30 Oktober 2026)
      try {
        const dateFormatter = new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        setDateStr(dateFormatter.format(now));
      } catch {
        setDateStr(now.toLocaleDateString('id-ID'));
      }

      // Resolve time zone abbreviation (e.g. WIB / WITA / WIT / GMT+7)
      try {
        const timeZonePart = Intl.DateTimeFormat('id-ID', {
          timeZoneName: 'short',
        })
          .formatToParts(now)
          .find((part) => part.type === 'timeZoneName')?.value;

        if (timeZonePart) {
          setTimeZoneStr(timeZonePart);
        }
      } catch {
        setTimeZoneStr('');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white border-2 border-[#0A0A0A] rounded-xl shadow-[2px_2px_0px_#0A0A0A]">
      <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse flex-shrink-0" />
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-black tracking-wider text-[#0A0A0A]">
            {timeStr}
          </span>
          {timeZoneStr && (
            <span className="text-[9px] font-black uppercase text-[#0A0A0A] bg-[#FFE135] px-1 py-0.5 rounded border border-[#0A0A0A] leading-none">
              {timeZoneStr}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium text-gray-600 mt-0.5">
          {dateStr}
        </span>
      </div>
    </div>
  );
};
