"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQPage = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const toggleItem = (index: number) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(index)
        ? prevOpenItems.filter((item) => item !== index)
        : [...prevOpenItems, index]
    );
  };

  const faqItems: FaqItem[] = [
    {
      category: "ordering",
      question: "How can I place an order?",
      answer:
        "You can place an order through our website, by visiting our shop, or by calling our customer service. For online orders, simply browse our cake collection, select your desired cake, customize it if necessary, add it to your cart, and proceed to checkout.",
    },
    {
      category: "ordering",
      question: "How far in advance should I place my order?",
      answer:
        "For regular cakes, we recommend placing your order at least 24-48 hours in advance. For custom designs, special occasions, or large orders, we suggest ordering 3-7 days in advance. During peak seasons (holidays, wedding season), please place your orders even earlier.",
    },
    {
      category: "ordering",
      question: "Can I modify or cancel my order?",
      answer:
        "You can modify or cancel your order up to 48 hours before the scheduled delivery or pickup time. Please contact our customer service as soon as possible for any changes. Modifications might affect the price, and cancellations may be subject to our refund policy.",
    },
    {
      category: "delivery",
      question: "Do you offer delivery services?",
      answer:
        "Yes, we offer delivery services within a 15 km radius of our shop location. Delivery fees apply based on distance. We ensure that our cakes are carefully packaged and transported to maintain their quality and appearance.",
    },
    {
      category: "delivery",
      question: "What are your delivery hours?",
      answer:
        "Our standard delivery hours are from 10:00 AM to 8:00 PM, seven days a week. You can select your preferred delivery time during checkout, and we'll do our best to accommodate your request.",
    },
    {
      category: "products",
      question: "Are your cakes eggless?",
      answer:
        "We offer both egg and eggless cake options. You can specify your preference when placing an order. Our eggless cakes are made with premium ingredients to ensure they're just as delicious as our regular cakes.",
    },
    {
      category: "products",
      question: "Do you offer sugar-free or gluten-free cakes?",
      answer:
        "Yes, we offer sugar-free and gluten-free cakes upon request. These cakes are prepared with special ingredients to accommodate dietary restrictions while maintaining great taste and texture. Please note that these might require additional preparation time.",
    },
    {
      category: "products",
      question: "What flavors do you offer?",
      answer:
        "We offer a wide range of flavors including Chocolate, Vanilla, Butterscotch, Red Velvet, Pineapple, Blueberry, Fresh Fruit, and many more. We also create custom flavors for special requests.",
    },
    {
      category: "products",
      question: "Can I get a customized cake?",
      answer:
        "Absolutely! We specialize in custom cakes for all occasions. You can provide us with your ideas, theme, or reference images, and our talented cake artists will create a unique design for you. Additional charges may apply based on complexity.",
    },
    {
      category: "products",
      question: "How do I store my cake?",
      answer:
        "For best quality, consume your cake within 2-3 days of purchase. Store it in a refrigerator at 4-6°C in the original box or an airtight container. Before serving, allow the cake to come to room temperature for about 30 minutes to enhance flavor and texture.",
    },
    {
      category: "payment",
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit/debit cards, UPI, net banking, and cash on delivery for orders within specific areas. All online payments are processed through secure payment gateways to ensure your information is protected.",
    },
    {
      category: "payment",
      question: "Do you offer any discounts?",
      answer:
        "We regularly run seasonal promotions and special offers. We also have loyalty programs for returning customers and bulk order discounts. Sign up for our newsletter or follow our social media pages to stay updated on our latest offers.",
    },
    {
      category: "returns",
      question: "What is your refund policy?",
      answer:
        "If you're not satisfied with your cake due to quality issues, please contact us within 24 hours of delivery with photos. We'll evaluate your claim and offer a replacement or refund. We cannot accept returns for perishable items for food safety reasons.",
    },
    {
      category: "returns",
      question: "What happens if my cake is damaged during delivery?",
      answer:
        "If your cake arrives damaged, please take photos immediately and contact our customer service within 1 hour of delivery. We will arrange for a replacement or provide a refund, depending on your preference and our delivery schedule.",
    },
  ];

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "ordering", name: "Ordering" },
    { id: "delivery", name: "Delivery" },
    { id: "products", name: "Products" },
    { id: "payment", name: "Payment" },
    { id: "returns", name: "Returns & Refunds" },
  ];

  const filteredFaqs =
    activeCategory === "all"
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  return (
    <div className="bg-white">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our cakes, ordering process,
            delivery, and more. If you can't find what you're looking for, feel
            free to <a href="/contact" className="text-pink-500 hover:text-pink-600">contact us</a>.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="mb-8 flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                aria-expanded={openItems.includes(index)}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <span className="ml-4 flex-shrink-0 text-gray-500">
                  {openItems.includes(index) ? (
                    <FiChevronUp className="h-5 w-5" />
                  ) : (
                    <FiChevronDown className="h-5 w-5" />
                  )}
                </span>
              </button>

              <AnimatePresence>
                {openItems.includes(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-5 pt-0 border-t border-gray-200">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Additional Help Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            If you couldn't find the answer to your question, our customer
            service team is here to help. Feel free to contact us via any of the
            methods below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Call Us</h3>
              <p className="text-gray-600">+91 98765 43210</p>
              <p className="text-gray-500 text-sm mt-2">
                Mon-Fri, 9 AM - 8 PM
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Email Us</h3>
              <p className="text-gray-600">support@thecakeheaven.com</p>
              <p className="text-gray-500 text-sm mt-2">24/7 support</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
              <p className="text-gray-600">Kupwad, Sangli, Maharashtra</p>
              <p className="text-gray-500 text-sm mt-2">
                Store hours in Contact page
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;
