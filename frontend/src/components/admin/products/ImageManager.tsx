// components/admin/products/ImageManager.tsx
import { useState, useRef, DragEvent, useEffect } from "react";
import ImagePreview from "./ImagePreview";
import {
  FiUpload,
  FiLink,
  FiPlus,
  FiTrash,
  FiMove,
  FiArrowLeft,
  FiArrowRight,
  FiImage,
  FiAlertTriangle,
} from "react-icons/fi";

interface ImageManagerProps {
  existingImages: string[];
  newImages: File[];
  onChange: (
    existingImages: string[],
    newImages: File[],
    deletedImages: string[]
  ) => void;
  isEditMode?: boolean;
}

export default function ImageManager({
  existingImages = [],
  newImages = [],
  onChange,
  isEditMode = false,
}: ImageManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug current state
  useEffect(() => {}, [existingImages, newImages, deletedImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      setErrorMessage("Please select valid image files");
      return;
    }

    // Check if total images would exceed 5
    if (existingImages.length + newImages.length + validFiles.length > 5) {
      setErrorMessage("You can upload a maximum of 5 images");
      return;
    }

    setErrorMessage(""); // Clear error message

    // Add new images to the list
    const updatedNewImages = [...newImages, ...validFiles];

    // Notify parent component
    onChange(existingImages, updatedNewImages, deletedImages);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragStart = (index: number, isExisting: boolean) => {
    const globalIndex = isExisting ? index : existingImages.length + index;
    setDraggedIndex(globalIndex);
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: DragEvent,
    targetIndex: number,
    isTargetExisting: boolean
  ) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (draggedIndex === null) return;

    // Calculate global indices
    const globalTargetIndex = isTargetExisting
      ? targetIndex
      : existingImages.length + targetIndex;

    // Don't do anything if dropping on the same item
    if (draggedIndex === globalTargetIndex) {
      setDraggedIndex(null);
      return;
    }

    // Determine if we're dragging an existing or new image
    const isDraggingExistingImage = draggedIndex < existingImages.length;

    // Create copies of arrays to modify
    const newExistingImages = [...existingImages];
    const newNewImages = [...newImages];

    // Handle the different possible drag scenarios
    if (isDraggingExistingImage) {
      // We're moving an existing image
      const imageToMove = newExistingImages[draggedIndex];
      newExistingImages.splice(draggedIndex, 1);

      if (isTargetExisting) {
        // Moving to another position in existing images
        const adjustedTargetIndex =
          targetIndex > draggedIndex ? targetIndex - 1 : targetIndex;
        newExistingImages.splice(adjustedTargetIndex, 0, imageToMove);
      } else {
        // Moving from existing to end of existing (before new images)
        // For simplicity we don't allow mixing the arrays
        newExistingImages.push(imageToMove);
      }
    } else {
      // We're moving a new image
      const newImageIndex = draggedIndex - existingImages.length;
      const imageToMove = newNewImages[newImageIndex];
      newNewImages.splice(newImageIndex, 1);

      if (isTargetExisting) {
        // Moving from new to end of new (after existing)
        // For simplicity we don't allow mixing the arrays
        newNewImages.unshift(imageToMove);
      } else {
        // Target is also a new image
        const adjustedTargetIndex =
          targetIndex > newImageIndex ? targetIndex - 1 : targetIndex;
        newNewImages.splice(adjustedTargetIndex, 0, imageToMove);
      }
    }

    // Update state via parent
    onChange(newExistingImages, newNewImages, deletedImages);
    setDraggedIndex(null);
  };

  const removeExistingImage = (index: number) => {
    if (index >= existingImages.length) return;

    const imageToRemove = existingImages[index];
    const updatedExistingImages = existingImages.filter((_, i) => i !== index);

    // Add to deleted images list (for server-side deletion)
    const updatedDeletedImages = [...deletedImages, imageToRemove];
    setDeletedImages(updatedDeletedImages);

    // Update state via parent
    onChange(updatedExistingImages, newImages, updatedDeletedImages);
  };

  const removeNewImage = (index: number) => {
    if (index >= newImages.length) return;

    const updatedNewImages = newImages.filter((_, i) => i !== index);

    // Update state via parent
    onChange(existingImages, updatedNewImages, deletedImages);
  };

  const handleAddImageUrl = () => {
    if (!urlInput.trim()) {
      return;
    }

    // Simple URL validation
    let isValidUrl = false;
    try {
      new URL(urlInput);
      isValidUrl = true;
    } catch (err) {
      isValidUrl = false;
    }

    if (!isValidUrl) {
      setErrorMessage("Please enter a valid URL");
      return;
    }

    // Check if maximum images reached
    if (existingImages.length + newImages.length >= 5) {
      setErrorMessage("You can have a maximum of 5 images");
      return;
    }

    // Add the URL to existing images
    const updatedExistingImages = [...existingImages, urlInput];
    onChange(updatedExistingImages, newImages, deletedImages);

    // Reset form
    setUrlInput("");
    setErrorMessage("");
    setShowUrlInput(false);
  };

  const moveImage = (
    index: number,
    isExisting: boolean,
    direction: "left" | "right"
  ) => {
    if (isExisting) {
      // Moving an existing image
      if (existingImages.length <= 1) return;

      const updatedExistingImages = [...existingImages];

      if (direction === "left" && index > 0) {
        // Swap with previous
        [updatedExistingImages[index - 1], updatedExistingImages[index]] = [
          updatedExistingImages[index],
          updatedExistingImages[index - 1],
        ];
        onChange(updatedExistingImages, newImages, deletedImages);
      } else if (direction === "right" && index < existingImages.length - 1) {
        // Swap with next
        [updatedExistingImages[index], updatedExistingImages[index + 1]] = [
          updatedExistingImages[index + 1],
          updatedExistingImages[index],
        ];
        onChange(updatedExistingImages, newImages, deletedImages);
      }
    } else {
      // Moving a new image
      if (newImages.length <= 1) return;

      const updatedNewImages = [...newImages];

      if (direction === "left" && index > 0) {
        // Swap with previous
        [updatedNewImages[index - 1], updatedNewImages[index]] = [
          updatedNewImages[index],
          updatedNewImages[index - 1],
        ];
        onChange(existingImages, updatedNewImages, deletedImages);
      } else if (direction === "right" && index < newImages.length - 1) {
        // Swap with next
        [updatedNewImages[index], updatedNewImages[index + 1]] = [
          updatedNewImages[index + 1],
          updatedNewImages[index],
        ];
        onChange(existingImages, updatedNewImages, deletedImages);
      }
    }
  };

  const getNewImagePreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // Always ensure we have arrays, not undefined
  const safeExistingImages = existingImages || [];
  const safeNewImages = newImages || [];

  // Count total images
  const totalImages = safeExistingImages.length + safeNewImages.length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Product Images</h2>

      <div className="bg-gray-50 p-5 rounded-lg">
        <div className="mb-4 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <FiUpload className="mr-2 h-4 w-4" />
            Upload Images
          </button>

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <FiLink className="mr-2 h-4 w-4" />
            Add Image URL
          </button>

          <input
            type="file"
            id="image-upload"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>

        {errorMessage && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {showUrlInput && (
          <div className="mb-6 bg-white p-4 rounded-md shadow-sm">
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image URL
            </label>
            <div className="flex">
              <input
                type="url"
                id="imageUrl"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-pink-500 text-white rounded-r-md hover:bg-pink-600 focus:outline-none"
              >
                <FiPlus className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {deletedImages.length > 0 && isEditMode && (
          <div className="mb-6 bg-yellow-50 p-4 rounded-md border border-yellow-100">
            <div className="flex items-start">
              <FiAlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Images marked for deletion
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {deletedImages.length} image(s) will be permanently deleted
                  when you save this product.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    // Restore all deleted images
                    const restoredImages = [
                      ...safeExistingImages,
                      ...deletedImages,
                    ];
                    setDeletedImages([]);
                    onChange(restoredImages, safeNewImages, []);
                  }}
                  className="mt-2 text-xs text-yellow-800 hover:text-yellow-900 font-medium underline"
                >
                  Restore all deleted images
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image preview and reordering */}
        {totalImages > 0 ? (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              {totalImages}/5 images added (drag to reorder)
            </p>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 ${isDraggingOver ? "bg-gray-100" : ""}`}
              onDragOver={handleDragOver}
            >
              {/* Existing Images */}
              {safeExistingImages.map((imageUrl, index) => (
                <div
                  key={`existing-${index}-${imageUrl.substring(0, 10)}`}
                  draggable
                  onDragStart={() => handleDragStart(index, true)}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index, true)}
                  className={`relative group bg-white border rounded-md overflow-hidden shadow-sm 
                    ${draggedIndex === index ? "opacity-50" : ""} 
                    ${index === 0 && totalImages > 0 ? "border-pink-500" : "border-gray-200"}`}
                >
                  <div className="aspect-w-1 aspect-h-1 w-full h-32">
                    <ImagePreview
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                    />
                  </div>

                  {/* Image controls */}
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between">
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => moveImage(index, true, "left")}
                        disabled={index === 0}
                        className={`p-1 rounded-full bg-white/80 text-gray-700 hover:bg-white ${index === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <FiArrowLeft size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, true, "right")}
                        disabled={index === safeExistingImages.length - 1}
                        className={`p-1 rounded-full bg-white/80 text-gray-700 hover:bg-white ${index === safeExistingImages.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <FiArrowRight size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="p-1 rounded-full bg-white/80 text-red-500 hover:bg-white"
                    >
                      <FiTrash size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="p-1 rounded-full bg-white/80 text-red-500 hover:bg-white"
                    >
                      <FiTrash size={14} />
                    </button>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white bg-black/20 p-2 rounded-full">
                      <FiMove size={20} />
                    </div>
                  </div>

                  {index === 0 && totalImages > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-pink-500 text-white text-xs py-1 text-center">
                      Main Image
                    </div>
                  )}
                </div>
              ))}

              {/* New Images */}
              {safeNewImages.map((file, index) => (
                <div
                  key={`new-${index}-${file.name}`}
                  draggable
                  onDragStart={() => handleDragStart(index, false)}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index, false)}
                  className={`relative group bg-white border rounded-md overflow-hidden shadow-sm 
                    ${draggedIndex === safeExistingImages.length + index ? "opacity-50" : ""} 
                    ${safeExistingImages.length === 0 && index === 0 ? "border-pink-500" : "border-gray-200"}`}
                >
                  <div className="aspect-w-1 aspect-h-1 w-full h-32">
                    <ImagePreview
                      src={getNewImagePreviewUrl(file)}
                      alt={`New image ${index + 1}`}
                    />
                  </div>

                  {/* New image indicator */}
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-md">
                    New
                  </div>

                  {/* Image controls */}
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between">
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => moveImage(index, false, "left")}
                        disabled={index === 0}
                        className={`p-1 rounded-full bg-white/80 text-gray-700 hover:bg-white ${index === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <FiArrowLeft size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, false, "right")}
                        disabled={index === safeNewImages.length - 1}
                        className={`p-1 rounded-full bg-white/80 text-gray-700 hover:bg-white ${index === safeNewImages.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <FiArrowRight size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="p-1 rounded-full bg-white/80 text-red-500 hover:bg-white"
                    >
                      <FiTrash size={14} />
                    </button>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white bg-black/20 p-2 rounded-full">
                      <FiMove size={20} />
                    </div>
                  </div>

                  {safeExistingImages.length === 0 && index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-pink-500 text-white text-xs py-1 text-center">
                      Main Image
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
            <FiImage className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              No images added yet. Add up to 5 product images.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              The first image will be used as the main product image.
            </p>
          </div>
        )}

        {/* Debug information */}
        <div className="mt-6 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <p>
            Images to upload:{" "}
            {safeNewImages.length > 0
              ? safeNewImages.map((f) => f.name).join(", ")
              : "None"}
          </p>
          <p>
            Existing images:{" "}
            {safeExistingImages.length > 0
              ? safeExistingImages
                  .map((url) => url.substring(0, 20) + "...")
                  .join(", ")
              : "None"}
          </p>
          <p>
            Deleted images:{" "}
            {deletedImages.length > 0
              ? deletedImages
                  .map((url) => url.substring(0, 20) + "...")
                  .join(", ")
              : "None"}
          </p>
          <p>Total images: {totalImages}/5</p>
        </div>
      </div>
    </div>
  );
}
