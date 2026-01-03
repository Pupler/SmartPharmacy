import { useState } from 'react'
import './App.css'

function App() {
  const [search, setSearch] = useState('')

  return (
    <div className="app">
      <header className="header">
        <h1>SmartPharmacy</h1>
        <input 
          type="text" 
          placeholder="Search medicines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>
      
      <main className="main">
        
      </main>
      
      <footer className="footer">
        <p>© 2026 SmartPharmacy</p>
      </footer>
    </div>
  )
}

export default App