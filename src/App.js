import React from "react";
import Footer from "./footer";
import Header from "./header";
import Home from "./pages/home";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <main className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </main>
    </BrowserRouter>
  );
}

export default App;
