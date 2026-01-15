import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MedicineDetails.css';

interface Medicine {
  id: number;
  name: string;
  price: number;
  stock: number;
  requiresPrescription: boolean;
  category?: string;
  description?: string;
  imageUrl?: string;
}

export default function MedicineDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setMedicine(data);
        setError('');
      })
      .catch(err => {
        setError('Failed to load medicine details');
        console.error('Error fetching medicine:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading medicine details...</p>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="error-container">
        <h2>❌ Medicine not found</h2>
        <p>{error || `Medicine with ID ${id} does not exist.`}</p>
        <Link to="/" className="back-link">
          ← Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="medicine-details-page">
      <nav className="details-nav">
        <Link to="/" className="back-button">
          ← Back to all medicines
        </Link>
      </nav>

      <div className="medicine-details-container">
        <div className="medicine-image-section">
          {medicine.imageUrl ? (
            <img 
              src={medicine.imageUrl} 
              alt={medicine.name}
              className="medicine-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop';
              }}
            />
          ) : (
            <div className="medicine-image-placeholder">
              💊
            </div>
          )}
        </div>

        <div className="medicine-info-section">
          <div className="medicine-header">
            <h1 className="medicine-title">{medicine.name}</h1>
            {medicine.requiresPrescription && (
              <div className="prescription-warning">
                ⚠️ Prescription Required
              </div>
            )}
          </div>

          <div className="medicine-price-section">
            <span className="price-label">Price:</span>
            <span className="price-value">{medicine.price.toFixed(2)} €</span>
          </div>

          <div className="stock-section">
            <span className="stock-label">Availability:</span>
            <span className={`stock-value ${medicine.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {medicine.stock > 0 ? `${medicine.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {medicine.category && (
            <div className="category-section">
              <span className="category-label">Category:</span>
              <span className="category-value">{medicine.category}</span>
            </div>
          )}

          {medicine.description && (
            <div className="description-section">
              <h3 className="description-title">Description</h3>
              <p className="description-text">{medicine.description}</p>
            </div>
          )}

          <div className="action-buttons">            
            <Link to="/" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}