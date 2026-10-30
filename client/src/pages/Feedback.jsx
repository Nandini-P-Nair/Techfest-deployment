import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';

export default function Feedback() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [err, setErr] = useState('');

  const load = () => api('/api/feedback').then(setList).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  const send = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await api('/api/feedback', { method: 'POST', body: { message, rating: Number(rating) } });
      setMessage('');
      load();
    } catch (x) { setErr(x.message); }
  };

  return (
    <section className="narrow">
      <h2>Feedback</h2>
      {user ? (
        <form onSubmit={send}>
          <label>Your feedback<textarea value={message} onChange={(e) => setMessage(e.target.value)} required maxLength={500} rows={3} /></label>
          <label>Rating
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          {err && <p className="error" role="alert">{err}</p>}
          <button className="btn">Post feedback</button>
        </form>
      ) : <p className="note"><Link to="/login">Log in</Link> to post feedback.</p>}

      <ul className="feed">
        {list.map((f) => (
          <li key={f._id}>
            <b>{f.name}</b> <span className="meta">{f.rating}/5</span>
            {/* SAFE: React escapes this as plain text.
                UNSAFE version (XSS demo only): <p dangerouslySetInnerHTML={{ __html: f.message }} /> */}
            <p>{f.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
