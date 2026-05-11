import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { toast } from 'react-toastify';
import { createComplaint, getMyComplaints } from '../utils/api';
import Navbar from '../components/Navbar';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './UserDashboard.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const UserDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [position, setPosition] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Pothole',
    priority: 'medium',
    address: ''
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await getMyComplaints();
      setComplaints(data);
    } catch (error) {
      toast.error('Failed to fetch complaints');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) {
      toast.error('Please select location on map');
      return;
    }
    if (!image) {
      toast.error('Please upload an image');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('priority', formData.priority);
    data.append('address', formData.address);
    data.append('latitude', position.lat);
    data.append('longitude', position.lng);
    data.append('beforeImage', image);

    try {
      await createComplaint(data);
      toast.success('Complaint submitted successfully!');
      setShowForm(false);
      setFormData({ title: '', description: '', category: 'Pothole', priority: 'medium', address: '' });
      setImage(null);
      setPosition(null);
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to submit complaint');
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'View Complaints' : '+ New Complaint'}
          </button>
        </div>

        {showForm ? (
          <div className="complaint-form card">
            <h2>Submit New Complaint</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Pothole">Pothole</option>
                    <option value="Garbage">Garbage</option>
                    <option value="Water Leakage">Water Leakage</option>
                    <option value="Street Light">Street Light</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Location on Map (Click to pin)</label>
                <div className="map-container">
                  <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: '300px', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker position={position} setPosition={setPosition} />
                  </MapContainer>
                </div>
                {position && (
                  <p className="location-info">
                    Selected: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                  </p>
                )}
              </div>

              <button type="submit" className="btn-primary">Submit Complaint</button>
            </form>
          </div>
        ) : (
          <div className="complaints-list">
            <h2>My Complaints</h2>
            {complaints.length === 0 ? (
              <p className="no-complaints">No complaints yet. Submit your first complaint!</p>
            ) : (
              <div className="complaints-grid">
                {complaints.map((complaint) => (
                  <div key={complaint._id} className="complaint-card card">
                    <div className="complaint-header">
                      <h3>{complaint.title}</h3>
                      <span className={`badge badge-${complaint.status}`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="complaint-category">{complaint.category}</p>
                    <p className="complaint-desc">{complaint.description}</p>
                    
                    {/* Images Section */}
                    <div className="complaint-images">
                      <div className="image-item">
                        <label>Before Image</label>
                        {complaint.beforeImage ? (
                          <img 
                            src={`${BACKEND_URL}/uploads/${complaint.beforeImage}`}
                            alt="Before"
                            className="complaint-img"
                          />
                        ) : (
                          <p className="no-image">No image</p>
                        )}
                      </div>
                      <div className="image-item">
                        <label>After Image</label>
                        {complaint.afterImage ? (
                          <img 
                            src={`${BACKEND_URL}/uploads/${complaint.afterImage}`}
                            alt="After"
                            className="complaint-img"
                          />
                        ) : (
                          <p className="no-image">Not uploaded</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="complaint-meta">
                      <span className={`badge badge-${complaint.priority}`}>
                        {complaint.priority}
                      </span>
                      <span className="complaint-date">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
