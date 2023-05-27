import React from 'react';
import './App.css';
import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Record from "./Record";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/record" element={<Record />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
