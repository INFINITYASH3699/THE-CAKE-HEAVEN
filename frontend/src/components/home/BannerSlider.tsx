"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import styles from "@/styles/home/components/BannerSlider.module.css";

interface Slide {
  src: string;
  alt: string;
}

const BannerSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const slideInterval = 5000; // Slide interval (5 seconds)
  const slidesRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const slides: Slide[] = [
    {
      src: "/images/B1.png",
      alt: "Banner 1",
    },
    {
      src: "/images/B2.png",
      alt: "Banner 2",
    },
    {
      src: "/images/B3.png",
      alt: "Banner 3",
    },
  ];

  const showSlide = (index: number): void => {
    if (slidesRef.current) {
      slidesRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
    setCurrentIndex(index);
  };

  const nextSlide = (): void => {
    showSlide((currentIndex + 1) % slides.length);
  };

  const prevSlide = (): void => {
    showSlide((currentIndex - 1 + slides.length) % slides.length);
  };

  const startAutoSlide = useCallback(() => {
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, slideInterval);
  }, [slideInterval, currentIndex]);

  const stopAutoSlide = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [startAutoSlide]);

  const handleDotClick = (index: number): void => {
    stopAutoSlide();
    showSlide(index);
    startAutoSlide();
  };

  return (
    <div className="w-full md:col-span-12 lg:col-span-12">
      <div className={styles.sliderWrapper}>
        <div className={styles.slider} ref={slidesRef}>
          {slides.map((slide, index) => (
            <div className={styles.slide} key={index}>
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className={`${styles.slideImage} object-cover`}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        <button
          className={`${styles.navArrow} ${styles.prev}`}
          onClick={() => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
          }}
        >
          &#10094;
        </button>
        <button
          className={`${styles.navArrow} ${styles.next}`}
          onClick={() => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
          }}
        >
          &#10095;
        </button>
        <div className={styles.dotContainer}>
          {slides.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${currentIndex === index ? styles.active : ""}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;
