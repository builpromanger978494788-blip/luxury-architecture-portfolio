import { useState, useEffect, useRef } from 'react';
import type { WebsiteContent } from '../types/content';

export function TestimonialSlider({ testimonial }: { testimonial: WebsiteContent['home']['testimonial'] }) {
  const t = testimonial as any;
  const items = testimonial.items && testimonial.items.length > 0 
    ? testimonial.items 
    : (t.quote ? [{ quote: t.quote, author: t.author }] : []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-slide every 2.5 seconds with ultra-smooth cubic-bezier transition, paused on mouse hover
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section className="testimonial-carousel-section" id="testimonial-section">
      <div className="container">
        <p className="testimonial-section-eyebrow">{testimonial.label || 'Client Words'}</p>

        <div 
          className="testimonial-slider-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {items.length > 1 && (
            <button 
              type="button"
              className="testimonial-nav-arrow-btn prev-btn" 
              onClick={prevSlide} 
              aria-label="Previous client testimonial"
            >
              ←
            </button>
          )}

          <div 
            className="testimonial-partition-card"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="testimonial-slider-viewport">
              <div 
                className="testimonial-slider-track"
                style={{
                  display: 'flex',
                  width: `${items.length * 100}%`,
                  transform: `translateX(-${(currentIndex * 100) / items.length}%)`,
                  transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform'
                }}
              >
                {items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="testimonial-single-slide"
                    style={{
                      width: `${100 / items.length}%`,
                      flex: `0 0 ${100 / items.length}%`,
                      boxSizing: 'border-box',
                      opacity: idx === currentIndex ? 1 : 0,
                      transition: 'opacity 0.5s ease'
                    }}
                  >
                    <blockquote className="testimonial-quote-text">
                      “{item.quote}”
                    </blockquote>
                    <p className="testimonial-author-text">
                      {item.author.startsWith('—') || item.author.startsWith('-') ? item.author : `— ${item.author}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {items.length > 1 && (
            <button 
              type="button"
              className="testimonial-nav-arrow-btn next-btn" 
              onClick={nextSlide} 
              aria-label="Next client testimonial"
            >
              →
            </button>
          )}
        </div>

        {items.length > 1 && (
          <div className="testimonial-dots-row">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`testimonial-dot-indicator ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Jump to review ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
