import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage.jsx";
import EventDetailPage from "./EventDetailPage.jsx";
import EventsPage from "./EventsPage.jsx";
import PortfolioPage from "./PortfolioPage.jsx";
import PortfolioDetailPage from "./PortfolioDetailPage.jsx";
import GalleryPage from "./GalleryPage.jsx";
import CitiesPage from "./CitiesPage.jsx";
import AboutPage from "./AboutPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:year" element={<PortfolioDetailPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/cities" element={<CitiesPage />} />
        <Route path="/sponsors" element={<HomePage initialSection="sponsors" />} />
        <Route path="/destinations" element={<HomePage initialSection="destinations" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
