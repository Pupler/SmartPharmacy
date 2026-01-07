import { useState } from 'react';
import './App.css';
import MedicineCard from './components/MedicineCard/MedicineCard';

function App() {
  const [search, setSearch] = useState('')

  const [cart, setCart] = useState<any[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }

  const addToCart = (id: number, name: string, price: number) => {
    setCart(prev => [...prev, { id, name, price }]);
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id))
  };
  
  const clearCart = () => {
    setCart([]);
  };

  const medicines = [
    { id: 1, name: "Paracetamol", price: 45, stock: 50, requiresPrescription: false },
    { id: 2, name: "Ibuprofen", price: 85, stock: 30, requiresPrescription: false },
    { id: 3, name: "Amoxicillin", price: 120, stock: 15, requiresPrescription: true },
    { id: 4, name: "Vitamin C", price: 55, stock: 0, requiresPrescription: false },
    { id: 5, name: "Aspirin", price: 25, stock: 80, requiresPrescription: false },
    { id: 6, name: "Codeine", price: 95, stock: 8, requiresPrescription: true }
  ];

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

          <button onClick={toggleTheme}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>
      
      <main className="main">
        
        <div className="medicine-grid">
          {medicines.map(medicine => (
            <MedicineCard key={medicine.id}
            id={medicine.id}
            name={medicine.name}
            price={medicine.price}
            stock={medicine.stock}
            requiresPrescription={medicine.requiresPrescription}
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
                      <span>{item.price}€</span>
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
                    Total: {cart.reduce((sum, item) => sum + item.price, 0)}€
                  </div>
                  <button onClick={clearCart} className="clear-btn">
                    Clear All
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

export default App