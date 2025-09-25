import { useState, useEffect, useRef } from 'react';

// Import the videos directly from the public folder
import video1 from '/folder/video1.mp4';
import video2 from '/folder/video2.mp4';
import video3 from '/folder/video3.mp4';

const videos = [video1, video2, video3];

const VideoPlayer = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.src = videos[currentVideoIndex];
      videoElement.play();
    }
  }, [currentVideoIndex]);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        onEnded={handleVideoEnded}
        muted
        autoPlay
        playsInline
        className="video-player"
      />
    </div>
  );
};

export default VideoPlayer;