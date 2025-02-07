import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/themes/topbar/TopBar';
import { PrivateRoutes } from './routes/routes';
import { DrawerProvider } from './DrawerContext/DrawerContext';

const App = () => {

  return (
    <DrawerProvider>
    <Router>
      <TopBar />
      <Routes>
        {PrivateRoutes.map((route) => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={route.element} 
          />
        ))}
      </Routes>
    </Router>
    </DrawerProvider>
  );
};

export default App;
