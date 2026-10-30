import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      if (isLogin) { await login(f.email, f.password); nav('/events'); }
      else { await register(f.name, f.email, f.password); await login(f.email, f.password); nav('/events'); }
    } catch (x) { setErr(x.message); }
    setBusy(false);
  };

  return (
    <section className="narrow">
      <h2>{isLogin ? 'Log in' : 'Create your account'}</h2>
      <form onSubmit={submit}>
        {!isLogin && (<label>Full name<input value={f.name} onChange={set('name')} required minLength={2} maxLength={60} autoComplete="name" /></label>)}
        <label>Email<input type="email" value={f.email} onChange={set('email')} required autoComplete="email" /></label>
        <label>Password<input type="password" value={f.password} onChange={set('password')} required minLength={8} autoComplete={isLogin ? 'current-password' : 'new-password'} /></label>
        {err && <p className="error" role="alert">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Please wait…' : isLogin ? 'Log in' : 'Register'}</button>
      </form>
      <p className="note">
        {isLogin ? <>New here? <Link to="/register">Create an account</Link></> : <>Already registered? <Link to="/login">Log in</Link></>}
      </p>
    </section>
  );
}
