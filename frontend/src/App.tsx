import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/Home';
import MedicineDetailsPage from './pages/MedicineDetails';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/medicine/:id">
          <MedicineDetailsPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;