import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MedicineDetails.css';

interface Mdc {
  id: number;
  name: string;
  price: number;
  stock: number;
  requiresPrescription: boolean;
  category?: string;
  description?: string;
  imageUrl?: string;
}

export default function MdcDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [mdc, setMdc] = useState<Mdc | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5171/api/medicines/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setMdc(data);
        setErrMsg('');
      })
      .catch(err => {
        setErrMsg('Failed to load medicine details');
        console.error('Error fetching medicine:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading medicine details...</p>
      </div>
    );
  }

  if (errMsg || !mdc) {
    return (
      <div className="error-container">
        <h2>❌ Medicine not found</h2>
        <p>{errMsg || `Medicine with ID ${id} does not exist.`}</p>
        <Link to="/" className="back-link">
          ← Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mdc-details-page">
      <nav className="details-nav">
        <Link to="/" className="back-btn">
          ← Back to all medicines
        </Link>
      </nav>

      <div className="mdc-container">
        <div className="mdc-img-section">
          {mdc.imageUrl ? (
            <img 
              src={mdc.imageUrl} 
              alt={mdc.name}
              className="mdc-img"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop';
              }}
            />
          ) : (
            <div className="mdc-img-placeholder">
              💊
            </div>
          )}
        </div>

        <div className="mdc-info-section">
          <div className="mdc-header">
            <h1 className="mdc-title">{mdc.name}</h1>
            {mdc.requiresPrescription && (
              <div className="rx-warning">
                ⚠️ Prescription Required
              </div>
            )}
          </div>

          <div className="mdc-price-section">
            <span className="price-label">Price:</span>
            <span className="price-value">{mdc.price.toFixed(2)} €</span>
          </div>

          <div className="stock-section">
            <span className="stock-label">Availability:</span>
            <span className={`stock-value ${mdc.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {mdc.stock > 0 ? `${mdc.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {mdc.category && (
            <div className="cat-section">
              <span className="cat-label">Category:</span>
              <span className="cat-value">{mdc.category}</span>
            </div>
          )}

          {mdc.description && (
            <div className="desc-section">
              <h3 className="desc-title">Description</h3>
              <p className="desc-text">{mdc.description}</p>
            </div>
          )}

          <div className="action-btns">            
            <Link to="/" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}