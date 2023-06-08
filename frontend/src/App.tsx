import React from 'react';
import './App.css';
import Login from "./Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./Main";
import { RoutePath } from "./constants";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<Login />} />
                <Route path={RoutePath.PATH_PREFIX_MAIN} element={<Main />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
