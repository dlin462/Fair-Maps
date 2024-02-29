

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import MapComponent from './components/MapComponent';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map/:state" element={<MapComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
