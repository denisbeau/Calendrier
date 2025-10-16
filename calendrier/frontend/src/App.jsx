import React, { useState } from "react";
import Home from "./Home.jsx";
import NavBar from "./NavBar.jsx";
import MyBigCalendar from "./Calendar.jsx";

function TeamsPlaceholder() {
  return (
    <div className={`min-h-screen flex items-center justify-center '}`}>
      <h1 className="text-2xl">Teams - Coming Soon</h1>
    </div>
  );
}

function HomePlaceholder() {
  return (
    <div className={`min-h-screen flex items-center justify-center `}>
      <h1 className="text-2xl">Home - Coming Soon</h1>
    </div>
  );
}

  
function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'calendar':
        return <MyBigCalendar />;
      case 'teams':
        return <TeamsPlaceholder />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
      <div className="App">
        <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        {renderPage()}
      </div>
  );
}

export default App;
