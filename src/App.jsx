// App.jsx
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import RouteViews from './components/RouteViews';

function App() {
  return (
    <Router>
      <RouteViews />
    </Router>
  );
}

export default App;