import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateCoupon = () => {
  const [formData, setFormData] = useState({
    code: '',
    discountValue: '',
    minimumPurchase: '',
    validFrom: '',
    validUntil: '',
    usageLimit: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const couponData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minimumPurchase: formData.minimumPurchase ? parseFloat(formData.minimumPurchase) : 0,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : -1
      };

      await axios.post('/api/coupons', couponData);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="form-title">Create New Coupon</h2>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="code">Coupon Code *</label>
          <input
            type="text"
            id="code"
            name="code"
            className="form-control"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="discountValue">Discount Value *</label>
          <input
            type="number"
            id="discountValue"
            name="discountValue"
            className="form-control"
            value={formData.discountValue}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="minimumPurchase">Minimum Purchase</label>
          <input
            type="number"
            id="minimumPurchase"
            name="minimumPurchase"
            className="form-control"
            value={formData.minimumPurchase}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="validFrom">Valid From *</label>
          <input
            type="datetime-local"
            id="validFrom"
            name="validFrom"
            className="form-control"
            value={formData.validFrom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="validUntil">Valid Until *</label>
          <input
            type="datetime-local"
            id="validUntil"
            name="validUntil"
            className="form-control"
            value={formData.validUntil}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Coupon'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoupon; 