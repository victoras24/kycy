import React from 'react'
import Layout from "./src/components/Layout.jsx"
import Search from "./src/pages/Search"
import './index.css'
import { Routes, Route, HashRouter } from "react-router-dom"

export default function App() {
    return (
        <HashRouter >
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Search />} />
                </Route>
            </Routes>
        </HashRouter>
    )
}