import { Link } from 'react-router-dom';

const days = [
  ['12', 'Nov', 'CodeSprint and Hack the Campus'],
  ['13', 'Nov', 'Cloud in a Day and Robo Race'],
  ['14', 'Nov', 'Open Mic Night and Futsal'],
];

export default function Home() {
  return (
    <section>
      <h1 className="hero">Three days. Six events. One portal to sign up for all of them.</h1>
      <p className="lead">Pick your events, register in a click, and tell us how it went afterwards.</p>
      <div className="cta">
        <Link className="btn" to="/events">See all events</Link>
        <Link className="btn ghost" to="/register">Create an account</Link>
      </div>
      <ul className="days">
        {days.map(([d, m, t]) => (
          <li key={d}>
            <span className="date"><b>{d}</b>{m}</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
