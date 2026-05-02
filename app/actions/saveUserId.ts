"use server";

import connectDB from "@/lib/db";
import UserIdModel from "@/lib/models/userId";

export async function saveUserId(userId: string) {
  const normalizedUserId = typeof userId === "string" ? userId.trim() : "";

  if (!normalizedUserId) {
    throw new Error("Missing userId");
  }

  await connectDB();

  await UserIdModel.findOneAndUpdate(
    { userId: normalizedUserId },
    { userId: normalizedUserId },
    { upsert: true },
  );
}
