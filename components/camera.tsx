"use client";

import { addCameraPhoto, getUserMedia, type CameraPhotoResult } from "@/app/actions/userMedia";
import Cookies from "js-cookie";
import { useEffect, useMemo, useRef, useState } from "react";

function dataUrlToDownloadName(capturedAt: string, index: number) {
  const date = Number.isNaN(Date.parse(capturedAt))
    ? new Date()
    : new Date(capturedAt);
  return `danavos-camera-${date.toISOString().replaceAll(":", "-")}-${index + 1}.jpg`;
}

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [photos, setPhotos] = useState<CameraPhotoResult[]>([]);
  const [selectedPhotoId, setSelectedPhotoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = Cookies.get("userId")?.trim();

  useEffect(() => {
    let isMounted = true;

    const loadPhotos = async () => {
      if (!userId) {
        if (isMounted) {
          setError("Missing user session.");
        }
        return;
      }

      try {
        const media = await getUserMedia(userId);
        if (!isMounted) return;

        setPhotos(media.cameraPhotos);
        if (media.cameraPhotos.length > 0) {
          setSelectedPhotoId(media.cameraPhotos[0].id);
        }
      } catch (loadError) {
        if (!isMounted) return;
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load photos.",
        );
      }
    };

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = mediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (cameraError) {
        if (!isMounted) return;
        setError(
          cameraError instanceof Error
            ? cameraError.message
            : "Unable to access camera.",
        );
      }
    };

    void loadPhotos();
    void startCamera();

    return () => {
      isMounted = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [userId]);

  const selectedPhoto = useMemo(
    () => photos.find((photo) => photo.id === selectedPhotoId) ?? photos[0],
    [photos, selectedPhotoId],
  );

  const handleCapture = async () => {
    if (!userId) {
      setError("Missing user session.");
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      setError("Camera stream is not ready.");
      return;
    }

    const maxWidth = 1280;
    const scale = Math.min(1, maxWidth / videoElement.videoWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(videoElement.videoWidth * scale);
    canvas.height = Math.round(videoElement.videoHeight * scale);

    const context = canvas.getContext("2d");
    if (!context) {
      setError("Unable to capture image.");
      return;
    }

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    setLoading(true);
    setError("");
    try {
      const media = await addCameraPhoto(userId, dataUrl);
      setPhotos(media.cameraPhotos);
      if (media.cameraPhotos.length > 0) {
        setSelectedPhotoId(media.cameraPhotos[0].id);
      }
    } catch (captureError) {
      setError(
        captureError instanceof Error ? captureError.message : "Failed to save photo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-full w-full space-y-4 rounded-2xl border border-white/20 bg-black/45 p-4 text-white">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-white/20 bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-[280px] w-full bg-black object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleCapture}
            disabled={loading}
            className="rounded-lg border border-white/25 bg-white/15 px-4 py-2 text-sm font-medium hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Saving..." : "Capture Photo"}
          </button>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-white/90">Selected Photo</p>
          {selectedPhoto ? (
            <>
              <div className="overflow-hidden rounded-xl border border-white/20 bg-black">
                <img
                  src={selectedPhoto.dataUrl}
                  alt="Captured"
                  className="h-[220px] w-full object-cover"
                />
              </div>
              <a
                href={selectedPhoto.dataUrl}
                download={dataUrlToDownloadName(selectedPhoto.capturedAt, 0)}
                className="inline-flex rounded-lg border border-emerald-300/40 bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-500/30"
              >
                Download Photo
              </a>
            </>
          ) : (
            <p className="text-sm text-white/70">No photos captured yet.</p>
          )}
        </div>
      </div>

      {photos.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-white/90">Saved Photos</p>
          <div className="grid max-h-48 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 lg:grid-cols-5">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedPhotoId(photo.id)}
                className={`group overflow-hidden rounded-lg border bg-black/30 ${
                  selectedPhoto?.id === photo.id
                    ? "border-emerald-300/70 ring-1 ring-emerald-300/60"
                    : "border-white/20"
                }`}
              >
                <img
                  src={photo.dataUrl}
                  alt={`Captured ${index + 1}`}
                  className="h-20 w-full object-cover transition group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
