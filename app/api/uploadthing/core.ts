import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Define a route for wallpapers
  wallpaperUploader: f({ image: { maxFileSize: "8MB" } }).onUploadComplete(
    async ({ file }) => {
      return { url: file.ufsUrl };
    },
  ),

  // Define a route for profile pictures
  pfpUploader: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.ufsUrl };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
