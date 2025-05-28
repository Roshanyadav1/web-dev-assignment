'use client';

import { useState } from "react";
import { uploadProjectImage } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface Props {
  projectId: string;
  onUpload?: () => void;
}

export default function ProjectImageUploader({ projectId, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadProjectImage(projectId, file);
      if (onUpload) onUpload();
      setFile(null);
    } catch (err) {
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
}
