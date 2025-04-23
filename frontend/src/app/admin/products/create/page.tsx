// src/app/admin/products/create/page.tsx

"use client";
import { useState } from "react";
import CreateProductForm from "@/components/admin/products/CreateProductForm";
import toast from "react-hot-toast";

export default function AdminPage() {
  const handleSuccess = () => {
    toast.success("Product created successfully!");
  };

  const handleError = (message: string) => {
    toast.error(message);
  };

  return (
    <CreateProductForm onSuccess={handleSuccess} onError={handleError} />
  );
}
