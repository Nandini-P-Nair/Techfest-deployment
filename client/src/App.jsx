import { lazy, Suspense } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import Auth from './pages/Auth.jsx';
import Feedback from './pages/Feedback.jsx';

// Lazy loading: the Gallery code and images load only when the page is opened
const Gallery = lazy(() => import('./pages/Gallery.jsx'));

export default function App() {
  const { user, logout } = useAuth();
  return (
    <>
      <header className="bar">
        <NavLink to="/" className="brand">TechFest <b>2026</b></NavLink>
        <nav>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/feedback">Feedback</NavLink>
          {user ? (
            <button className="link" onClick={logout}>Log out ({user.name.split(' ')[0]})</button>
          ) : (
            <NavLink to="/login">Log in</NavLink>
          )}
        </nav>
      </header>
      <main>
        <Suspense fallback={<p className="note">Loading…</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />
            <Route path="*" element={<p className="note">Page not found.</p>} />
          </Routes>
        </Suspense>
      </main>
      <footer>TechFest 2026 · Web Technology Laboratory project</footer>
    </>
  );
}
