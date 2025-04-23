// components/admin/products/ProductsTable.tsx
import Link from "next/link";
import { FiEdit2, FiTrash2, FiEye, FiAlertCircle } from "react-icons/fi";
import { Product } from "@/app/admin/products/page";
import ImagePreview from "@/components/admin/products/ImagePreview";

interface ProductsTableProps {
  products: Product[];
  selectedProducts: string[];
  onToggleSelection: (productId: string) => void;
  onToggleAll: () => void;
  onDelete: (productId: string) => void;
  onToggleStatus: (productId: string, currentStatus: boolean) => void;
  statusUpdateLoading: string | null;
}

const ProductsTable = ({
  products,
  selectedProducts,
  onToggleSelection,
  onToggleAll,
  onDelete,
  onToggleStatus,
  statusUpdateLoading,
}: ProductsTableProps) => {
  // Get correct product link
  const getProductViewLink = (productId: string) =>
    `/shop/product/${productId}`;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.length === products.length &&
                      products.length > 0
                    }
                    onChange={onToggleAll}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stock
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <FiAlertCircle className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-lg font-medium text-gray-600 mb-1">
                      No products found
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Try adjusting your search or filters
                    </p>
                    <Link
                      href="/admin/products/create"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                      <FiAlertCircle className="mr-2 h-5 w-5" />
                      Add New Product
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => onToggleSelection(product._id)}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        {Array.isArray(product.images) &&
                        product.images.length > 0 ? (
                          <ImagePreview
                            src={product.images[0]}
                            alt={product.name}
                            className="rounded-md"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.flavor}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.mainCategory}
                    </div>
                    {product.subCategory && (
                      <div className="text-sm text-gray-500">
                        {product.subCategory}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.discountPrice ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          ₹{product.discountPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          ₹{product.price.toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-900">
                        ₹{product.price.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div
                      className={`text-sm ${product.stock <= 5 ? "text-red-600 font-medium" : "text-gray-900"}`}
                    >
                      {product.stock}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() =>
                        onToggleStatus(product._id, product.isActive)
                      }
                      disabled={statusUpdateLoading === product._id}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      } ${statusUpdateLoading === product._id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {statusUpdateLoading === product._id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-b-transparent border-current mr-1"></div>
                      ) : null}
                      {product.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={getProductViewLink(product._id)}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                        title="View Product"
                        target="_blank"
                      >
                        <FiEye className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                        title="Edit Product"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => onDelete(product._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                        title="Delete Product"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;
