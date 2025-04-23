import React from 'react';
import styles from '@/styles/home/components/Marquee.module.css';

const Marquee: React.FC = () => {
  return (
    <div className={`${styles.marquee} border-b`}>
      <div className={styles.track}>
        <div className={styles.content}>
          {Array(30)
            .fill("Fresh-Bakes")
            .map((text, index) => (
              <span key={index}>{text} </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;