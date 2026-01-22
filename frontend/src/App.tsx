import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import AuthPage from './pages/AuthPage';
import MedicineDetailsPage from './pages/MedicineDetails';
import MyCabinetPage from './pages/MyCabinet';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/medicine/:id" element={<MedicineDetailsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/my-cabinet" element={<MyCabinetPage />} />
      </Routes>
    </Router>
  );
}

export default App;