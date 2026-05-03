"use client";

import { getUserMedia } from "@/app/actions/userMedia";
import { getUserNotes } from "@/app/actions/userNotes";
import Cookies from "js-cookie";
import {
  Download,
  FileText,
  Folder,
  HardDrive,
  ImageIcon,
  ShieldAlert,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ExplorerView = "root" | "photos" | "documents";

type PhotoItem = {
  id: string;
  label: string;
  url: string;
};

type DocumentItem = {
  id: string;
  title: string;
};

const SYSTEM_FILES = [
  "kernel.sys",
  "bootloader.bin",
  "registry.dat",
  "drivers.dll",
  "security.lock",
];

export default function FileExplorer() {
  const [view, setView] = useState<ExplorerView>("root");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = Cookies.get("userId")?.trim();
    if (!userId) {
      setError("Missing user session.");
      return;
    }

    const loadData = async () => {
      try {
        const [media, notes] = await Promise.all([
          getUserMedia(userId),
          getUserNotes(userId),
        ]);

        const items: PhotoItem[] = [];
        media.cameraPhotos.forEach((photo, index) => {
          if (!photo.dataUrl) return;
          items.push({
            id: `camera-${photo.id}`,
            label: `Camera Photo ${index + 1}`,
            url: photo.dataUrl,
          });
        });

        if (media.pfpLink) {
          items.push({
            id: "profile",
            label: "Profile Logo",
            url: media.pfpLink,
          });
        }

        media.wallpaperLinks.forEach((url, index) => {
          if (!url) return;
          items.push({
            id: `wallpaper-${index}`,
            label: `Wallpaper ${index + 1}`,
            url,
          });
        });

        setPhotos(items);
        setDocuments(
          notes.map((note, index) => ({
            id: note.id,
            title: note.title || `Untitled ${index + 1}`,
          })),
        );
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Failed to load explorer data";
        setError(message);
      }
    };

    void loadData();
  }, []);

  const rootFolders = useMemo(
    () => [
      {
        id: "system",
        label: "System",
        subtitle: `${SYSTEM_FILES.length} protected files`,
        icon: <HardDrive className="size-6 text-emerald-300" />,
        onClick: () => setShowAdminPopup(true),
      },
      {
        id: "photos",
        label: "Photos",
        subtitle: `${photos.length} media items`,
        icon: <ImageIcon className="size-6 text-emerald-300" />,
        onClick: () => setView("photos"),
      },
      {
        id: "documents",
        label: "Documents",
        subtitle: `${documents.length} text files`,
        icon: <FileText className="size-6 text-emerald-300" />,
        onClick: () => setView("documents"),
      },
    ],
    [photos.length, documents.length],
  );

  return (
    <section className=" font-inter relative h-full min-h-130 w-full overflow-hidden rounded-2xl border border-emerald-200/20 bg-emerald-950/85 text-emerald-50 shadow-2xl">
      <div className="flex items-center justify-between border-b border-emerald-200/15 px-5 py-3">
        <div className="flex items-center gap-2 text-emerald-300">
          <Folder className="size-4" />
          <p className="text-xs tracking-[0.22em] uppercase">File Explorer</p>
        </div>
        {view !== "root" ? (
          <button
            type="button"
            onClick={() => setView("root")}
            className="rounded-md border border-emerald-200/25 px-2 py-1 text-xs hover:bg-emerald-800/45"
          >
            Root
          </button>
        ) : null}
      </div>

      <div className="h-[calc(100%-53px)] overflow-auto p-4">
        {error ? <p className="mb-4 text-sm text-rose-300">{error}</p> : null}

        {view === "root" ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rootFolders.map((folder) => (
              <button
                key={folder.id}
                type="button"
                onClick={folder.onClick}
                className="group rounded-2xl border border-emerald-200/20 bg-emerald-900/25 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200/40 hover:bg-emerald-800/35"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-xl border border-emerald-200/25 bg-emerald-700/20 p-2">
                    {folder.icon}
                  </div>
                  <p className="font-semibold">{folder.label}</p>
                </div>
                <p className="text-xs text-emerald-200/75">{folder.subtitle}</p>
              </button>
            ))}
          </div>
        ) : null}

        {view === "photos" ? (
          photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  className="rounded-xl border border-emerald-200/20 bg-emerald-900/25 p-2"
                >
                  <div className="mb-2 aspect-square overflow-hidden rounded-lg border border-emerald-200/15 bg-black/20">
                    <img
                      src={photo.url}
                      alt={photo.label}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="truncate text-xs text-emerald-100">
                    {photo.label}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-emerald-200/70">No media found.</p>
          )
        ) : null}

        {view === "documents" ? (
          documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 rounded-xl border border-emerald-200/20 bg-emerald-900/25 px-3 py-2"
                >
                  <FileText className="size-4 text-emerald-300" />
                  <span className="text-sm">{doc.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-emerald-200/70">No documents found.</p>
          )
        ) : null}
      </div>

      {showAdminPopup ? (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black/55 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-emerald-200/20 bg-emerald-950 p-5 shadow-xl">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-5 text-amber-300" />
                <p className="font-semibold">Restricted Folder</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminPopup(false)}
                className="rounded-md p-1 text-emerald-200/80 hover:bg-emerald-800/40"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="text-sm text-emerald-200/80">
              This folder can only be opened by{" "}
              <span className="font-semibold">Administrator</span>.
            </p>
            <div className="mt-4 rounded-lg border border-emerald-200/15 bg-emerald-900/25 p-3">
              <p className="mb-2 text-xs tracking-[0.18em] text-emerald-300 uppercase">
                Protected system files
              </p>
              <div className="space-y-1">
                {SYSTEM_FILES.map((file) => (
                  <p key={file} className="text-xs text-emerald-200/75">
                    {file}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedPhoto ? (
        <div className="absolute inset-0 z-30 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-emerald-200/25 bg-emerald-950 p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="truncate text-sm font-semibold text-emerald-100">
                {selectedPhoto.label}
              </p>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="rounded-md p-1 text-emerald-200/80 hover:bg-emerald-800/40"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="overflow-hidden rounded-lg border border-emerald-200/20 bg-black/40">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.label}
                className="max-h-[60vh] w-full object-contain"
              />
            </div>
            <div className="mt-3">
              <a
                href={selectedPhoto.url}
                download={`${selectedPhoto.label.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "photo"}.jpg`}
                className="inline-flex items-center gap-2 rounded-md border border-emerald-200/30 bg-emerald-800/30 px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-700/35"
              >
                <Download className="size-4" />
                Download Photo
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
