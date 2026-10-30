import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState(null);
  const [mine, setMine] = useState([]);
  const [msg, setMsg] = useState('');

  const load = () => api('/api/events').then(setEvents).catch((e) => setMsg(e.message));
  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (user) api('/api/events/registrations/mine').then(setMine).catch(() => {});
    else setMine([]);
  }, [user]);

  const join = async (id) => {
    setMsg('');
    try {
      await api(`/api/events/${id}/register`, { method: 'POST' });
      setMine((m) => [...m, id]);
      load();
      setMsg('You are registered.');
    } catch (e) { setMsg(e.message); }
  };

  if (!events) return <p className="note">{msg || 'Loading events…'}</p>;
  return (
    <section>
      <h2>Events</h2>
      {msg && <p className="note" role="status">{msg}</p>}
      {!user && <p className="note"><Link to="/login">Log in</Link> to register for events.</p>}
      <div className="grid">
        {events.map((e) => (
          <article key={e._id} className="card">
            <p className="tag">{e.category}</p>
            <h3>{e.title}</h3>
            <p>{e.description}</p>
            <p className="meta">{new Date(e.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} · {e.venue}</p>
            <p className="meta">{e.registered}/{e.capacity} registered</p>
            {mine.includes(e._id)
              ? <span className="done">Registered</span>
              : <button className="btn small" disabled={!user || e.registered >= e.capacity} onClick={() => join(e._id)}>
                  {e.registered >= e.capacity ? 'Full' : 'Register'}
                </button>}
          </article>
        ))}
        {events.length === 0 && <p className="note">No events yet. Run <code>npm run seed</code> in the server folder.</p>}
      </div>
    </section>
  );
}
