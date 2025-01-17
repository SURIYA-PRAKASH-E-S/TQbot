import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  // Show/hide scroll-to-top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Scroll-to-Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="btn btn-primary rounded-circle position-fixed top-10 end-2 shadow-lg"
          style={{ zIndex: 1000, width: '50px', height: '50px' }}
          aria-label="Scroll to top"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}

      {/* Footer Section */}
      <footer className="bg-dark text-light py-5">
        <div className="container">
          <div className="row">
            {/* Contact Section */}
            <div className="col-md-4 mb-3 text-center text-md-start">
              <h5 className="text-uppercase fw-bold mb-3">Contact Us</h5>
              <p>
                <i className="fas fa-envelope me-2 text-primary"></i>
                <a href="mailto:support@goodwills.com" className="text-decoration-none text-light">
                  support@goodwills.com
                </a>
              </p>
              <p>
                <i className="fas fa-phone me-2 text-primary"></i>
                <a href="tel:+1234567890" className="text-decoration-none text-light">
                  +123-456-7890
                </a>
              </p>
            </div>

            {/* Social Media Section */}
            <div className="col-md-4 mb-3 text-center">
              <h5 className="text-uppercase fw-bold mb-3">Follow Us</h5>
              <div className="d-flex justify-content-center gap-4">
                <a href="#" className="text-light fs-4">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="text-light fs-4">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-light fs-4">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-light fs-4">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>

            {/* Developed By Section */}
            <div className="col-md-4 mb-3 text-center text-md-end">
              <h5 className="text-uppercase fw-bold mb-3">Developed By</h5>
              <p className="mb-0">
                <span className="text-success fw-bold">Goodwills</span>
              </p>
              <p className="mt-2 text-muted">
                &copy; {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </div>

          <hr className="text-muted" />

          {/* Bottom Text */}
          <div className="text-center mt-3">
            <p className="mb-0">
              Made with <i className="fas fa-heart text-danger"></i> by Goodwills Team
            </p>
          </div>
        </div>

        
      </footer>
    </div>
  );
};

export default Footer;
