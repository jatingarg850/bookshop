'use client';

import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-background">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="100%"
          height="100%"
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="bg" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgba(196, 161, 119, 0.6)' }} />
              <stop offset="100%" style={{ stopColor: 'rgba(106, 74, 42, 0.06)' }} />
            </linearGradient>
            <path
              id="wave"
              fill="url(#bg)"
              d="M-363.852,502.589c0,0,236.988-41.997,505.475,0s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z"
            />
          </defs>
          <g>
            <use xlinkHref="#wave" opacity="0.3">
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="translate"
                dur="8s"
                calcMode="spline"
                values="270 230; -334 180; 270 230"
                keyTimes="0; .5; 1"
                keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
                repeatCount="indefinite"
              />
            </use>
            <use xlinkHref="#wave" opacity="0.6">
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="translate"
                dur="6s"
                calcMode="spline"
                values="-270 230;243 220;-270 230"
                keyTimes="0; .6; 1"
                keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
                repeatCount="indefinite"
              />
            </use>
            <use xlinkHref="#wave" opacity="0.9">
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="translate"
                dur="4s"
                calcMode="spline"
                values="0 230;-140 200;0 230"
                keyTimes="0; .4; 1"
                keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
                repeatCount="indefinite"
              />
            </use>
          </g>
        </svg>
      </div>

      <section className="footer-content">
        <ul className="socials">
          <li>
            <a href="#" className="social-link" aria-label="Facebook">
              <FaFacebook />
            </a>
          </li>
          <li>
            <a href="#" className="social-link" aria-label="Twitter">
              <FaTwitter />
            </a>
          </li>
          <li>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </li>
          <li>
            <a href="#" className="social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
          </li>
        </ul>

        <ul className="links">
          <li>
            <a href="#" className="footer-link">
              Home
            </a>
          </li>
          <li>
            <a href="#featured" className="footer-link">
              Featured
            </a>
          </li>
          <li>
            <a href="#shop" className="footer-link">
              Shop
            </a>
          </li>
          <li>
            <a href="#newsletter" className="footer-link">
              Newsletter
            </a>
          </li>
          <li>
            <a href="#" className="footer-link">
              Contact
            </a>
          </li>
        </ul>

        <p className="legal">© 2024 BookStore. All rights reserved.</p>
      </section>
    </footer>
  );
}
