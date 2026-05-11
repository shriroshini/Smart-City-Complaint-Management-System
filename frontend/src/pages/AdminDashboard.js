import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { toast } from 'react-toastify';
import { getAllComplaints, updateComplaintStatus, uploadAfterImage, getAnalytics } from '../utils/api';
import Navbar from '../components/Navbar';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './AdminDashboard.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    fetchComplaints();
    fetchAnalytics();
  }, [filter]);

  const fetchComplaints = async () => {
    try {
      const { data } = await getAllComplaints(filter);
      setComplaints(data);
    } catch (error) {
      toast.error('Failed to fetch complaints');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data } = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      toast.error('Failed to fetch analytics');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateComplaintStatus(id, status);
      toast.success('Status updated successfully');
      fetchComplaints();
      fetchAnalytics();
      if (selectedComplaint && (selectedComplaint._id === id || selectedComplaint.id === id)) {
        setSelectedComplaint({ ...selectedComplaint, status });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAfterImageUpload = async (id, file) => {
    const formData = new FormData();
    formData.append('afterImage', file);
    try {
      const { data } = await uploadAfterImage(id, formData);
      toast.success('After image uploaded successfully');
      fetchComplaints();
      if (selectedComplaint && (selectedComplaint._id === id || selectedComplaint.id === id)) {
        setSelectedComplaint({ ...selectedComplaint, afterImage: data.afterImage });
      }
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  return (
    <div className="admin-dashboard">
      <Navbar />
      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>

        {/* Analytics Section */}
        {analytics && (
          <div className="analytics-section">
            <h2 className="section-title">Overview</h2>
            <div className="stats-grid">
              <div className="stat-card total">
                <div className="stat-info">
                  <h3>Total Complaints</h3>
                  <p className="stat-number">{analytics.total}</p>
                </div>
              </div>
              <div className="stat-card pending">
                <div className="stat-info">
                  <h3>Pending</h3>
                  <p className="stat-number">{analytics.pending}</p>
                </div>
              </div>
              <div className="stat-card in-progress">
                <div className="stat-info">
                  <h3>In Progress</h3>
                  <p className="stat-number">{analytics.inProgress}</p>
                </div>
              </div>
              <div className="stat-card resolved">
                <div className="stat-info">
                  <h3>Resolved</h3>
                  <p className="stat-number">{analytics.resolved}</p>
                </div>
              </div>
              <div className="stat-card high-priority">
                <div className="stat-info">
                  <h3>High Priority</h3>
                  <p className="stat-number">{analytics.highPriority}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="filters-section">
          <h2 className="section-title">Filter Complaints</h2>
          <div className="filters-row">
            <div className="filter-group">
              <label>Status</label>
              <select 
                value={filter.status} 
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Priority</label>
              <select 
                value={filter.priority} 
                onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                Table View
              </button>
              <button 
                className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
              >
                Map View
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Section */}
        <div className="complaints-section">
          <h2 className="section-title">All Complaints ({complaints.length})</h2>
          
          {viewMode === 'table' ? (
            <div className="complaints-table-container">
              <table className="complaints-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Before Image</th>
                    <th>After Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="no-data">No complaints found</td>
                    </tr>
                  ) : (
                    complaints.map((complaint) => (
                      <tr key={complaint._id || complaint.id}>
                        <td className="title-cell">{complaint.title}</td>
                        <td className="description-cell">{complaint.description}</td>
                        <td>{complaint.category}</td>
                        <td>
                          <span className={`priority-badge priority-${complaint.priority}`}>
                            {complaint.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${complaint.status}`}>
                            {complaint.status}
                          </span>
                        </td>
                        <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                        <td>
                          {complaint.beforeImage ? (
                            <img 
                              src={`${BACKEND_URL}/uploads/${complaint.beforeImage}`}
                              alt="Before"
                              className="table-image"
                            />
                          ) : (
                            <span className="no-image-text">No image</span>
                          )}
                        </td>
                        <td>
                          {complaint.afterImage ? (
                            <img 
                              src={`${BACKEND_URL}/uploads/${complaint.afterImage}`}
                              alt="After"
                              className="table-image"
                            />
                          ) : (
                            <span className="no-image-text">Not uploaded</span>
                          )}
                        </td>
                        <td>
                          <button 
                            className="view-btn"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
          <div className="map-view-container">
              {(() => {
                const first = complaints.find(c => (c.location?.latitude ?? c.latitude) && (c.location?.longitude ?? c.longitude));
                const center = first
                  ? [first.location?.latitude ?? first.latitude, first.location?.longitude ?? first.longitude]
                  : [20.5937, 78.9629]; // fallback: center of India
                return (
                  <MapContainer
                    center={center}
                    zoom={first ? 13 : 5}
                    style={{ height: '500px', width: '100%' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {complaints.map((complaint) => {
                      const lat = complaint.location?.latitude ?? complaint.latitude;
                      const lng = complaint.location?.longitude ?? complaint.longitude;
                      if (!lat || !lng) return null;
                      return (
                        <Marker
                          key={complaint._id || complaint.id}
                          position={[lat, lng]}
                        >
                          <Popup>
                            <div className="map-popup">
                              <h4>{complaint.title}</h4>
                              <p><strong>Category:</strong> {complaint.category}</p>
                              <p><strong>Status:</strong> {complaint.status}</p>
                              <p><strong>Priority:</strong> {complaint.priority}</p>
                              {complaint.location?.address && (
                                <p><strong>Address:</strong> {complaint.location.address}</p>
                              )}
                              <button
                                className="popup-view-btn"
                                onClick={() => setSelectedComplaint(complaint)}
                              >
                                View Details
                              </button>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                );
              })()}
            </div>
          )}
        </div>

        {/* Complaint Detail Modal */}
        {selectedComplaint && (
          <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedComplaint(null)}>×</button>
              <h2>{selectedComplaint.title}</h2>
              
              <div className="modal-body">
                <div className="modal-info-grid">
                  <div className="info-item">
                    <label>Category</label>
                    <p>{selectedComplaint.category}</p>
                  </div>
                  <div className="info-item">
                    <label>Priority</label>
                    <p className={`priority-badge priority-${selectedComplaint.priority}`}>
                      {selectedComplaint.priority}
                    </p>
                  </div>
                  <div className="info-item">
                    <label>Status</label>
                    <p className={`status-badge status-${selectedComplaint.status}`}>
                      {selectedComplaint.status}
                    </p>
                  </div>
                  <div className="info-item">
                    <label>Date Submitted</label>
                    <p>{new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="info-item full-width">
                  <label>Description</label>
                  <p className="description-text">{selectedComplaint.description}</p>
                </div>

                <div className="info-item full-width">
                  <label>Address</label>
                  <p>{selectedComplaint.location?.address || selectedComplaint.address || 'Not provided'}</p>
                </div>

                <div className="info-item full-width">
                  <label>Submitted By</label>
                  <p>
                    {selectedComplaint.userId?.name || 'Unknown'}
                    {selectedComplaint.userId?.email ? ` (${selectedComplaint.userId.email})` : ''}
                  </p>
                </div>

                {/* Images Section */}
                <div className="images-section">
                  <div className="image-container">
                    <label>Before Image</label>
                    {selectedComplaint.beforeImage ? (
                      <img 
                        src={`${BACKEND_URL}/uploads/${selectedComplaint.beforeImage}`}
                        alt="Before"
                        className="complaint-image"
                      />
                    ) : (
                      <p className="no-image">No image available</p>
                    )}
                  </div>
                  <div className="image-container">
                    <label>After Image</label>
                    {selectedComplaint.afterImage ? (
                      <img 
                        src={`${BACKEND_URL}/uploads/${selectedComplaint.afterImage}`}
                        alt="After"
                        className="complaint-image"
                      />
                    ) : (
                      <div className="upload-container">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAfterImageUpload(selectedComplaint._id || selectedComplaint.id, e.target.files[0])}
                          id="after-image-upload"
                          className="file-input"
                        />
                        <label htmlFor="after-image-upload" className="upload-label">
                          Click to upload after image
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Section */}
                <div className="modal-actions">
                  <div className="action-group">
                    <label>Update Status</label>
                    <select
                      value={selectedComplaint.status}
                      onChange={(e) => handleStatusUpdate(selectedComplaint._id || selectedComplaint.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
