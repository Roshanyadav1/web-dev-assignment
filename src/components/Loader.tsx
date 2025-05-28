"use client";

import clsx from "clsx";

export default function Loader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-8",
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className={clsx(
          "animate-spin rounded-full border-t-transparent border-blue-500",
          sizeClasses[size]
        )}
      />
    </div>
  );
}
