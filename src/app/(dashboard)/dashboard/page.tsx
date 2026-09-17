"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Dropdown } from "@/components/ui";
import {
  Plus,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Star,
  LayoutTemplate,
  ArrowRight,
  Check,
  Search,
} from "lucide-react";
import { TEMPLATES, LAYOUT_LABELS, STARRED_RESUME_KEY } from "@/lib/constants";
import { TemplateThumbnail } from "@/components/editor/TemplateThumbnail";
import { useResumeStore } from "@/store/useResumeStore";
import { useUIStore } from "@/store/useUIStore";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/utils/cn";
import toast from "react-hot-toast";

const QUICK_START_IDS = ["premier", "modern-navy", "elegant-burgundy", "ats"];

// Avoid a server/client mismatch while local data hydrates.
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function WorkspacePage() {
  const router = useRouter();
  const { title, data, lastSaved, resetResume, setTemplate } = useResumeStore();
  const { resumeSearchQuery, setResumeSearchQuery } = useUIStore();
  const mounted = useMounted();
  const [starred, setStarred] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STARRED_RESUME_KEY) === "1";
  });

  const info = data?.personalInfo;

  // Use one checklist for both the score and missing fields.
  const checklist = [
    { label: "Name, email and phone", done: Boolean(info?.fullName && info?.email && info?.phone) },
    { label: "Professional title", done: Boolean(info?.title) },
    { label: "A summary of at least 40 characters", done: (data?.summary?.trim().length ?? 0) >= 40 },
    { label: "At least one role in Experience", done: (data?.workExperience?.length ?? 0) >= 1 },
    { label: "At least one entry in Education", done: (data?.education?.length ?? 0) >= 1 },
    { label: "Three or more skills", done: (data?.skills?.length ?? 0) >= 3 },
    {
      label: "A language, project or certification",
      done:
        (data?.languages?.length ?? 0) +
          (data?.projects?.length ?? 0) +
          (data?.certifications?.length ?? 0) >=
        1,
    },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const progress = Math.round((doneCount / checklist.length) * 100);
  const remaining = checklist.filter((c) => !c.done);

  const templateId = data?.style?.templateId || "modern";
  const docTemplate = TEMPLATES.find((t) => t.id === templateId);
  const docTitle = title || "Untitled CV";
  const firstName = info?.fullName?.trim().split(/\s+/)[0];
  const searchTerms = resumeSearchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const searchHaystack = [
    docTitle,
    info?.fullName,
    info?.title,
    info?.email,
    docTemplate?.name,
    docTemplate ? LAYOUT_LABELS[docTemplate.baseTemplate] : undefined,
    ...(data?.workExperience ?? []).flatMap((item) => [item.title, item.jobTitle, item.company]),
    ...(data?.education ?? []).flatMap((item) => [item.degree, item.fieldOfStudy, item.school]),
    ...(data?.skills ?? []).map((item) => item.name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const matchesSearch = searchTerms.every((term) => searchHaystack.includes(term));

  const toggleStar = () => {
    setStarred((prev) => {
      const next = !prev;
      window.localStorage.setItem(STARRED_RESUME_KEY, next ? "1" : "0");
      return next;
    });
  };

  const handleCreate = (templateId?: string) => {
    resetResume();
    setResumeSearchQuery("");
    setStarred(false);
    window.localStorage.removeItem(STARRED_RESUME_KEY);

    if (templateId) {
      setTemplate(templateId);
      router.push(`/resume/new/edit?template=${encodeURIComponent(templateId)}`);
      return;
    }

    router.push("/resume/1/edit");
  };

  const handleDelete = () => {
    resetResume();
    setStarred(false);
    window.localStorage.removeItem(STARRED_RESUME_KEY);
    toast.success("Draft cleared from this device");
  };

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-6xl pb-20">
      <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-primary-400">
          {new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold tracking-tight text-dark-100 lg:text-5xl">
          {greeting(new Date().getHours())}
          {firstName ? `, ${firstName}` : ""}
        </h1>
      </motion.header>

      {matchesSearch ? (
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="relative mt-12 grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16"
      >
        <div className="pointer-events-none absolute -inset-x-10 -top-16 bottom-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_22%_40%,rgba(184,68,46,0.13),transparent_70%)]" />

        <div className="group relative mx-auto w-full max-w-[340px]">
          <Link href="/resume/1/edit" aria-label={`Open ${docTitle}`}>
            <div className="relative aspect-[1/1.4142] overflow-hidden rounded-xl bg-white shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] ring-1 ring-primary-500/25 transition-all duration-500 group-hover:ring-primary-500/50">
              <TemplateThumbnail templateId={templateId} sample={false} eager />
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="mb-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white">
                  Open <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
          <button
            onClick={toggleStar}
            aria-label={starred ? "Remove star" : "Star this document"}
            className={cn(
              "absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border transition-all",
              starred
                ? "border-primary-400/60 bg-primary-500/25 text-primary-300"
                : "border-dark-700 bg-surface-elevated text-dark-400 hover:text-dark-200"
            )}
          >
            <Star size={15} fill={starred ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-dark-400">
                Your document
              </p>
              <h2 className="font-display mt-2 truncate text-3xl font-bold text-dark-100">{docTitle}</h2>
            </div>
            <Dropdown
              align="right"
              trigger={
                <button
                  className="rounded-lg p-1.5 text-dark-400 transition-all hover:bg-dark-800 hover:text-dark-100"
                  aria-label="Document options"
                >
                  <MoreVertical size={16} />
                </button>
              }
              items={[
                { label: "Open", value: "open", icon: <Edit size={14} />, onClick: () => router.push("/resume/1/edit") },
                { label: starred ? "Remove star" : "Star", value: "star", icon: <Star size={14} />, onClick: toggleStar },
                { label: "Clear draft", value: "delete", icon: <Trash2 size={14} />, danger: true, divider: true, onClick: handleDelete },
              ]}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-dark-400">
            {docTemplate && (
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: docTemplate.accent }} />
                {LAYOUT_LABELS[docTemplate.baseTemplate]} layout
              </span>
            )}
            {lastSaved && (
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                Edited {formatDistanceToNow(new Date(lastSaved))} ago
              </span>
            )}
            <span>Saved on this device only</span>
          </div>

          <div className="mt-9">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl font-bold leading-none text-primary-400">{progress}%</span>
              <span className="text-sm text-dark-400">complete</span>
            </div>
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-dark-800">
              <motion.div
                className="h-full rounded-full bg-primary-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="mt-7 min-h-[76px]">
            {remaining.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-dark-300">
                <Check size={16} className="text-primary-400" />
                Every section is filled in — your CV is ready to send.
              </p>
            ) : (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-dark-400">
                  To finish
                </p>
                <ul className="mt-3 space-y-1.5">
                  {remaining.slice(0, 3).map((item) => (
                    <li key={item.label} className="flex items-center gap-2.5 text-sm text-dark-300">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500/70" />
                      {item.label}
                    </li>
                  ))}
                  {remaining.length > 3 && (
                    <li className="pl-4 text-xs text-dark-400">and {remaining.length - 3} more</li>
                  )}
                </ul>
              </>
            )}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/resume/1/edit">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={17} />}>
                Continue editing
              </Button>
            </Link>
            <Link href="/templates">
              <Button
                variant="outline"
                size="lg"
                className="border-dark-700 text-dark-200 hover:bg-dark-800"
                leftIcon={<LayoutTemplate size={16} />}
              >
                Change layout
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
          className="mt-12 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-dark-700 bg-surface-elevated/40 px-6 text-center"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-dark-800 text-dark-400">
            <Search size={21} aria-hidden="true" />
          </span>
          <h2 className="font-display mt-5 text-2xl font-bold text-dark-100">No resumes found</h2>
          <p className="mt-2 max-w-md text-sm text-dark-400">
            No resume matches “{resumeSearchQuery.trim()}”. Try another name, title, skill, or template.
          </p>
          <Button
            variant="outline"
            className="mt-6 border-dark-500 text-dark-200 hover:bg-dark-800"
            onClick={() => setResumeSearchQuery("")}
          >
            Clear search
          </Button>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="mt-24"
      >
        <div className="flex items-end justify-between gap-4 border-b border-dark-800 pb-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-dark-400">
            Start something new
          </h3>
          <Link
            href="/templates"
            className="text-xs text-dark-400 transition-colors hover:text-primary-400"
          >
            Browse every layout →
          </Link>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <button
            onClick={() => handleCreate()}
            // The square tile is sized for the five-column desktop grid. On a
            // phone the grid collapses to one column, where that aspect ratio
            // turned this into a 343x378 empty dashed box -- a screen of void
            // between the heading and the first template. It becomes a compact
            // row there instead.
            className="group flex cursor-pointer flex-row items-center justify-center gap-3 rounded-xl border border-dashed border-dark-700 py-5 transition-all duration-300 hover:border-primary-500/50 hover:bg-primary-500/5 sm:aspect-[1/1.1] sm:flex-col sm:py-0"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white transition-transform duration-300 group-hover:scale-110">
              <Plus size={20} />
            </span>
            <span className="text-sm font-medium text-dark-200">Blank document</span>
          </button>

          {QUICK_START_IDS.map((id) => {
            const t = TEMPLATES.find((x) => x.id === id);
            if (!t) return null;
            return (
              <button
                key={id}
                onClick={() => handleCreate(id)}
                className="group text-left"
              >
                <div className="relative aspect-[1/1.4142] overflow-hidden rounded-xl bg-white opacity-70 shadow-lg ring-1 ring-white/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-100 group-hover:ring-primary-500/40">
                  <TemplateThumbnail templateId={id} />
                </div>
                <p className="mt-2.5 text-xs text-dark-400 transition-colors group-hover:text-dark-200">
                  {LAYOUT_LABELS[t.baseTemplate]}
                </p>
              </button>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
