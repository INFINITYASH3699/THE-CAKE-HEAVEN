import React from "react";
import { FaTruck, FaCakeCandles, FaCertificate } from "react-icons/fa6";

const UserSatisfaction: React.FC = () => {
  return (
    <div className="w-full py-6 mt-5 bg-pink-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-evenly items-center gap-2 md:gap-6">
          <div className="flex items-center">
            <FaTruck className="mr-1 md:mr-2 text-xl sm:text-5xl text-gray-800" />
            <h6 className="text-xs sm:text-lg md:text-3xl font-semibold text-gray-800">
              100% On Time Delivery
            </h6>
          </div>

          <div className="flex items-center">
            <FaCakeCandles className="mr-1 md:mr-2 text-xl sm:text-5xl text-gray-800" />
            <h6 className="text-xs sm:text-lg md:text-3xl font-semibold text-gray-800">
              100% Fresh And Hygienic
            </h6>
          </div>

          <div className="flex items-center">
            <FaCertificate className="mr-1 md:mr-2 text-xl sm:text-5xl text-gray-800" />
            <h6 className="text-xs sm:text-lg md:text-3xl font-semibold text-gray-800">
              FSSAI Certified
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSatisfaction;