import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Inicio from './pages/Inicio';
// import Alphabet from './pages/Alphabet';
// import Personal from './pages/PersonalInformation';
// import PersonalQuestions from './pages/PersonalQuestions';
// import Family from './pages/Family';
// import Numbers from './pages/Numbers';
import Book from './pages/Book.jsx';


import NavBar from './components/NavBar';
// import NavBar2 from './components/NavBar2';

function App() {
  return (
    <HashRouter>
      <NavBar/>
      <div className="pt-20 px-4 dark:bg-gray-800 min-h-screen dark:text-white">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/book" element={<Book />} />
          {/* <Route path="/alphabet" element={<Alphabet />} />         
           <Route path="/number" element={<Numbers />} />
          <Route path="/questions" element={<PersonalQuestions />} />
          <Route path="/family" element={<Family />} />
          
          */}
        </Routes>
       </div>
    </HashRouter>
  );
}

export default App;
