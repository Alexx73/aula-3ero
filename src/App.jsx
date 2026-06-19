import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Inicio from './pages/Inicio';
import Alphabet from './pages/Alphabet';
import Personal from './pages/PersonalInformation';
import Numbers from './pages/Numbers';
import Routine from './pages/Routine';


import NavBar from './components/NavBar';

const NAV_VERTICAL_SHIFT_PX = 36;

function App() {
  return (
    <HashRouter>
      <NavBar/>
      <div
        className="px-4 dark:bg-gray-800 min-h-screen dark:text-white"
        style={{
          paddingTop: `calc(6rem - ${NAV_VERTICAL_SHIFT_PX}px)`,
          '--nav-vertical-shift': `${NAV_VERTICAL_SHIFT_PX}px`,
        }}
      >
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/alphabet" element={<Alphabet />} />         
          <Route path="/number" element={<Numbers />} />
          <Route path="/personal-information" element={<Personal />} />
          <Route path="/routine" element={<Routine />} />
        </Routes>
       </div>
    </HashRouter>
  );
}

export default App;
