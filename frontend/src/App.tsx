import React from 'react';
import './App.css';
import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./Main";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/ledger" element={<Main />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
