"use client";

import { UploadButton } from "@/lib/uploadthing";

type MediaUploadButtonProps = {
  endpoint: "pfpUploader" | "wallpaperUploader";
  buttonText: string;
  onUploaded: (url: string) => Promise<void> | void;
};

export default function MediaUploadButton({
  endpoint,
  buttonText,
  onUploaded,
}: MediaUploadButtonProps) {
  return (
    <UploadButton
      endpoint={endpoint}
      appearance={{
        button:
          "ut-ready:bg-primary ut-uploading:bg-primary/70 rounded-lg px-3 py-2 text-sm",
        allowedContent: "hidden",
      }}
      content={{
        button: buttonText,
      }}
      onClientUploadComplete={async (files) => {
        const uploadedUrl = files?.[0]?.serverData?.url ?? files?.[0]?.ufsUrl;
        if (!uploadedUrl) {
          return;
        }
        await onUploaded(uploadedUrl);
      }}
      onUploadError={(error: Error) => {
        alert(error.message);
      }}
    />
  );
}
