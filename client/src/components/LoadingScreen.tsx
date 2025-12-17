import { useState, useEffect } from "react";
import { APP_LOGO, APP_TITLE } from "@/const";
import "./LoadingScreen.css";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsZooming(true); // Start zoom effect
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onComplete();
        }, 800); // Wait for zoom + fade out animation
      }, 500); // Zoom duration
    }, 3500); // Show loading for 3.5 seconds (increased)

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`loading-screen ${
        isVisible ? "loading-screen--visible" : "loading-screen--hidden"
      } ${
        isZooming ? "loading-screen--zooming" : ""
      }`}
    >
      {/* Pink zoom overlay */}
      <div className={`zoom-overlay ${
        isZooming ? "zoom-overlay--active" : ""
      }`}></div>
      
      <div className="loading-content">
        {/* Logo Animation */}
        <div className="logo-container">
          <div className="logo-bounce">
            <img
              src={APP_LOGO}
              alt={APP_TITLE}
              className="logo-image"
            />
          </div>
          
          {/* Spinning Ring */}
          <div className="spinning-ring-container">
            <div className="spinning-ring"></div>
          </div>
        </div>

        {/* Title with Dance Animation */}
        <div className="title-container">
          <h1 className="loading-title">
            {APP_TITLE}
          </h1>
          <p className="loading-subtitle">
            Espaço Cultural de Dança
          </p>
        </div>

        {/* Dancing Dots */}
        <div className="dancing-dots">
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
          <div className="dot dot-3"></div>
          <div className="dot dot-4"></div>
        </div>

        {/* Loading Text */}
        <div className="loading-text">
          <p className="loading-message">
            Preparando sua experiência de dança...
          </p>
        </div>
      </div>

      {/* Floating Dance Elements */}
      <div className="floating-elements">
        <div className="floating-dot floating-dot-1"></div>
        <div className="floating-dot floating-dot-2"></div>
        <div className="floating-dot floating-dot-3"></div>
        <div className="floating-dot floating-dot-4"></div>
      </div>
    </div>
  );
}