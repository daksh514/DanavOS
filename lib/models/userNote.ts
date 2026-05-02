import mongoose, { Document, Schema } from "mongoose";

export interface IUserNote extends Document {
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserNoteSchema = new Schema<IUserNote>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, default: "Untitled" },
    content: { type: String, default: "" },
  },
  { timestamps: true },
);

UserNoteSchema.index({ userId: 1, updatedAt: -1 });

const UserNoteModel =
  mongoose.models.UserNote ||
  mongoose.model<IUserNote>("UserNote", UserNoteSchema);

export default UserNoteModel;
