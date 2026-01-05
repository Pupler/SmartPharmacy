import { useState } from 'react';
import './App.css';
import MedicineCard from './components/MedicineCard/MedicineCard';

function App() {
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<any[]>([]);

  const handleAddToCart = (id: number, name: string, price: number) => {
    setCart(prev => [...prev, { id, name, price }]);
    console.log(`${name} was added to card`); // Test console log
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
        <input 
          type="text" 
          placeholder="Search medicines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
            onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {cart.length > 0 && (
          <div className="cart-preview">
            <h3>🛒 Cart ({cart.length} items)</h3>
            {cart.map((item, index) => (
              <div key={index}>{item.name} - {item.price}€</div>
            ))}
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