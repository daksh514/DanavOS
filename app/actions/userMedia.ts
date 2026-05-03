"use server";

import connectDB from "@/lib/db";
import UserMediaModel from "@/lib/models/userMedia";

const MAX_CAMERA_PHOTOS = 20;

export type CameraPhotoResult = {
  id: string;
  dataUrl: string;
  capturedAt: string;
};

export type UserMediaResult = {
  userId: string;
  pfpLink: string;
  wallpaperLinks: string[];
  activeWallpaper: string;
  cameraPhotos: CameraPhotoResult[];
};

function normalizeUserId(userId: string) {
  return typeof userId === "string" ? userId.trim() : "";
}

function normalizeDataUrl(dataUrl: string) {
  return typeof dataUrl === "string" ? dataUrl.trim() : "";
}

type CameraPhotoDoc = {
  _id?: { toString(): string } | string;
  dataUrl?: string;
  capturedAt?: Date | string;
};

function mapCameraPhotos(cameraPhotos: CameraPhotoDoc[] | undefined): CameraPhotoResult[] {
  if (!Array.isArray(cameraPhotos)) {
    return [];
  }

  return cameraPhotos
    .map((photo, index) => {
      const id = photo?._id ? String(photo._id) : `camera-${index}`;
      const dataUrl = typeof photo?.dataUrl === "string" ? photo.dataUrl : "";
      const capturedAt = photo?.capturedAt
        ? new Date(photo.capturedAt).toISOString()
        : new Date(0).toISOString();

      return {
        id,
        dataUrl,
        capturedAt,
      };
    })
    .filter((photo) => Boolean(photo.dataUrl));
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
    cameraPhotos: mapCameraPhotos(
      (mediaDoc?.cameraPhotos as CameraPhotoDoc[] | undefined) ?? [],
    ),
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

export async function addCameraPhoto(
  userId: string,
  dataUrl: string,
): Promise<UserMediaResult> {
  const normalizedUserId = normalizeUserId(userId);
  const normalizedDataUrl = normalizeDataUrl(dataUrl);

  if (!normalizedUserId) {
    throw new Error("Missing userId");
  }

  if (!normalizedDataUrl) {
    throw new Error("Missing dataUrl");
  }

  if (!normalizedDataUrl.startsWith("data:image/")) {
    throw new Error("Invalid image data");
  }

  await connectDB();

  await UserMediaModel.findOneAndUpdate(
    { userId: normalizedUserId },
    {
      $push: {
        cameraPhotos: {
          $each: [{ dataUrl: normalizedDataUrl, capturedAt: new Date() }],
          $position: 0,
          $slice: MAX_CAMERA_PHOTOS,
        },
      },
    },
    { upsert: true },
  ).exec();

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
