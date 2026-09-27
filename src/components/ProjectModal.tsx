import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, ImageOff, ArrowRight, Hand } from 'lucide-react';
import type { Project } from '../types/content';
import { assetUrl } from '../lib/asset-url';
import styles from './ProjectModal.module.css';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  onInquire?: (project: Project) => void;
}

export function ProjectModal({ project, onClose, onInquire }: ProjectModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // References for touch/mouse tracking
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);
  const currentDragRef = useRef(0);

  // List of images
  const images = useMemo(() => {
    const list = project.images && project.images.length > 0
      ? project.images
      : (project.thumbnail ? [project.thumbnail] : []);
    return list;
  }, [project]);

  const hasMultipleImages = images.length > 1;

  // Preload adjacent images for instantaneous slide response
  useEffect(() => {
    if (!hasMultipleImages) return;
    const nextIdx = (currentIndex + 1) % images.length;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    
    [nextIdx, prevIdx].forEach((idx) => {
      const img = new Image();
      img.src = assetUrl(images[idx]);
    });
  }, [currentIndex, images, hasMultipleImages]);

  // Lock background scroll when modal is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage, onClose]);

  // Touch Handlers for mobile finger swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultipleImages) return;
    startXRef.current = e.touches[0].clientX;
    startYRef.current = e.touches[0].clientY;
    isHorizontalSwipeRef.current = null;
    currentDragRef.current = 0;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current === null || startYRef.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - startXRef.current;
    const deltaY = currentY - startYRef.current;

    // Detect gesture orientation on first move
    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        isHorizontalSwipeRef.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (isHorizontalSwipeRef.current) {
      // Damped translation for tactile feedback
      currentDragRef.current = deltaX;
      setDragOffset(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (!hasMultipleImages) return;
    const threshold = 40; // 40px swipe trigger
    const deltaX = currentDragRef.current;

    if (deltaX < -threshold) {
      nextImage();
    } else if (deltaX > threshold) {
      prevImage();
    }

    // Reset drag state
    setDragOffset(0);
    setIsDragging(false);
    startXRef.current = null;
    startYRef.current = null;
    isHorizontalSwipeRef.current = null;
    currentDragRef.current = 0;
  };

  // Mouse Drag Handlers for desktop trackpad/mouse users
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!hasMultipleImages) return;
    // Don't drag if clicking buttons
    if ((e.target as HTMLElement).closest('button')) return;
    startXRef.current = e.clientX;
    currentDragRef.current = 0;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startXRef.current === null || !isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    currentDragRef.current = deltaX;
    setDragOffset(deltaX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    const threshold = 40;
    const deltaX = currentDragRef.current;

    if (deltaX < -threshold) {
      nextImage();
    } else if (deltaX > threshold) {
      prevImage();
    }

    setDragOffset(0);
    setIsDragging(false);
    startXRef.current = null;
    currentDragRef.current = 0;
  };

  const categoryName = (cat: string) => {
    if (cat.toLowerCase() === 'rekhatan') return 'रेखाटने';
    return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Architecture';
  };

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        {/* Floating Close Button */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close project modal"
          title="Close (Esc)"
        >
          <X size={20} />
        </button>

        {/* LEFT COLUMN: ARCHITECTURAL SLIDER */}
        <div className={styles.sliderColumn}>
          {/* Top Bar with counter & swipe indicator */}
          <div className={styles.sliderTopBar}>
            {images.length > 0 && (
              <div className={styles.counterBadge}>
                <span>{String(currentIndex + 1).padStart(2, '0')}</span> / {String(images.length).padStart(2, '0')}
              </div>
            )}
          </div>

          {/* Main Slide Viewport */}
          <div
            className={styles.viewport}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {images.length > 0 ? (
              <div
                className={styles.imageWrapper}
                style={{
                  transform: `translateX(${dragOffset}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                <img
                  key={images[currentIndex] + '-' + currentIndex}
                  src={assetUrl(images[currentIndex])}
                  alt={`${project.title} - photo ${currentIndex + 1}`}
                  className={styles.slideImage}
                  draggable={false}
                />
              </div>
            ) : (
              <div className={styles.noImageFallback}>
                <ImageOff size={40} />
                <p>No preview photographs available</p>
              </div>
            )}

            {/* Slider Navigation Arrows (Visible if multiple images) */}
            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.prevBtn}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Previous photograph"
                  title="Previous (Left Arrow)"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.nextBtn}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Next photograph"
                  title="Next (Right Arrow)"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {hasMultipleImages && (
            <div className={styles.dotsBar}>
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Thumbnail Strip */}
          {hasMultipleImages && (
            <div className={styles.thumbnailStrip} aria-label="Project thumbnails gallery">
              {images.map((img, idx) => (
                <button
                  key={img + '-' + idx}
                  type="button"
                  className={`${styles.thumbnailBtn} ${idx === currentIndex ? styles.thumbnailBtnActive : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Select photo ${idx + 1}`}
                >
                  <img
                    src={assetUrl(img)}
                    alt=""
                    className={styles.thumbnailImg}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LUXURY EDITORIAL DETAILS */}
        <div className={styles.infoColumn}>
          <div className={styles.categoryTag}>{categoryName(project.category)}</div>
          <h2 className={styles.projectTitle}>{project.title}</h2>
          <div className={styles.divider} />

          <div className={styles.descriptionWrapper}>
            <p className={styles.descriptionText}>{project.description}</p>
          </div>

          {/* Key Specifications / Metadata */}
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <label>Discipline</label>
              <span>{categoryName(project.category)}</span>
            </div>
            <div className={styles.metaItem}>
              <label>Gallery</label>
              <span>{images.length} {images.length === 1 ? 'Photograph' : 'Photographs'}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className={styles.actionRow}>
            {onInquire ? (
              <button
                type="button"
                className={styles.inquireBtn}
                onClick={() => onInquire(project)}
              >
                <span>Enquire About Project</span>
                <ArrowRight size={16} />
              </button>
            ) : null}

            {hasMultipleImages && (
              <span className={styles.mobileSwipeHint}>
                <Hand size={14} /> Swipe photo to explore
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
