// components/admin/products/ProductBulkActions.tsx
import { FiTrash2, FiX } from "react-icons/fi";

interface ProductBulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onClearSelection: () => void;
  deleteLoading: boolean;
}

const ProductBulkActions = ({
  selectedCount,
  onDelete,
  onClearSelection,
  deleteLoading,
}: ProductBulkActionsProps) => {
  return (
    <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 mb-6 flex items-center justify-between">
      <span className="text-sm text-pink-800">
        {selectedCount} product{selectedCount > 1 ? "s" : ""} selected
      </span>
      <div className="flex space-x-2">
        <button
          onClick={onDelete}
          disabled={deleteLoading}
          className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleteLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-white mr-2"></div>
              Deleting...
            </>
          ) : (
            <>
              <FiTrash2 className="mr-1 h-4 w-4" />
              Delete
            </>
          )}
        </button>
        <button
          onClick={onClearSelection}
          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-pink-500"
        >
          <FiX className="mr-1 h-4 w-4" />
          Clear Selection
        </button>
      </div>
    </div>
  );
};

export default ProductBulkActions;
