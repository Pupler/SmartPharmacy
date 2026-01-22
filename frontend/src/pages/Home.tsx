import { useState, useEffect } from 'react';
import '../styles/Home.css';
import MedicineCard from '../components/MedicineCard/MedicineCard';

interface Medicine {
  id: number;
  name: string;
  price: number;
  stock: number;
  requiresPrescription: boolean;
  category: string;
  description: string;
}

function HomePage() {
  const [search, setSearch] = useState('')

  const [cart, setCart] = useState<Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>>(() => {
    try {
      const saved = localStorage.getItem('smartPharmacyCart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('smartPharmacyCart', JSON.stringify(cart));
  }, [cart]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme == 'dark') {
      return true;
    } else {
      return false;
    }
  });

  const toggleTheme = () => {
    document.body.classList.toggle('dark-theme');
    setIsDarkMode(isDarkMode ? false : true);
    localStorage.setItem('theme', (isDarkMode ? 'light' : 'dark'));
  }

  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5171/api/medicines')
      .then(response => response.json())
      .then(data => {
        setMedicines(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error while loading data!');
        setLoading(false);
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (localStorage.getItem('theme') == 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    } 
  }, []);

  const addToCart = (id: number, name: string, price: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === id);
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];

        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };

        return updatedCart;
      } else {
        return [...prevCart, { id, name, price, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id))
  };
  
  const clearCart = () => {
    setCart([]);
  };

  const showMedicineCabinet = () => {
    const username = localStorage.getItem('username');

    if (!username) {
      window.location.href = '/auth';
      return;
    }

    window.alert(`WELCOME ${username}`);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Smart Pharmacy</h1>

        <div className="header-controls">
          <input 
            type="text" 
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <button 
            className="cart-icon-btn"
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            🛒
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </button>

          {localStorage.getItem('username') ? (
            <div className="user-controls">
              <button
                className="medicine-cabinet-btn"
                onClick={() => {
                  window.location.href = '/my-cabinet'
                }}
              >
                👤 {localStorage.getItem('username')}
              </button>
              <button 
                className="logout-btn"
                onClick={() => {
                  localStorage.removeItem('username');
                  window.location.reload();
                }}
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <button 
              className="medicine-cabinet-btn" 
              onClick={showMedicineCabinet}
            >
              👤 Login
            </button>
          )}

          <button className='theme-toggle-btn' onClick={toggleTheme}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>
      
      <main className="main">
        
        <div className="medicine-grid">
          {filteredMedicines.map(medicine => (
            <MedicineCard key={medicine.id}
            id={medicine.id}
            name={medicine.name}
            price={medicine.price}
            stock={medicine.stock}
            requiresPrescription={medicine.requiresPrescription}
            category={medicine.category}
            description={medicine.description}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            />
          ))}
        </div>

        {isCartOpen && (
          <div className="cart-modal-overlay" onClick={() => setIsCartOpen(false)}>
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
              <div className="cart-header">
                <h3>🛒 Your Cart ({cart.length})</h3>
                <button className="close-btn" onClick={() => setIsCartOpen(false)}>×</button>
              </div>
              
              <div className="cart-items">
                {cart.length === 0 ? (
                  <p className="empty-cart">Your cart is empty</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <span>{item.name}</span>
                      <span>×{item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)}€</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                      >❌</button>
                    </div>
                  ))
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="cart-footer">
                  <div className="cart-total">
                    Total: {(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}€
                  </div>
                  <button onClick={clearCart} className="clear-btn">
                    Clear All
                  </button>
                  <button className="process-order-btn">
                    Process order
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
      
      <footer className="footer">
        <p>© 2026 SmartPharmacy</p>
      </footer>
    </div>
  )
}

export default HomePage;