"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FiClipboard,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiHeart,
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
  FiArrowRight,
} from "react-icons/fi";
import Image from "next/image";
import { useToastMessages } from "@/components/ui/ToastProvider";

// Job listings
const jobs = [
  {
    id: 1,
    title: "Head Baker",
    department: "Production",
    location: "Sangli, Maharashtra",
    type: "Full-time",
    salary: "₹25,000 - ₹35,000 per month",
    description:
      "We are looking for an experienced Head Baker to lead our baking team. The ideal candidate should have extensive experience in baking cakes, pastries, and other confections. Responsibilities include managing the daily operations of the bakery, training staff, developing new recipes, and ensuring quality control.",
    requirements: [
      "5+ years of experience as a baker in a professional setting",
      "Strong knowledge of baking techniques and pastry making",
      "Experience in managing a team of bakers",
      "Ability to work in a fast-paced environment",
      "Strong organizational and time-management skills",
      "Food safety certification",
    ],
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Paid time off",
      "Employee discounts",
      "Career advancement opportunities",
    ],
  },
  {
    id: 2,
    title: "Cake Decorator",
    department: "Production",
    location: "Sangli, Maharashtra",
    type: "Full-time",
    salary: "₹20,000 - ₹30,000 per month",
    description:
      "We are seeking a creative and detail-oriented Cake Decorator to join our team. As a Cake Decorator, you will be responsible for designing and decorating cakes for various occasions. You will work closely with our bakers and customer service team to create beautiful, custom cakes that meet our customers' specifications.",
    requirements: [
      "2+ years of experience as a cake decorator",
      "Proficiency in various decorating techniques (fondant, buttercream, royal icing, etc.)",
      "Artistic ability and attention to detail",
      "Knowledge of color theory and design principles",
      "Ability to work under pressure and meet deadlines",
      "Portfolio of previous work",
    ],
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Paid time off",
      "Employee discounts",
      "Opportunities to showcase your creativity",
    ],
  },
  {
    id: 3,
    title: "Customer Service Representative",
    department: "Customer Service",
    location: "Sangli, Maharashtra",
    type: "Full-time",
    salary: "₹15,000 - ₹20,000 per month",
    description:
      "We are looking for a friendly and efficient Customer Service Representative to join our team. As a Customer Service Representative, you will be the first point of contact for our customers, helping them place orders, addressing inquiries, and ensuring a positive customer experience.",
    requirements: [
      "1+ years of customer service experience",
      "Excellent communication skills",
      "Proficiency in computer skills and POS systems",
      "Ability to multitask and handle pressure",
      "Friendly and positive attitude",
      "Basic knowledge of bakery products is a plus",
    ],
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Paid time off",
      "Employee discounts",
      "Flexible scheduling",
    ],
  },
];

