'use client';

import { useEffect, useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

export default function Home() {
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const [visibleImages, setVisibleImages] = useState(1);
  const [parallaxTransform, setParallaxTransform] = useState('');
  const [wrapperWidth, setWrapperWidth] = useState(360);

  const heroImages = [
    '/pexels-photo-45717.webp',
    '/glasses-resting-on-stack-of-teal-books-with-mug-in-soft-natural-light-free-photo.jpeg',
    '/gettyimages-1455958786-612x612.jpg',
    '/download.jpeg',
  ];

  useEffect(() => {
    // Remove unresolved state for initial fade
    window.addEventListener('load', () => {
      document.body.removeAttribute('unresolved');
    });

    // Parallax scroll effect for hero section
    const handleScroll = () => {
      if (!heroWrapperRef.current) return;

      const heroSection = document.querySelector('.section_hero') as HTMLElement;
      if (!heroSection) return;

      const heroRect = heroSection.getBoundingClientRect();
      const heroHeight = heroRect.height;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress: 0 when hero is at bottom of viewport, 1 when hero is at top
      const scrollProgress = Math.max(0, Math.min(1, (windowHeight - heroRect.top) / (windowHeight + heroHeight)));

      // Calculate number of visible images: 1 -> 2 -> 3 -> 4 gradually
      // At 0% scroll: 1 image
      // At 33% scroll: 2 images
      // At 66% scroll: 3 images
      // At 100% scroll: 4 images
      let imageCount = 1;
      if (scrollProgress > 0.25) imageCount = 2;
      if (scrollProgress > 0.5) imageCount = 3;
      if (scrollProgress > 0.75) imageCount = 4;
      
      setVisibleImages(imageCount);

      // Calculate width based on number of images
      // 1 image: 360px, 2 images: 500px, 3 images: 700px, 4 images: 900px
      const widthMap = [360, 500, 700, 900];
      const newWidth = widthMap[imageCount - 1];
      setWrapperWidth(newWidth);

      // Calculate parallax transform
      const translateY = scrollProgress * 40;
      const scale = 0.73 + scrollProgress * 0.27;
      const rotate = scrollProgress * -5.37;

      setParallaxTransform(
        `translate3d(0px, ${translateY}px, 0px) rotate(${rotate}deg) scale(${scale}, ${scale})`
      );
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Scroll reveal for elements with .reveal-on-scroll
    const revealEls = document.querySelectorAll('.reveal-on-scroll');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        },
        {
          threshold: 0.15,
        }
      );

      revealEls.forEach((el) => observer.observe(el));
    } else {
      // Fallback: make all visible
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }
  }, []);

  useEffect(() => {
    // Scroll animation for book cards
    const bookCards = document.querySelectorAll('.book-card');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('card-visible');
              }, index * 100);
            }
          });
        },
        {
          threshold: 0.2,
        }
      );

      bookCards.forEach((card) => observer.observe(card));
    } else {
      bookCards.forEach((card) => card.classList.add('card-visible'));
    }
  }, []);

  useEffect(() => {
    // Scroll animation for section headings
    const headings = document.querySelectorAll('.section h2');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('heading-visible');
            }
          });
        },
        {
          threshold: 0.3,
        }
      );

      headings.forEach((heading) => observer.observe(heading));
    } else {
      headings.forEach((heading) => heading.classList.add('heading-visible'));
    }
  }, []);

  return (
    <>
      <div className="body" data-page="home">
        <Navbar />
        <div className="page_wrapper">
        {/* HERO */}
        <header className="section_hero">
          <div className="hero_inner">
            <div className="hero_left">
              <div className="hero_kicker">BESTSELLING AUTHOR · STORYTELLER</div>
              <h1 className="hero_title">
                Discover<br />
                Your Next<br />
                Great Read
              </h1>
              <p className="hero_subtitle">
                Explore curated collections of bestselling books across all genres. Find your next favorite story today.
              </p>
              <div className="hero_cta-row">
                <a href="#shop" className="btn btn-dark">
                  Shop Now
                </a>
                <a href="#featured" className="btn btn-ghost">
                  Featured Books
                </a>
              </div>
            </div>

            <div className="hero_right">
              <div
                ref={heroWrapperRef}
                className="hero_image-wrap"
                style={{ 
                  transform: parallaxTransform,
                  width: `${wrapperWidth}px`,
                  transition: 'width 0.4s ease-out',
                  maxWidth: '100%'
                }}
              >
                <div className="swiper-wrapper" style={{ gridTemplateColumns: `repeat(${visibleImages}, 1fr)` }}>
                  {heroImages.slice(0, visibleImages).map((image, index) => (
                    <div
                      key={index}
                      className="swiper-slide"
                    >
                      <img
                        src={image}
                        alt={`Featured Book ${index + 1}`}
                        className="hero_image"
                      />
                    </div>
                  ))}
                </div>
                <div className="hero_badge">
                  <div className="badge-circle"></div>
                  <div className="badge-text">BESTSELLER</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="hero_scroll-indicator">
            <span>Scroll</span>
            <span className="scroll_bar"></span>
          </div>
        </header>

        {/* Featured Books Section */}
        <section id="featured" className="section section-light reveal-on-scroll section-with-students">
          
          <div className="container">
            <h2>Featured Books</h2>
            <div className="books-grid">
              <div className="book-card">
                <img src="/pexels-photo-45717.webp" alt="Book 1" />
                <h3>The Art of Reading</h3>
                <p className="author">By Jane Smith</p>
                <p className="price">$24.99</p>
                <button className="btn btn-dark">Add to Cart</button>
              </div>
              <div className="book-card">
                <img src="/glasses-resting-on-stack-of-teal-books-with-mug-in-soft-natural-light-free-photo.jpeg" alt="Book 2" />
                <h3>Journey Through Time</h3>
                <p className="author">By John Doe</p>
                <p className="price">$22.99</p>
                <button className="btn btn-dark">Add to Cart</button>
              </div>
              <div className="book-card">
                <img src="/gettyimages-1455958786-612x612.jpg" alt="Book 3" />
                <h3>Whispers of Tomorrow</h3>
                <p className="author">By Sarah Johnson</p>
                <p className="price">$26.99</p>
                <button className="btn btn-dark">Add to Cart</button>
              </div>
              <div className="book-card">
                <img src="/download.jpeg" alt="Book 4" />
                <h3>Echoes of the Past</h3>
                <p className="author">By Michael Chen</p>
                <p className="price">$23.99</p>
                <button className="btn btn-dark">Add to Cart</button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section id="newsletter" className="section section-dark reveal-on-scroll">
          <div className="container">
            <h2>Join Our Newsletter</h2>
            <p>Get exclusive book recommendations and special offers delivered to your inbox.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="btn btn-dark">Subscribe</button>
            </form>
          </div>
        </section>

        {/* Categories Section */}
        <section id="shop" className="section section-light reveal-on-scroll section-with-students">
         
          <div className="container">
            <h2>Shop by Category</h2>
            <div className="categories-grid">
              <div className="category-card">
                <h3>Fiction</h3>
                <p>Explore captivating stories and novels</p>
              </div>
              <div className="category-card">
                <h3>Non-Fiction</h3>
                <p>Learn from real-world experiences</p>
              </div>
              <div className="category-card">
                <h3>Mystery</h3>
                <p>Unravel thrilling mysteries</p>
              </div>
              <div className="category-card">
                <h3>Self-Help</h3>
                <p>Improve yourself and your life</p>
              </div>
            </div>
          </div>
        </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
