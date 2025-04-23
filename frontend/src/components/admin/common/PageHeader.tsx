// components/admin/common/PageHeader.tsx
import Link from "next/link";
import { FiPlusCircle, FiAlertCircle, FiArrowLeft } from "react-icons/fi";

interface PageHeaderProps {
  title: string;
  addButtonText?: string;
  addButtonLink?: string;
  backButtonText?: string;
  backButtonLink?: string;
  useMockData?: boolean;
}

const PageHeader = ({
  title,
  addButtonText,
  addButtonLink,
  backButtonText,
  backButtonLink,
  useMockData,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        {backButtonLink && (
          <Link
            href={backButtonLink}
            className="inline-flex items-center mb-2 text-sm font-medium text-pink-600 hover:text-pink-700"
          >
            <FiArrowLeft className="mr-1 h-4 w-4" />
            {backButtonText || "Back"}
          </Link>
        )}
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {useMockData && (
          <div className="mt-1 text-sm text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md inline-flex items-center">
            <FiAlertCircle className="mr-1 h-4 w-4" />
            Using demo data - API unavailable
          </div>
        )}
      </div>
      
      {addButtonText && addButtonLink && (
        <Link
          href={addButtonLink}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          <FiPlusCircle className="mr-2 h-5 w-5" />
          {addButtonText}
        </Link>
      )}
    </div>
  );
};

export default PageHeader;