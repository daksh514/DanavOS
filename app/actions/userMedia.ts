"use server";

import connectDB from "@/lib/db";
import UserMediaModel from "@/lib/models/userMedia";

export type UserMediaResult = {
  userId: string;
  pfpLink: string;
  wallpaperLinks: string[];
  activeWallpaper: string;
};

function normalizeUserId(userId: string) {
  return typeof userId === "string" ? userId.trim() : "";
}

export async function getUserMedia(userId: string): Promise<UserMediaResult> {
  const normalizedUserId = normalizeUserId(userId);
  if (!normalizedUserId) {
    throw new Error("Missing userId");
  }

  await connectDB();

  const mediaDoc = await UserMediaModel.findOne({ userId: normalizedUserId })
    .lean()
    .exec();

  return {
    userId: normalizedUserId,
    pfpLink: mediaDoc?.pfpLink ?? "",
    wallpaperLinks: mediaDoc?.wallpaperLinks ?? [],
    activeWallpaper: mediaDoc?.activeWallpaper ?? "",
  };
}

export async function uploadUserImage(
  userId: string,
  imageUrl: string,
  type: "pfp" | "wallpaper",
): Promise<UserMediaResult> {
  const normalizedUserId = normalizeUserId(userId);
  const normalizedImageUrl = typeof imageUrl === "string" ? imageUrl.trim() : "";

  if (!normalizedUserId) {
    throw new Error("Missing userId");
  }

  if (!normalizedImageUrl) {
    throw new Error("Missing imageUrl");
  }

  await connectDB();

  if (type === "pfp") {
    await UserMediaModel.findOneAndUpdate(
      { userId: normalizedUserId },
      { $set: { pfpLink: normalizedImageUrl } },
      { upsert: true },
    ).exec();
  } else {
    await UserMediaModel.findOneAndUpdate(
      { userId: normalizedUserId },
      {
        $addToSet: { wallpaperLinks: normalizedImageUrl },
        $set: { activeWallpaper: normalizedImageUrl },
      },
      { upsert: true },
    ).exec();
  }

  return getUserMedia(normalizedUserId);
}

export async function setActiveWallpaper(
  userId: string,
  wallpaperUrl: string,
): Promise<UserMediaResult> {
  const normalizedUserId = normalizeUserId(userId);
  const normalizedWallpaperUrl =
    typeof wallpaperUrl === "string" ? wallpaperUrl.trim() : "";

  if (!normalizedUserId) {
    throw new Error("Missing userId");
  }

  if (!normalizedWallpaperUrl) {
    throw new Error("Missing wallpaperUrl");
  }

  await connectDB();

  await UserMediaModel.findOneAndUpdate(
    { userId: normalizedUserId },
    {
      $addToSet: { wallpaperLinks: normalizedWallpaperUrl },
      $set: { activeWallpaper: normalizedWallpaperUrl },
    },
    { upsert: true },
  ).exec();

  return getUserMedia(normalizedUserId);
}
