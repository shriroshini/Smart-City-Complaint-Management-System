import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Smart City Complaint Management</h1>
          <p className="hero-subtitle">
            Report city issues and help make your community better
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        </div>
        <div className="features">
          <div className="feature-card">
            <h3>Location Based Complaints</h3>
            <p>Pin exact location of issues on interactive map for precise reporting and faster resolution</p>
          </div>
          <div className="feature-card">
            <h3>Photo Evidence Upload</h3>
            <p>Upload before and after images to provide visual evidence and track improvements</p>
          </div>
          <div className="feature-card">
            <h3>Priority Complaint System</h3>
            <p>Mark urgent issues for immediate attention and prioritize critical city problems</p>
          </div>
          <div className="feature-card">
            <h3>Track Complaint Progress</h3>
            <p>Monitor complaint status in real-time and receive notifications on resolution</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Simple steps to report and resolve city issues</p>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register Account</h3>
            <p>Create your free account to start reporting issues in your community</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Submit Complaint</h3>
            <p>Describe the issue, add photos, and pin the exact location on the map</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Track Progress</h3>
            <p>Monitor your complaint status and receive updates from city officials</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Get Resolved</h3>
            <p>City authorities address your complaint and you get notified when resolved</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="statistics">
        <h2 className="section-title">Making a Difference</h2>
        <p className="section-subtitle">Our impact in numbers</p>
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Complaints Resolved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">5,000+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">50+</div>
            <div className="stat-label">Cities Covered</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">95%</div>
            <div className="stat-label">Resolution Rate</div>
          </div>
        </div>
      </section>

      {/* Complaint Categories Section */}
      <section className="categories">
        <h2 className="section-title">Complaint Categories</h2>
        <p className="section-subtitle">We handle various types of city issues</p>
        <div className="categories-grid">
          <div className="category-card">
            <h3>Roads & Infrastructure</h3>
            <p>Potholes, damaged roads, broken sidewalks</p>
          </div>
          <div className="category-card">
            <h3>Street Lighting</h3>
            <p>Broken lights, dark areas, safety concerns</p>
          </div>
          <div className="category-card">
            <h3>Waste Management</h3>
            <p>Garbage collection, illegal dumping, recycling</p>
          </div>
          <div className="category-card">
            <h3>Water Supply</h3>
            <p>Leakages, contamination, supply issues</p>
          </div>
          <div className="category-card">
            <h3>Parks & Gardens</h3>
            <p>Maintenance, safety, cleanliness</p>
          </div>
          <div className="category-card">
            <h3>Public Safety</h3>
            <p>Security concerns, hazards, emergencies</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <h2 className="section-title">Why Choose Smart City?</h2>
        <div className="benefits-container">
          <div className="benefit">
            <div className="benefit-content">
              <h3>Transparent Process</h3>
              <p>Track every step of your complaint from submission to resolution with full transparency</p>
            </div>
          </div>
          <div className="benefit">
            <div className="benefit-content">
              <h3>Quick Response</h3>
              <p>City officials are notified immediately and response times are tracked and published</p>
            </div>
          </div>
          <div className="benefit">
            <div className="benefit-content">
              <h3>Secure & Private</h3>
              <p>Your personal information is protected and never shared without consent</p>
            </div>
          </div>
          <div className="benefit">
            <div className="benefit-content">
              <h3>Mobile Friendly</h3>
              <p>Report issues on-the-go from any device with our responsive platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Make Your City Better?</h2>
        <p>Join thousands of citizens who are actively improving their communities</p>
        <div className="cta-buttons">
          <Link to="/register" className="btn-primary">Start Reporting Now</Link>
          <Link to="/login" className="btn-secondary">Sign In</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Smart City</h3>
            <p className="footer-description">
              Empowering citizens to report and resolve city issues efficiently. 
              Together, we build better communities.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">LinkedIn</a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><a href="#how-it-works">How It Works</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><a href="#">Roads & Infrastructure</a></li>
              <li><a href="#">Street Lighting</a></li>
              <li><a href="#">Waste Management</a></li>
              <li><a href="#">Water Supply</a></li>
              <li><a href="#">Public Safety</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              <li>support@smartcity.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 City Center, Smart City</li>
              <li>Mon-Fri: 9AM - 6PM</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Smart City Complaint Management System. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
