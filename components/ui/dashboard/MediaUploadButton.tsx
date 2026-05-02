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
          "ut-ready:bg-primary ut-uploading:bg-primary/80 ut-ready:text-primary-foreground ut-uploading:text-primary-foreground inline-flex h-9 min-w-56 items-center justify-center rounded-lg border border-border px-3 text-sm font-medium shadow-sm",
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
