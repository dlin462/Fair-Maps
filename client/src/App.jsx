

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import MapComponent from './components/MapComponent';
import GinglesPlot from './components/GinglesPlot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map/:state" element={<MapComponent />} />
        <Route path="/gingles" component={<GinglesPlot />} />
      </Routes>
    </Router>
  );
}

export default App;
