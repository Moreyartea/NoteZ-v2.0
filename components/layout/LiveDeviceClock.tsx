'use client';

import React, { useState, useEffect } from 'react';

/**
 * LiveDeviceClock - Anti-Lag Isolated Digital Clock (Streamlined)
 * Keeps time state strictly isolated inside this component to avoid re-rendering
 * parent shells or page components every second.
 */
export const LiveDeviceClock: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('--:--:--');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border-2 border-[#0A0A0A] rounded-lg shadow-[2px_2px_0px_#0A0A0A]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse flex-shrink-0" />
      <span className="font-mono text-xs font-black tracking-wider text-[#0A0A0A]">
        {timeStr}
      </span>
    </div>
  );
};
