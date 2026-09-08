import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./RegisterPage.css";

function RegisterPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("Chennai");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, mobile, location },
      },
    });

    if (signupError) {
      setError(signupError.message);
    } else {
      localStorage.setItem("user_city", location);
      setMessage("Account created successfully! Check your email if confirmation is required.");
    }

    setLoading(false);
  }

  return (
    <main className="register-page">
      <section className="register-card">
        <Link to="/" className="register-logo">ShareSpare</Link>
        <h1>Create an account</h1>
        <p className="register-intro">Join your local rental community.</p>

        {message && <p className="register-message">{message}</p>}
        {error && <p className="register-error">{error}</p>}

        <form className="register-form" onSubmit={handleSignup}>
          <label htmlFor="register-name">Name</label>
          <input id="register-name" value={name} onChange={(event) => setName(event.target.value)} required />

          <label htmlFor="register-mobile">Mobile</label>
          <input id="register-mobile" type="tel" value={mobile} onChange={(event) => setMobile(event.target.value)} required />

          <label htmlFor="register-location">City / Location</label>
          <select
            id="register-location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            required
            className="register-select"
          >
            <option value="Chennai">Chennai</option>
            <option value="Madurai">Madurai</option>
            <option value="Pondicherry">Pondicherry</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Trichy">Trichy</option>
            <option value="Salem">Salem</option>
          </select>

          <label htmlFor="register-email">Email</label>
          <input id="register-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

          <label htmlFor="register-password">Password</label>
          <input id="register-password" type="password" minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} required />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;