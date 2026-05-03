import mongoose, { Document, Schema } from "mongoose";

interface ICameraPhoto {
  dataUrl: string;
  capturedAt: Date;
}

export interface IUserMedia extends Document {
  userId: string;
  pfpLink: string;
  wallpaperLinks: string[];
  activeWallpaper: string;
  cameraPhotos: ICameraPhoto[];
  createdAt: Date;
  updatedAt: Date;
}

const CameraPhotoSchema = new Schema<ICameraPhoto>(
  {
    dataUrl: { type: String, required: true },
    capturedAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const UserMediaSchema = new Schema<IUserMedia>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    pfpLink: { type: String, default: "" },
    wallpaperLinks: { type: [String], default: [] },
    activeWallpaper: { type: String, default: "" },
    cameraPhotos: { type: [CameraPhotoSchema], default: [] },
  },
  { timestamps: true },
);

const UserMediaModel =
  mongoose.models.UserMedia ||
  mongoose.model<IUserMedia>("UserMedia", UserMediaSchema);

export default UserMediaModel;
