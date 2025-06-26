import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const CouponDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCoupon = useCallback(async () => {
    try {
      const response = await axios.get(`/api/coupons/${id}`);
      setCoupon(response.data);
    } catch (error) {
      setError('Error loading coupon');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCoupon();
  }, [fetchCoupon]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await axios.delete(`/api/coupons/${id}`);
        navigate('/');
      } catch (error) {
        setError('Error deleting coupon');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading coupon...</div>;
  }

  if (error || !coupon) {
    return (
      <div className="alert alert-danger">
        {error || 'Coupon not found'}
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="form-title">Coupon Details</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/edit/${coupon._id}`} className="btn btn-secondary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#667eea', fontSize: '32px', marginBottom: '10px' }}>
              {coupon.code}
            </h3>
            <h4 style={{ fontSize: '24px', marginBottom: '10px' }}>
              {coupon.title}
            </h4>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              {coupon.description}
            </p>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '10px',
            textAlign: 'center',
            marginBottom: '15px'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {coupon.discountType === 'percentage' 
                ? `${coupon.discountValue}% OFF`
                : `$${coupon.discountValue} OFF`
              }
            </div>
          </div>
        </div>

        <div>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
            <h5 style={{ marginBottom: '15px', color: '#333' }}>Coupon Information</h5>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Valid From:</strong>
              <div>{formatDate(coupon.validFrom)}</div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Valid Until:</strong>
              <div>{formatDate(coupon.validUntil)}</div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Usage:</strong>
              <div>
                {coupon.usedCount} / {coupon.usageLimit === -1 ? 'Unlimited' : coupon.usageLimit}
              </div>
            </div>

            {coupon.category && (
              <div style={{ marginBottom: '15px' }}>
                <strong>Category:</strong>
                <div>{coupon.category}</div>
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <strong>Status:</strong>
              <div>{coupon.isActive ? 'Active' : 'Inactive'}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link to="/" className="btn btn-secondary">
          Back to Coupons
        </Link>
      </div>
    </div>
  );
};

export default CouponDetail; 