"use client";

import { useEffect, useState } from "react";

import {
  getUserMedia,
  setActiveWallpaper,
  uploadUserImage,
  type UserMediaResult,
} from "@/app/actions/userMedia";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MediaUploadButton from "@/components/ui/dashboard/MediaUploadButton";
import Cookies from "js-cookie";

const EMPTY_MEDIA: UserMediaResult = {
  userId: "",
  pfpLink: "",
  wallpaperLinks: [],
  activeWallpaper: "",
};

export default function Settings() {
  const [oldPassword, setOldPassword] = useState("");
  const cookieName = Cookies.get("name");
  const [name, setName] = useState(cookieName ?? "");
  const cookiePassword = Cookies.get("password");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [media, setMedia] = useState<UserMediaResult>(EMPTY_MEDIA);
  const userId = Cookies.get("userId");

  useEffect(() => {
    let isMounted = true;

    async function loadMedia() {
      if (!userId) {
        return;
      }

      try {
        const result = await getUserMedia(userId);
        if (isMounted) {
          setMedia(result);
        }
      } catch {
        if (isMounted) {
          setMedia(EMPTY_MEDIA);
        }
      }
    }

    loadMedia();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  function handleNameChange() {
    setLoading(true);
    Cookies.set("name", name, { expires: 365 });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  function handlePasswordChange() {
    setLoading(true);
    if (oldPassword !== cookiePassword) {
      alert("Old password is incorrect.");
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      setLoading(false);
      return;
    }
    Cookies.set("password", newPassword, { expires: 365 });
    setTimeout(() => {
      setLoading(false);
      alert("Password updated successfully.");
      setNewPassword("");
      setOldPassword("");
    }, 1000);
  }

  async function handlePfpUpload(url: string) {
    if (!userId) {
      alert("Missing userId. Please log in again.");
      return;
    }

    setMediaLoading(true);
    try {
      const result = await uploadUserImage(userId, url, "pfp");
      setMedia(result);
      Cookies.set("pfp", result.pfpLink, { expires: 365, path: "/" });
    } catch {
      alert("Failed to save profile image.");
    } finally {
      setMediaLoading(false);
    }
  }

  async function handleWallpaperUpload(url: string) {
    if (!userId) {
      alert("Missing userId. Please log in again.");
      return;
    }

    setMediaLoading(true);
    try {
      const result = await uploadUserImage(userId, url, "wallpaper");
      setMedia(result);
    } catch {
      alert("Failed to save wallpaper.");
    } finally {
      setMediaLoading(false);
    }
  }

  async function handleWallpaperSelect(wallpaperUrl: string) {
    if (!userId || !wallpaperUrl) {
      return;
    }

    setMediaLoading(true);
    try {
      const result = await setActiveWallpaper(userId, wallpaperUrl);
      setMedia(result);
      Cookies.set("wallpaper", wallpaperUrl, { expires: 365, path: "/" });
    } catch {
      alert("Failed to set active wallpaper.");
    } finally {
      setMediaLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-6 p-4">
      <h2 className="text-lg font-semibold">Settings</h2>

      <section className="space-y-2 rounded-xl border bg-card p-4">
        <Label htmlFor="name">Change Name</Label>
        <div className="flex gap-2">
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter new name"
          />
          <Button type="button" onClick={handleNameChange} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </section>

      <section className="space-y-2 rounded-xl border bg-card p-4">
        <Label htmlFor="pfp">Upload Profile Picture</Label>
        <div className="space-y-3">
          {media.pfpLink ? (
            <img
              src={media.pfpLink}
              alt="Profile picture"
              className="h-20 w-20 rounded-full border object-cover"
            />
          ) : (
            <p className="text-sm text-muted-foreground">No profile picture yet.</p>
          )}
          <MediaUploadButton
            endpoint="pfpUploader"
            buttonText={mediaLoading ? "Saving..." : "Upload PFP"}
            onUploaded={handlePfpUpload}
          />
        </div>
      </section>

      <section className="space-y-2 rounded-xl border bg-card p-4">
        <Label htmlFor="wallpaper">Change Wallpaper</Label>
        <div className="space-y-3">
          <select
            id="wallpaper"
            className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
            value={media.activeWallpaper || ""}
            onChange={(e) => handleWallpaperSelect(e.target.value)}
            disabled={mediaLoading || media.wallpaperLinks.length === 0}
          >
            <option value="">
              {media.wallpaperLinks.length === 0
                ? "No wallpapers uploaded yet"
                : "Select wallpaper"}
            </option>
            {media.wallpaperLinks.map((link) => (
              <option key={link} value={link}>
                {link}
              </option>
            ))}
          </select>
          <MediaUploadButton
            endpoint="wallpaperUploader"
            buttonText={mediaLoading ? "Saving..." : "Upload New Wallpaper"}
            onUploaded={handleWallpaperUpload}
          />
        </div>
      </section>

      <section className="space-y-3 rounded-xl border bg-card p-4">
        <Label htmlFor="old-password">Change Password</Label>
        <Input
          id="old-password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Old password"
        />
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
        />
        <Button
          type="button"
          className="w-full"
          onClick={handlePasswordChange}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </section>
    </div>
  );
}
