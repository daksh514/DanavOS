import mongoose, { Schema, Document } from "mongoose";

export interface IUserId extends Document {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserIdSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export default mongoose.models.UserId ||
  mongoose.model<IUserId>("UserId", UserIdSchema);
