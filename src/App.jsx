import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import RouteViews from './components/RouteViews';
import { AuthProvider } from './context/AuthContext'; // Importa el AuthProvider
import "./css/EstilosGenerales.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <RouteViews />
      </AuthProvider>
    </Router>
  );
}

export default App;