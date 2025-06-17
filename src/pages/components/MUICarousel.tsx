import { Box, Button } from '@/atoms';
import React, { useState } from 'react';
import ArrowImg from '@/assets/imgs/play.svg';

interface MUICarouselType {
  imgArr: string[];
}

const MUICarousel = ({ imgArr }: MUICarouselType) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = imgArr;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '600px',
        height: '338px',
        overflow: 'hidden',
        margin: '0 auto',
        border: '2px solid #ddd',
        borderRadius: '8px'
      }}
    >
      {/* Slides */}
      <Box
        sx={{
          display: 'flex',
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: 'transform 0.5s ease-in-out'
        }}
      >
        {slides.map((slide, index) => (
          <Box
            key={index}
            component="img"
            src={slide}
            alt={`Slide ${index + 1}`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ))}
      </Box>

      {/* Navigation Buttons */}
      <Button
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%) rotate(-180deg)',
          backgroundColor: 'transparent',
          color: 'white',
          minWidth: '30px',
          height: '30px',
          borderRadius: '50%'
        }}
      >
        <img src={ArrowImg} alt="Previous" />
      </Button>
      <Button
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%) ',
          backgroundColor: 'transparent',
          color: 'white',
          minWidth: '30px',
          height: '30px',
          borderRadius: '50%'
        }}
      >
        <img src={ArrowImg} alt="Next" />
      </Button>
    </Box>
  );
};

export default MUICarousel;
