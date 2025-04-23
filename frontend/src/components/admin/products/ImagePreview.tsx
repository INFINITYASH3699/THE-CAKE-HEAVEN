// components/admin/products/ImagePreview.tsx
import { useState, useEffect } from "react";
import { FiAlertCircle, FiImage } from "react-icons/fi";

interface ImagePreviewProps {
  src: string;
  alt: string;
}

export default function ImagePreview({ src, alt }: ImagePreviewProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Reset error state when source changes
  useEffect(() => {
    setError(false);
    setLoading(true);

    // Cleanup function to revoke object URLs
    return () => {
      if (src && src.startsWith("blob:")) {
        URL.revokeObjectURL(src);
      }
    };
  }, [src]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${src}`);
    setError(true);
    setLoading(false);
  };

  // If no src is provided
  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <FiImage className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
        <div className="text-center p-2">
          <FiAlertCircle className="mx-auto h-6 w-6 text-red-500" />
          <p className="mt-1 text-xs">Failed to load</p>
          <p className="text-xs truncate max-w-[120px] mx-auto opacity-75">
            {typeof src === "string" ? src.substring(0, 20) + "..." : "image"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      )}

      <img
        src={src}
        alt={alt || "Product image"}
        className="w-full h-full object-cover"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
}
