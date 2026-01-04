import { useState } from 'react';
import './App.css';
import MedicineCard from './components/MedicineCard/MedicineCard';

function App() {
  const [search, setSearch] = useState('')

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
            requiresPrescription={medicine.requiresPrescription}></MedicineCard>
          ))}
        </div>
      </main>
      
      <footer className="footer">
        <p>© 2026 SmartPharmacy</p>
      </footer>
    </div>
  )
}

export default App