// Application form schema
const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  position: z.string().min(1, "Please select a position"),
  experience: z.string().min(1, "Please describe your experience"),
  linkedin: z.string().optional(),
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),
  resume: z.any().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function CareerPage() {
  const [activeJobId, setActiveJobId] = useState<number | null>(1);
  const [isApplying, setIsApplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToastMessages();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      position: activeJobId ? jobs.find(job => job.id === activeJobId)?.title : "",
    }
  });

  const activeJob = jobs.find((job) => job.id === activeJobId);

  const handleApply = (jobId: number) => {
    setActiveJobId(jobId);
    setIsApplying(true);

    // Scroll to application form
    setTimeout(() => {
      document.getElementById("application-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);

    try {
      // In a real app, you would send the form data to your API
      // const formData = new FormData();
      // Object.entries(data).forEach(([key, value]) => {
      //   if (key === 'resume' && value[0]) {
      //     formData.append(key, value[0]);
      //   } else {
      //     formData.append(key, value);
      //   }
      // });
      // await axios.post('/api/job-applications', formData);

      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(
        "Application submitted successfully!",
        "We'll review your application and get back to you soon."
      );

      setIsApplying(false);
      reset();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        "Failed to submit application",
        "Please try again later or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-100 to-pink-50">
        <div className="container mx-auto pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
              Join Our Sweet Team
            </h1>
            <p className="text-xl text-gray-600">
              Passionate about baking or customer service? We're always looking for talented
              individuals to help us create and deliver delicious moments.
            </p>
          </motion.div>
        </div>
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/cake.jpeg"
            alt="Background"
            fill
            className="object-cover"
            style={{ objectPosition: 'center' }}
            priority
          />
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Current Openings</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our current job openings and find a role that matches your skills and passion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                  activeJobId === job.id ? "ring-2 ring-pink-500" : ""
                }`}
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FiClipboard className="mr-2 text-pink-500" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="mr-2 text-pink-500" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiCalendar className="mr-2 text-pink-500" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiDollarSign className="mr-2 text-pink-500" />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-3">{job.description}</p>
                  <button
                    onClick={() => handleApply(job.id)}
                    className="w-full px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors flex items-center justify-center"
                  >
                    Apply Now
                    <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {activeJob && (
        <section className="py-16 bg-gray-50" id="job-details">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{activeJob.title}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                        {activeJob.department}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {activeJob.type}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {activeJob.location}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <button
                      onClick={() => handleApply(activeJob.id)}
                      className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
                  <p className="text-gray-600 mb-6">{activeJob.description}</p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    {activeJob.requirements.map((req, index) => (
                      <li key={index} className="text-gray-600">
                        {req}
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {activeJob.benefits.map((benefit, index) => (
                      <li key={index} className="text-gray-600">
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {isApplying && (
        <section className="py-16 bg-white" id="application-form">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900">Apply for {activeJob?.title}</h2>
                <p className="mt-4 text-gray-600">
                  Please fill out the form below to apply for this position. We'll review your application and get back to you soon.
                </p>
              </div>

              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            className={`pl-10 w-full px-4 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                              errors.name ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="John Doe"
                            {...register("name")}
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            className={`pl-10 w-full px-4 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                              errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="john@example.com"
                            {...register("email")}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiPhone className="text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            className={`pl-10 w-full px-4 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                              errors.phone ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="+91 98765 43210"
                            {...register("phone")}
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                          Position Applying For *
                        </label>
                        <select
                          id="position"
                          className={`w-full px-4 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                            errors.position ? "border-red-500" : "border-gray-300"
                          }`}
                          defaultValue={activeJob?.title}
                          {...register("position")}
                        >
                          <option value="">Select a position</option>
                          {jobs.map((job) => (
                            <option key={job.id} value={job.title}>
                              {job.title}
                            </option>
                          ))}
                        </select>
                        {errors.position && (
                          <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                        Relevant Experience *
                      </label>
                      <textarea
                        id="experience"
                        rows={3}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                          errors.experience ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Briefly describe your relevant experience..."
                        {...register("experience")}
                      ></textarea>
                      {errors.experience && (
                        <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn Profile (Optional)
                      </label>
                      <input
                        type="text"
                        id="linkedin"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                        placeholder="https://linkedin.com/in/yourprofile"
                        {...register("linkedin")}
                      />
                    </div>

                    <div>
                      <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                        Cover Letter *
                      </label>
                      <textarea
                        id="coverLetter"
                        rows={5}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                          errors.coverLetter ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Tell us why you're interested in this position and why you would be a good fit..."
                        {...register("coverLetter")}
                      ></textarea>
                      {errors.coverLetter && (
                        <p className="mt-1 text-sm text-red-600">{errors.coverLetter.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                        Resume (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiFileText className="text-gray-400" />
                        </div>
                        <input
                          type="file"
                          id="resume"
                          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                          accept=".pdf,.doc,.docx"
                          {...register("resume")}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Accepted file types: PDF, DOC, DOCX. Maximum file size: 5MB.
                      </p>
                    </div>

                    <div className="flex items-center">
                      <FiHeart className="text-pink-500 mr-2" />
                      <p className="text-sm text-gray-600">
                        By submitting this application, you agree to our{" "}
                        <a href="/terms" className="text-pink-500 hover:underline">
                          Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a href="/privacy-policy" className="text-pink-500 hover:underline">
                          Privacy Policy
                        </a>
                        .
                      </p>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsApplying(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
                          isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Why Work With Us?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Join our team and be part of creating sweet moments and memories for our customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="text-3xl font-bold text-pink-500 mb-4">01</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Growth Opportunities</h3>
              <p className="text-gray-600">
                We believe in nurturing talent and providing opportunities for professional growth and advancement within our organization.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="text-3xl font-bold text-pink-500 mb-4">02</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Collaborative Environment</h3>
              <p className="text-gray-600">
                Work in a friendly, supportive team environment where creativity is valued and ideas are welcomed.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="text-3xl font-bold text-pink-500 mb-4">03</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Work-Life Balance</h3>
              <p className="text-gray-600">
                We understand the importance of balance and offer flexible scheduling options to accommodate personal needs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
