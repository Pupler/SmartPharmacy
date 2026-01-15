import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import MedicineDetailsPage from './pages/MedicineDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/medicine/:id" element={<MedicineDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;