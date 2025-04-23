"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

export default function AboutPage() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.2, duration: 0.5 }
    }),
  };

  // Team members
  const teamMembers = [
    {
      name: "Sophia Patel",
      role: "Founder & Head Baker",
      image: "/images/testimonial-1.jpg", // Using existing image as placeholder
      description: "Crafting cakes since 2010 with a passion for creating edible memories."
    },
    {
      name: "Raj Sharma",
      role: "Executive Chef",
      image: "/images/testimonial-2.jpg", // Using existing image as placeholder
      description: "Trained in Paris with specialization in French pastry techniques."
    },
    {
      name: "Meera Kapoor",
      role: "Cake Designer",
      image: "/images/testimonial-3.jpg", // Using existing image as placeholder
      description: "Award-winning cake artist bringing creative visions to life."
    },
    {
      name: "Arjun Singh",
      role: "Customer Experience Manager",
      image: "/images/testimonial-4.jpg", // Using existing image as placeholder
      description: "Ensures every customer leaves with a smile and satisfaction."
    }
  ];

  // Core values
  const coreValues = [
    {
      title: "Quality Ingredients",
      description: "We use only premium, fresh ingredients in all our creations."
    },
    {
      title: "Artisanal Craftsmanship",
      description: "Each cake is handcrafted with attention to detail and artistic expression."
    },
    {
      title: "Customer Satisfaction",
      description: "Your happiness is our priority - we go above and beyond to exceed expectations."
    },
    {
      title: "Innovation",
      description: "We constantly explore new flavors, designs, and techniques to surprise and delight."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-100 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Our Sweet Journey
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                The Cake Heaven was born from a passion for creating delicious moments.
                What started as a small home bakery in 2015 has now grown into a beloved
                destination for cake lovers across Sangli and beyond.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/shop"
                  className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                >
                  Explore Our Cakes
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 border border-pink-500 text-pink-500 rounded-full hover:bg-pink-50 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="relative h-80 md:h-96 overflow-hidden rounded-lg shadow-xl"
            >
              <Image
                src="/images/cake-shop.jpg"
                alt="The Cake Heaven Shop"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <div className="w-24 h-1 bg-pink-500 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              The journey of The Cake Heaven began with a simple dream - to create cakes that bring joy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="relative h-80 md:h-96 overflow-hidden rounded-lg shadow-xl"
            >
              <Image
                src="/images/about-bakery.jpg"
                alt="Baking at The Cake Heaven"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">From Passion to Profession</h3>
              <p className="text-gray-600 mb-6">
                What began as a hobby in a small home kitchen has evolved into Sangli's premier destination for celebration cakes.
                Our founder, Sophia Patel, turned her passion for baking into a thriving business by focusing on quality, creativity,
                and customer satisfaction.
              </p>
              <p className="text-gray-600 mb-6">
                In 2015, we opened our first small shop with just three cake varieties. Today, we offer over 50 flavors and designs,
                serving thousands of happy customers each year. Our journey has been sweetened by the smiles of customers who have
                made us part of their special moments.
              </p>
              <p className="text-gray-600">
                We pride ourselves on using premium ingredients, innovative designs, and maintaining the homemade touch that has
                become our signature. Each cake tells a story - both ours and yours.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission & Values</h2>
            <div className="w-24 h-1 bg-pink-500 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              At The Cake Heaven, we're driven by a simple mission: to create memorable moments through exceptional cakes.
            </p>
          </motion.div>

          <div className="mb-16">
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Our Mission</h3>
              <p className="text-gray-600 text-center max-w-3xl mx-auto">
                "To craft exceptional cakes that transform ordinary occasions into extraordinary memories, delighting customers
                with unique flavors and designs that express their individuality, while maintaining the highest standards of
                quality and customer service."
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                custom={index + 2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="text-pink-500 mb-4">
                  <FiCheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <div className="w-24 h-1 bg-pink-500 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              The talented individuals behind our delicious creations, dedicated to making your celebrations special.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                custom={index + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="bg-white rounded-lg overflow-hidden shadow-md"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-pink-500 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements & Recognition */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Achievements & Recognition</h2>
            <div className="w-24 h-1 bg-pink-500 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              We're proud of our journey and the recognition we've received along the way.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <div className="text-5xl font-bold text-pink-500 mb-4">5000+</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Happy Customers</h3>
              <p className="text-gray-600">Delighting taste buds and creating memories since 2015.</p>
            </motion.div>

            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <div className="text-5xl font-bold text-pink-500 mb-4">15+</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Awards & Honors</h3>
              <p className="text-gray-600">Recognized for excellence in taste, design, and customer service.</p>
            </motion.div>

            <motion.div
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <div className="text-5xl font-bold text-pink-500 mb-4">50+</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Unique Flavors</h3>
              <p className="text-gray-600">Constantly innovating with new and exciting flavor combinations.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Join Our Team</h2>
              <p className="text-lg text-gray-600 mb-8">
                Passionate about baking? Creative and detail-oriented? We're always looking for talented individuals
                to join our growing team. Check out our current openings or send us your resume for future opportunities.
              </p>
              <Link
                href="/career"
                className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors inline-block"
              >
                View Open Positions
              </Link>
            </motion.div>
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="relative h-80 md:h-96 overflow-hidden rounded-lg shadow-xl"
            >
              <Image
                src="/images/hiring-desk.jpg"
                alt="Join The Cake Heaven Team"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Experience Our Cakes?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Whether you're celebrating a birthday, wedding, anniversary, or just craving something sweet,
              we're here to make your day special with our delicious cakes.
            </p>
            <Link
              href="/shop"
              className="px-8 py-4 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors inline-block text-lg font-medium"
            >
              Order Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
