"use client"

import React, { useState } from 'react';
import styles from '@/styles/home/components/StoryContainer.module.css';

const StoryComponent: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [videoSrc, setVideoSrc] = useState<string>("");

  // Handle video click to show modal and set video source
  const handleVideoClick = (videoUrl: string) => {
    setVideoSrc(videoUrl);
    setShowModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setVideoSrc(""); // Clear video URL when modal is closed
  };

  const videos = [
    "https://www.youtube.com/embed/j6hv7Jcm5XQ?mute=1",
    "https://www.youtube.com/embed/j6hv7Jcm5XQ?mute=1",
    "https://www.youtube.com/embed/j6hv7Jcm5XQ?mute=1",
    "https://www.youtube.com/embed/j6hv7Jcm5XQ?mute=1",
    "https://www.youtube.com/embed/j6hv7Jcm5XQ?mute=1",
  ];

  return (
    <div className="w-full md:col-span-12 lg:col-span-12 my-4">
      <div className={styles.storyContainer}>
        {videos.map((videoUrl, index) => (
          <div
            key={index}
            className={styles.story}
            data-aos="zoom-in"
            onClick={() => handleVideoClick(videoUrl)}
          >
            <iframe 
              src={videoUrl} 
              className={styles.iframe} 
              frameBorder="0" 
              allowFullScreen
            ></iframe>
            <div className={styles.playText}>Play Now</div>
          </div>
        ))}
      </div>

      {/* Modal for playing video */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="relative w-full max-w-2xl mx-auto" role="document">
            <div className={styles.modalContent}>
              <div className={styles.modalBody}>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  &times;
                </button>
                <iframe 
                  src={videoSrc} 
                  className={styles.iframe} 
                  frameBorder="0" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryComponent;