//** Footer component for the web application **//

import React from 'react';
import '../../styles/Footer.css';

//** Define and export the Footer component **//
const Footer = () => {
  return (
    <footer className="footer-container">
      
      {/* Footer content sections */}
      <div className="footer-content">
        
        {/* Support links section */}
        <div className="footer-section">
          <h4 className="footer-title">SUPPORT</h4>
          <ul className="footer-links">
            <li>
              <a href="mailto:tomer.menashe.15@gmail.com" target="_self">Contact Us</a>
            </li>
            <li>
              <a 
                href="https://moodle.runi.ac.il/2024/course/view.php?id=2402174" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Course Site
              </a>
            </li>
          </ul>
        </div>

        {/* Contributions section */}
        <div className="footer-section">
          <h4 className="footer-title">CONTRIBUTIONS</h4>
          <ul className="footer-links">
            <li>
              <a href="/llm.html" target="_self">LLM Contributions</a>
            </li>
            <li>
              <a href="/readme.html" target="_self">ReadMe</a>
            </li>
          </ul>
        </div>

        {/* Social icons section */}
        <div className="footer-social">
          <a href="mailto:tomer.menashe.15@gmail.com" target="_self">
            <img src={require('../../assets/images/email.png')} alt="Email" />
          </a>
          <a 
            href="https://www.linkedin.com/in/menashe-tomer/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={require('../../assets/images/linkedin.png')} alt="LinkedIn" />
          </a>
          <a 
            href="https://github.com/TomerMenashe" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={require('../../assets/images/github.png')} alt="GitHub" />
          </a>
        </div>
      </div>

      {/* Footer bottom section */}
      <div className="footer-bottom">
        <p>© 2024 - My Surf Shop - Israel</p>
        <ul className="footer-bottom-links">
          <li>Thank you for watching</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
