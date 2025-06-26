import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get('/api/coupons');
      setCoupons(response.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    try {
      // First, try to find an exact code match
      const allCoupons = await axios.get('/api/coupons');
      const exactMatch = allCoupons.data.find(c => c.code.toLowerCase() === searchQuery.trim().toLowerCase());
      let related = [];
      if (exactMatch) {
        // Find related coupons (partial matches, but not the exact one)
        related = allCoupons.data.filter(c =>
          c.code.toLowerCase().includes(searchQuery.trim().toLowerCase()) &&
          c.code.toLowerCase() !== searchQuery.trim().toLowerCase()
        );
        setSearchResults([exactMatch, ...related]);
      } else {
        // Fallback to backend search for partial matches
        const response = await axios.get(`/api/coupons/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Error searching coupons:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await axios.delete(`/api/coupons/${id}`);
        setCoupons(coupons.filter(coupon => coupon._id !== id));
        setSearchResults(searchResults.filter(coupon => coupon._id !== id));
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  const getStatusBadge = (coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);
    
    if (!coupon.isActive) {
      return <span className="coupon-status status-expired">Inactive</span>;
    }
    
    if (now < validFrom) {
      return <span className="coupon-status status-expired">Not Started</span>;
    }
    
    if (now > validUntil) {
      return <span className="coupon-status status-expired">Expired</span>;
    }
    
    if (coupon.usageLimit !== -1 && coupon.usedCount >= coupon.usageLimit) {
      return <span className="coupon-status status-expired">Limit Reached</span>;
    }
    
    return <span className="coupon-status status-active">Active</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const displayCoupons = isSearching ? searchResults : coupons;

  if (loading) {
    return <div className="loading">Loading coupons...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div className="search-container">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '500px' }}>
            <input
              type="text"
              placeholder="Search coupons by code..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            {searchResults.length > 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            )}
          </form>
        </div>
        <Link to="/create" className="btn btn-primary">
          Create New Coupon
        </Link>
      </div>

      {displayCoupons.length === 0 ? (
        <div className="empty-state">
          <h3>No coupons found</h3>
          <p>
            {isSearching 
              ? 'No coupons match your search criteria.'
              : 'You haven\'t created any coupons yet.'
            }
          </p>
          {!isSearching && (
            <Link to="/create" className="btn btn-primary">
              Create Your First Coupon
            </Link>
          )}
        </div>
      ) : (
        <div className="grid">
          {searchResults.length > 0 && searchQuery.trim() ? (
            <>
              {/* Exact match first, then related */}
              {searchResults.map((coupon, idx) => (
                <div key={coupon._id} className="coupon-card" style={idx === 0 ? { border: '2.5px solid #2196f3', boxShadow: '0 0 0 4px #2196f355' } : {}}>
                  <div className="coupon-code">{coupon.code}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                    <div>Valid: {formatDate(coupon.validFrom)} - {formatDate(coupon.validUntil)}</div>
                  </div>
                  <div className="coupon-actions">
                    <Link to={`/coupon/${coupon._id}`} className="btn btn-primary btn-sm">
                      View
                    </Link>
                  </div>
                  {idx === 0 && searchResults.length > 1 && (
                    <div style={{ color: '#bfa700', fontWeight: 600, marginTop: 8, fontSize: '0.98rem' }}>
                      Related coupons:
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            displayCoupons.map((coupon) => (
              <div key={coupon._id} className="coupon-card">
                <div className="coupon-code">{coupon.code}</div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                  <div>Valid: {formatDate(coupon.validFrom)} - {formatDate(coupon.validUntil)}</div>
                </div>
                <div className="coupon-actions">
                  <Link to={`/coupon/${coupon._id}`} className="btn btn-primary btn-sm">
                    View
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home; 