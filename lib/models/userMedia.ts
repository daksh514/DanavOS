import mongoose, { Document, Schema } from "mongoose";

export interface IUserMedia extends Document {
  userId: string;
  pfpLink: string;
  wallpaperLinks: string[];
  activeWallpaper: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserMediaSchema = new Schema<IUserMedia>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    pfpLink: { type: String, default: "" },
    wallpaperLinks: { type: [String], default: [] },
    activeWallpaper: { type: String, default: "" },
  },
  { timestamps: true },
);

const UserMediaModel =
  mongoose.models.UserMedia ||
  mongoose.model<IUserMedia>("UserMedia", UserMediaSchema);

export default UserMediaModel;
