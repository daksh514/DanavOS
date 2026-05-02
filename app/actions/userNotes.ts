"use server";

import connectDB from "@/lib/db";
import UserNoteModel from "@/lib/models/userNote";

export type UserNoteResult = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};

function normalizeUserId(userId: string) {
  return typeof userId === "string" ? userId.trim() : "";
}

function normalizeTitle(title: string) {
  const normalized = typeof title === "string" ? title.trim() : "";
  return normalized || "Untitled";
}

function normalizeContent(content: string) {
  return typeof content === "string" ? content : "";
}

function toResult(doc: {
  _id: { toString(): string };
  title: string;
  content: string;
  updatedAt: Date;
}): UserNoteResult {
  return {
    id: doc._id.toString(),
    title: doc.title,
    content: doc.content,
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function getUserNotes(userId: string): Promise<UserNoteResult[]> {
  const normalizedUserId = normalizeUserId(userId);
  if (!normalizedUserId) {
    throw new Error("Missing userId");
  }

  await connectDB();

  const notes = await UserNoteModel.find({ userId: normalizedUserId })
    .sort({ updatedAt: -1 })
    .lean()
    .exec();

  return notes.map((note) => toResult(note));
}

export async function createUserNote(
  userId: string,
  title?: string,
): Promise<UserNoteResult> {
  const normalizedUserId = normalizeUserId(userId);
  if (!normalizedUserId) {
    throw new Error("Missing userId");
  }

  await connectDB();

  const now = new Date();
  const insertResult = await UserNoteModel.collection.insertOne({
    userId: normalizedUserId,
    title: normalizeTitle(title ?? "Untitled"),
    content: "",
    createdAt: now,
    updatedAt: now,
  });

  const created = await UserNoteModel.findById(insertResult.insertedId).lean().exec();
  if (!created) {
    throw new Error("Failed to create note");
  }

  return toResult(created);
}

export async function saveUserNote(input: {
  userId: string;
  noteId: string;
  title: string;
  content: string;
}): Promise<UserNoteResult> {
  const normalizedUserId = normalizeUserId(input.userId);
  const normalizedNoteId = typeof input.noteId === "string" ? input.noteId : "";

  if (!normalizedUserId) {
    throw new Error("Missing userId");
  }

  if (!normalizedNoteId) {
    throw new Error("Missing noteId");
  }

  await connectDB();

  const updated = await UserNoteModel.findOneAndUpdate(
    { _id: normalizedNoteId, userId: normalizedUserId },
    {
      $set: {
        title: normalizeTitle(input.title),
        content: normalizeContent(input.content),
      },
    },
    { new: true },
  )
    .lean()
    .exec();

  if (!updated) {
    throw new Error("Note not found");
  }

  return toResult(updated);
}
