"use client";

import { useEffect, useRef } from "react";
import { IBooking } from "@/app/admin/page";

interface BookingDetailModalProps {
  booking: IBooking | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const statusConfig = {
  pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  approved: {
    label: "Approved",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-rose-100",
    text: "text-rose-600",
    dot: "bg-rose-400",
  },
  "checked-in": {
    label: "Checked In",
    bg: "bg-sky-100",
    text: "text-sky-700",
    dot: "bg-sky-400",
  },
  expired: {
    label: "Expired",
    bg: "bg-gray-100",
    text: "text-gray-500",
    dot: "bg-gray-400",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-gray-100",
    text: "text-gray-500",
    dot: "bg-gray-400",
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const avatarColors = [
  { bg: "bg-violet-200", text: "text-violet-700" },
  { bg: "bg-sky-200", text: "text-sky-700" },
  { bg: "bg-teal-200", text: "text-teal-700" },
  { bg: "bg-rose-200", text: "text-rose-700" },
  { bg: "bg-amber-200", text: "text-amber-700" },
];

function getAvatarColor(name: string) {
  const idx = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[idx];
}

export default function BookingDetailModal({
  booking,
  onClose,
  onApprove,
  onReject,
}: BookingDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!booking) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [booking, onClose]);

  if (!booking) return null;

  const status = statusConfig[booking.status] ?? statusConfig.pending;
  const avatar = getAvatarColor(booking.name);
  const initials = getInitials(booking.name);
  const isPending = booking.status === "pending";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "white",
          animation: "slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Colorful header strip */}
        <div
          className="relative px-6 pt-6 pb-5"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/20 transition-all"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-semibold shadow-md ${avatar.bg} ${avatar.text}`}
            >
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-lg leading-tight truncate">
                {booking.name}
              </p>
              {booking.deskId && (
                <p className="text-white/70 text-sm mt-0.5">
                  Desk {booking.deskId.deskNumber}
                </p>
              )}
            </div>

            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
        </div>

        {/* Detail rows */}
        <div className="px-6 py-4 space-y-1">

          <DetailRow
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 11.71 19.79 19.79 0 0 1 1.08 3.07 2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/></svg>
            }
            label="Phone number"
            value={booking.phoneNumber}
            color="text-violet-600"
            bg="bg-violet-50"
          />

          <DetailRow
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            }
            label="Purpose of visit"
            value={booking.purpose}
            color="text-sky-600"
            bg="bg-sky-50"
          />

          <DetailRow
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            }
            label="Proof of work"
            value={booking.proofOfWork}
            color="text-teal-600"
            bg="bg-teal-50"
            isFile
          />

          {booking.deskId && (
            <DetailRow
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="17"/><line x1="9.5" y1="14.5" x2="14.5" y2="14.5"/></svg>
              }
              label="Desk"
              value={`Desk ${booking.deskId.deskNumber}`}
              color="text-amber-600"
              bg="bg-amber-50"
            />
          )}
        </div>

        {/* Action buttons */}
        {isPending && (
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={() => { onApprove(booking._id); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", boxShadow: "0 4px 14px rgba(16,185,129,0.35)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Approve
            </button>
            <button
              onClick={() => { onReject(booking._id); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #f43f5e, #e11d48)", color: "white", boxShadow: "0 4px 14px rgba(244,63,94,0.35)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Reject
            </button>
          </div>
        )}

        {!isPending && (
          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl font-semibold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  color,
  bg,
  isFile = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bg: string;
  isFile?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${bg} ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
        {isFile ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm font-medium underline underline-offset-2 truncate block ${color}`}
          >
            {value.split("/").pop() ?? value}
          </a>
        ) : (
          <p className="text-sm text-gray-800 font-medium leading-snug">{value}</p>
        )}
      </div>
    </div>
  );
}
