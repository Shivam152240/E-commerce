import { useState, useEffect } from 'react';
import api from '../../assets/services/api';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    link: '/',
    type: 'promo-grid',
    slot: 1
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await api.get('/banners');
      setBanners(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('link', formData.link);
    data.append('type', formData.type);
    data.append('slot', formData.slot);
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      await api.post('/banners', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Banner saved successfully!');
      setImageFile(null);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert('Error saving banner');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/banners/${id}`);
        fetchBanners();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getSlotLabel = (type, slot) => {
    if (type === 'hero') return 'Main Hero Banner';
    return `Promo Grid - Slot ${slot}`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🖼 Manage Home Banners</h2>
      </div>

      <div className="row">
        {/* Form Column */}
        <div className="col-md-5">
          <div className="card p-4 shadow-sm border-0 mb-4" style={{ borderRadius: '15px' }}>
            <h4 className="mb-4">Upload / Update Banner</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Banner Type</label>
                <select 
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value, slot: e.target.value === 'hero' ? 0 : 1})}
                >
                  <option value="promo-grid">Promo Grid (Slot 1-3)</option>
                  <option value="hero">Main Hero Banner</option>
                </select>
              </div>

              {formData.type === 'promo-grid' && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Target Slot</label>
                  <select 
                    className="form-select"
                    value={formData.slot}
                    onChange={(e) => setFormData({...formData, slot: parseInt(e.target.value)})}
                  >
                    <option value="1">Slot 1 (Left)</option>
                    <option value="2">Slot 2 (Center)</option>
                    <option value="3">Slot 3 (Right)</option>
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-bold">Large Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., UP TO 50% OFF"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Subtitle / Sub-text</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  placeholder="e.g., Best prices revealed"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Upload Local Image</label>
                <input 
                  type="file" 
                  className="form-control"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  accept="image/*"
                  required={!banners.find(b => b.type === formData.type && b.slot === formData.slot)}
                />
                <small className="text-muted">Will replace existing image in this slot.</small>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 mt-2">
                Save & Update Banner
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Current Layout Summary</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Preview</th>
                    <th>Position</th>
                    <th>Text</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4">No custom banners added yet. Defaults are active.</td></tr>
                  ) : banners.map((banner) => (
                    <tr key={banner._id}>
                      <td>
                        <img 
                          src={banner.image} 
                          alt="" 
                          style={{width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px'}} 
                        />
                      </td>
                      <td className="fw-bold">{getSlotLabel(banner.type, banner.slot)}</td>
                      <td>
                        <div style={{fontSize: '12px'}} className="fw-bold">{banner.title}</div>
                        <div style={{fontSize: '10px'}}>{banner.subtitle}</div>
                      </td>
                      <td><span className={`badge ${banner.type === 'hero' ? 'bg-primary' : 'bg-success'}`}>{banner.type}</span></td>
                      <td>
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(banner._id)}
                        >
                          Reset
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banners;
