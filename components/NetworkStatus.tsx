"use client";

import { useEffect, useRef, useState } from "react";
import { Wifi, WifiOff, X } from "lucide-react";

type Status = "online" | "offline" | "hidden";

export default function NetworkStatus() {
    const [status, setStatus] = useState<Status>("hidden");
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        // Don't flash "online" on first mount — only show when status changes
        if (!navigator.onLine) setStatus("offline");

        const handleOffline = () => {
            clearTimeout(timerRef.current);
            setStatus("offline");
        };

        const handleOnline = () => {
            setStatus("online");
            timerRef.current = setTimeout(() => setStatus("hidden"), 3500);
        };

        window.addEventListener("offline", handleOffline);
        window.addEventListener("online", handleOnline);

        return () => {
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("online", handleOnline);
            clearTimeout(timerRef.current);
        };
    }, []);

    if (status === "hidden") return null;

    const isOnline = status === "online";

    return (
        <div
            role="status"
            aria-live="polite"
            className={`
                fixed top-4 left-1/2 z-[9999] -translate-x-1/2
                flex items-center gap-3 rounded-2xl border px-4 py-3
                shadow-lg backdrop-blur-sm
                animate-in fade-in slide-in-from-top-2 duration-300
                ${isOnline
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-100"
                    : "border-red-200 bg-red-50 text-red-700 shadow-red-100"
                }
            `}
        >
            {/* Icon */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isOnline ? "bg-emerald-100" : "bg-red-100"}`}>
                {isOnline
                    ? <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
                    : <WifiOff className="w-3.5 h-3.5" strokeWidth={2.5} />
                }
            </div>

            {/* Message */}
            <div>
                <p className="text-sm font-semibold leading-none">
                    {isOnline ? "Back online" : "No internet connection"}
                </p>
                <p className="text-xs mt-0.5 opacity-75">
                    {isOnline
                        ? "Your connection has been restored."
                        : "Check your Wi-Fi or mobile data."}
                </p>
            </div>

            {/* Dismiss (offline only) */}
            {!isOnline && (
                <button
                    type="button"
                    onClick={() => setStatus("hidden")}
                    aria-label="Dismiss"
                    className="ml-2 w-5 h-5 rounded-full flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors flex-shrink-0"
                >
                    <X className="w-3 h-3" strokeWidth={3} />
                </button>
            )}

            {/* Auto-dismiss progress bar (online only) */}
            {isOnline && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-emerald-200 overflow-hidden">
                    <div className="h-full bg-emerald-500 animate-[shrink_3.5s_linear_forwards]" />
                </div>
            )}
        </div>
    );
}