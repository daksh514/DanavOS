"use server";

import connectDB from "@/lib/db";
import UserIdModel from "@/lib/models/userId";

export async function saveUserId(
  userId: string,
): Promise<{ ok: boolean; error?: string }> {
  const normalizedUserId = typeof userId === "string" ? userId.trim() : "";

  if (!normalizedUserId) {
    return { ok: false, error: "Missing userId" };
  }

  try {
    await connectDB();

    await UserIdModel.findOneAndUpdate(
      { userId: normalizedUserId },
      { userId: normalizedUserId },
      { upsert: true },
    );

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, error: message };
  }
}
