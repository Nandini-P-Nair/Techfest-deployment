# TechFest 2026 Portal (MERN)

React (Vite) + Express + MongoDB Atlas. Hosted on Netlify (client), Render (API), Atlas (database).

## Run locally
```
cd server
copy .env.example .env     (Mac/Linux: cp .env.example .env)   -> edit MONGO_URI and JWT_SECRET
npm install
npm run seed               # adds 6 sample events
npm start                  # http://localhost:5000/api/health

cd ../client
copy .env.example .env
npm install
npm run dev                # http://localhost:5173
```
Run tests: `cd server && npm test`

## Security built in
| Risk | Fix | File |
|---|---|---|
| NoSQL injection | express-mongo-sanitize + express-validator (type checks) | server/app.js, routes/auth.js |
| Insecure headers | helmet (CSP, HSTS, nosniff, frameguard) | server/app.js |
| XSS | React escapes text; CSP; no dangerouslySetInnerHTML | pages/Feedback.jsx, netlify.toml |
| Cookie theft | httpOnly, secure, sameSite on token cookie | routes/auth.js |
| CSRF | sameSite + custom X-Requested-With header + strict CORS | middleware/auth.js, app.js |
| Brute force | express-rate-limit on login/register | routes/auth.js |
| Password storage | bcrypt (12 rounds) | routes/auth.js |
| Secrets | .env in .gitignore, set in Render/Netlify dashboards | .gitignore |

## "Before" code for the demo (use ONLY in a test copy)
Login bypass: in routes/auth.js replace the login lookup with
```js
const user = await User.findOne({ email: req.body.email, password: req.body.password }); // vulnerable
```
and remove `validate`, `mongoSanitize()`. Send `{"email":{"$gt":""},"password":{"$gt":""}}` (Postman/curl) -> logs in without credentials.
XSS: in pages/Feedback.jsx use `<p dangerouslySetInnerHTML={{ __html: f.message }} />` and post `<img src=x onerror=alert('hi')>`.
(Browsers do not run `<script>` inserted via innerHTML, so the img/onerror payload is the reliable demo.)
After the fix, both attacks fail. Take screenshots of each.

<!-- Feature page update -->
