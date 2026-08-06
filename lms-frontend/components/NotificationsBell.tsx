"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  type Notification,
} from "@/lib/api/notifications";

export function NotificationsBell() {
  const { dict } = useLanguage();
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevUnread = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const primed = useRef(false);

  const playAlert = () => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(40);
      }
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = 880;
      g.gain.value = 0.04;
      o.start();
      o.stop(ctx.currentTime + 0.08);
    } catch {
      /* ignore */
    }
  };

  const load = () => {
    if (!token) return;
    getMyNotifications(token).then((res) => {
      setItems(res.data);
      setUnreadCount(res.unreadCount);
      if (primed.current && res.unreadCount > prevUnread.current) {
        playAlert();
      }
      primed.current = true;
      prevUnread.current = res.unreadCount;
    });
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = async (n: Notification) => {
    if (!n.isRead && token) {
      await markAsRead(n._id, token);
      load();
    }
  };

  const handleMarkAll = async () => {
    if (!token) return;
    await markAllAsRead(token);
    load();
  };

  if (!token) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={dict.notifications.title}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink/70 transition-colors hover:border-primary hover:text-primary"
      >
        🔔
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 font-mono text-[10px] font-semibold text-white"
            style={{ insetInlineEnd: "-4px" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-80 rounded-2xl border border-line bg-paper-raised shadow-lg shadow-ink/10"
          style={{ insetInlineEnd: 0 }}
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="text-sm font-semibold text-ink">
              {dict.notifications.title}
              {unreadCount > 0 && (
                <span className="ms-2 rounded-full bg-danger/15 px-2 py-0.5 font-mono text-xs text-danger">
                  {unreadCount}
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAll} className="text-xs text-primary hover:underline">
                {dict.notifications.markAllRead}
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink/50">{dict.notifications.empty}</p>
            ) : (
              items.map((n) => {
                const content = (
                  <div
                    className={`border-b border-line px-4 py-3 text-sm transition-colors last:border-0 hover:bg-paper ${
                      n.isRead ? "text-ink/60" : "font-medium text-ink"
                    }`}
                  >
                    {!n.isRead && <span className="me-2 inline-block h-2 w-2 rounded-full bg-primary" />}
                    {n.message}
                  </div>
                );
                return n.link ? (
                  <Link key={n._id} href={n.link} onClick={() => handleItemClick(n)}>
                    {content}
                  </Link>
                ) : (
                  <div key={n._id} onClick={() => handleItemClick(n)} className="cursor-pointer">
                    {content}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
