import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaGem,
  FaHome,
  FaEnvelope,
  FaPhone,
  FaPrint,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-700">
      {/* Social Media Section */}
      <section className="flex flex-col md:flex-row justify-center items-center gap-4 p-4 border-b">
        <div className="hidden lg:block">
          <span>Get connected with us on social networks :</span>
        </div>

        <div className="flex gap-4">
          <Link
            href="#"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            <FaFacebookF className="text-xl" />
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-pink-600 transition"
          >
            <FaInstagram className="text-xl" />
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-blue-400 transition"
          >
            <FaTwitter className="text-xl" />
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-red-600 transition"
          >
            <FaYoutube className="text-xl" />
          </Link>
        </div>
      </section>

      {/* Main Footer Content */}
      <section className="border-b px-4">
        <div className="container mx-auto px-4 pt-8 pb-4 ps-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Column */}
            <div>
              <h6 className="text-uppercase font-bold mb-4 flex items-center">
                <FaGem className="mr-3" />
                THE CAKE HEAVEN
              </h6>
              <p className="mb-4 text-gray-600">
                &quot;Experience the divine taste of our handcrafted delights at
                The Cake Heaven where every bite is a slice of paradise. Join us
                in celebrating life&apos;s sweetest moments!&quot;
              </p>
            </div>

            {/* Collections Column */}
            <div>
              <h6 className="uppercase font-bold mb-4">COLLECTIONS</h6>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/cakelist"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Same Day Cakes
                </Link>
                <Link
                  href="/cakelist"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Classic Cakes
                </Link>
                <Link
                  href="/cakelist"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Custom Cakes
                </Link>
                <Link
                  href="/cakelist"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Cup Cakes
                </Link>
                <Link
                  href="/cakelist"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Desserts
                </Link>
                <Link
                  href="/cakelist"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Flowers
                </Link>
                <Link
                  href="/cakelist"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Anniversary Cakes
                </Link>
                <Link
                  href="/cakelist"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Birthday Cakes
                </Link>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h6 className="uppercase font-bold mb-4">QUICK LINKS</h6>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Contact Us
                </Link>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  About us
                </Link>
                <Link
                  href="/PrivacyPolicy"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="/shippingpolicy"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Shipping Policy
                </Link>
                <Link
                  href="/Cancellation"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Return & Refund Policy
                </Link>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  FAQs
                </Link>
                <Link
                  href="/career"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Career
                </Link>
              </div>
            </div>

            {/* Contact Column */}
            <div>
              <h6 className="uppercase font-bold mb-4">Contact</h6>
              <div className="flex flex-col space-y-3">
                <p className="flex items-start">
                  <FaHome className="mr-3 mt-1 text-lg" />
                  Kupwad, Sangli Maharashtra
                </p>
                <p className="flex items-start">
                  <FaEnvelope className="mr-3 mt-1 text-lg" />
                  contact@thecakeheaven.com
                </p>
                <p className="flex items-start">
                  <FaPhone className="mr-3 mt-1 text-lg" />+ 01 234 567 88
                </p>
                <p className="flex items-start">
                  <FaPrint className="mr-3 mt-1 text-lg" />+ 01 234 567 89
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copyright Section */}
      <section className="text-center py-3">
        © 2024 Copyright:
        <Link
          className="font-bold ml-1 text-gray-700 hover:text-pink-500"
          href="/"
        >
          TheCakeHeaven.com
        </Link>
      </section>
    </footer>
  );
};

export default Footer;
