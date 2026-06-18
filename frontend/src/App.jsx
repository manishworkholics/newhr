import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<HomePage initialSection="events" />} />
        <Route path="/portfolio" element={<HomePage initialSection="portfolio" />} />
        <Route path="/sponsors" element={<HomePage initialSection="sponsors" />} />
        <Route path="/destinations" element={<HomePage initialSection="destinations" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
