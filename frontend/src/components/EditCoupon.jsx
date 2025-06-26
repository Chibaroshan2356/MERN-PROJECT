import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [coupon, setCoupon] = useState(null);

  const fetchCoupon = useCallback(async () => {
    try {
      const response = await axios.get(`/api/coupons/${id}`);
      const couponData = response.data;
      
      // Format dates for datetime-local input
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      setCoupon({
        ...couponData,
        validFrom: formatDateForInput(couponData.validFrom),
        validUntil: formatDateForInput(couponData.validUntil)
      });
    } catch (error) {
      setError('Error loading coupon');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCoupon();
  }, [fetchCoupon]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCoupon({
      ...coupon,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const couponData = {
        ...coupon,
        discountValue: parseFloat(coupon.discountValue),
        minimumPurchase: coupon.minimumPurchase ? parseFloat(coupon.minimumPurchase) : 0,
        usageLimit: coupon.usageLimit ? parseInt(coupon.usageLimit) : -1
      };

      await axios.put(`/api/coupons/${id}`, couponData);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating coupon');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading coupon...</div>;
  }

  if (!coupon) {
    return <div className="alert alert-danger">Coupon not found</div>;
  }

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="form-title">Edit Coupon</h2>
      
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
            value={coupon.code}
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
            value={coupon.discountValue}
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
            value={coupon.minimumPurchase}
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
            value={coupon.validFrom}
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
            value={coupon.validUntil}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              name="isActive"
              checked={coupon.isActive}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
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

export default EditCoupon; 