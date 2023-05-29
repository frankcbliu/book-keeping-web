import React from 'react';
import './App.css';
import Login from "./Login";
import { HashRouter, Routes, Route } from "react-router-dom";
import Main from "./Main";
function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="*" element={<Login />} />
                <Route path="/ledger" element={<Main />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
