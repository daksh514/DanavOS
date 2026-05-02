"use client";

import { createUserNote, getUserNotes, saveUserNote } from "@/app/actions/userNotes";
import Cookies from "js-cookie";
import { Plus, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type NoteItem = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Notepad() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeId) ?? null,
    [notes, activeId],
  );

  useEffect(() => {
    const cookieUserId = Cookies.get("userId")?.trim() ?? "";
    setUserId(cookieUserId);

    if (!cookieUserId) {
      setError("Missing user session. Please log in again.");
      return;
    }

    const loadNotes = async () => {
      setIsLoading(true);
      try {
        const loadedNotes = await getUserNotes(cookieUserId);
        setNotes(loadedNotes);

        if (loadedNotes[0]) {
          setActiveId(loadedNotes[0].id);
          setTitle(loadedNotes[0].title);
          setContent(loadedNotes[0].content);
        }
      } catch (loadError) {
        const message =
          loadError instanceof Error ? loadError.message : "Failed to load notes";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadNotes();
  }, []);

  useEffect(() => {
    if (!activeNote) return;
    setTitle(activeNote.title);
    setContent(activeNote.content);
  }, [activeNote]);

  const handleAddFile = () => {
    if (!userId) return;
    setError("");
    setInfo("");

    const addNote = async () => {
      setIsLoading(true);
      try {
        const newNote = await createUserNote(userId, `Untitled ${notes.length + 1}`);
        setNotes((prev) => [newNote, ...prev]);
        setActiveId(newNote.id);
        setTitle(newNote.title);
        setContent(newNote.content);
        setInfo("New file created.");
      } catch (createError) {
        const message =
          createError instanceof Error ? createError.message : "Failed to create file";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void addNote();
  };

  const handleSelectNote = (note: NoteItem) => {
    setActiveId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setInfo("");
    setError("");
  };

  const handleSave = () => {
    if (!activeId || !userId) return;
    setError("");
    setInfo("");

    const saveNote = async () => {
      setIsSaving(true);
      try {
        const updated = await saveUserNote({
          userId,
          noteId: activeId,
          title,
          content,
        });

        setNotes((prev) =>
          prev
            .map((note) => (note.id === updated.id ? updated : note))
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
            ),
        );
        setActiveId(updated.id);
        setInfo("Saved.");
      } catch (saveError) {
        const message =
          saveError instanceof Error ? saveError.message : "Failed to save note";
        setError(message);
      } finally {
        setIsSaving(false);
      }
    };

    void saveNote();
  };

  return (
    <section className="h-full min-h-[520px] w-full overflow-hidden rounded-2xl border border-emerald-200/20 bg-emerald-950/80 text-emerald-50 shadow-2xl backdrop-blur-md">
      <div className="grid h-full grid-cols-[260px_1fr]">
        <aside className="border-r border-emerald-200/15 bg-emerald-900/30 p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs tracking-[0.24em] text-emerald-300 uppercase">Files</p>
            <button
              type="button"
              onClick={handleAddFile}
              disabled={!userId || isLoading}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={14} />
              Add file
            </button>
          </div>

          <div className="max-h-[460px] space-y-1 overflow-auto pr-1">
            {notes.length === 0 ? (
              <p className="px-2 py-4 text-sm text-emerald-200/70">
                No files yet. Add one to start writing.
              </p>
            ) : (
              notes.map((note, idx) => {
                const isActive = note.id === activeId;
                return (
                  <motion.button
                    type="button"
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.2), duration: 0.2 }}
                    className={`w-full cursor-pointer rounded-xl border px-3 py-2 text-left transition-all duration-200 ${
                      isActive
                        ? "border-emerald-300/35 bg-emerald-500/20 shadow-md"
                        : "border-transparent bg-emerald-900/15 hover:-translate-x-1 hover:border-emerald-300/25 hover:bg-emerald-700/25"
                    }`}
                  >
                    <p className="truncate text-sm font-medium">{note.title || "Untitled"}</p>
                    <p className="mt-0.5 text-xs text-emerald-200/70">
                      {formatUpdatedAt(note.updatedAt)}
                    </p>
                  </motion.button>
                );
              })
            )}
          </div>
        </aside>

        <main className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-emerald-200/15 px-5 py-3">
            <p className="text-xs tracking-[0.24em] text-emerald-300 uppercase">Notepad</p>
            <button
              type="button"
              onClick={handleSave}
              disabled={!activeId || isSaving}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-emerald-300/35 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-50 transition hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={14} />
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="File title"
              disabled={!activeId}
              className="w-full rounded-xl border border-emerald-300/25 bg-emerald-900/25 px-3 py-2 text-sm outline-none transition focus:border-emerald-300/55 focus:bg-emerald-900/40 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write your note here..."
              disabled={!activeId}
              className="min-h-[300px] flex-1 resize-none rounded-xl border border-emerald-300/25 bg-emerald-900/25 px-3 py-3 font-mono text-sm leading-6 whitespace-pre-wrap outline-none transition focus:border-emerald-300/55 focus:bg-emerald-900/40 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="min-h-5 text-xs">
              {error ? <p className="text-rose-300">{error}</p> : null}
              {!error && info ? <p className="text-emerald-300/85">{info}</p> : null}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
