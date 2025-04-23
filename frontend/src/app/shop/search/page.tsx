// src/app/shop/search/page.tsx
import { Suspense } from 'react';
import SearchResultsContent from './SearchResultsContent';
import { FiLoader } from "react-icons/fi";

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-16 px-4 text-center">
        <FiLoader className="w-8 h-8 mx-auto animate-spin text-pink-500" />
        <p className="mt-4 text-gray-600">Loading search results...</p>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}