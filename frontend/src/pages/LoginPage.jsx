import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { supabase } from "../lib/supabase";

function LoginPage() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      // Send login details to supabase
      const {data,error: authError} = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      console.log("Login successful:", data);



      if (authError) {

          setError(authError.message);
          return;

      }


      navigate("/home");

    } catch (error) {

      setError("An unexpected error occured. Please try again.");

    } finally {

      setLoading(false);

    }
  };


  

  return (

    <div className="login-page">

      {/* Login Card */}

      <div className="login-card">


        {/* Header */}

        <div className="login-header">

          <Link
            to="/"
            className="login-logo"
          >
            ShareSpare
          </Link>


          <h1>
            Welcome Back
          </h1>


          <p>
            Login to continue using ShareSpare.
          </p>

        </div>


        {/* Error Message*/}

        {error && (

          <div className="login-error">
            {error}
          </div>

        )}


        {/* Login Form */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >


          {/* Email */}

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>


            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

          </div>


          {/* Password */}

          <div className="form-group">

            <div className="password-row">

              <label htmlFor="password">
                Password
              </label>


              <Link to="/forgot-password">
                Forgot Password?
              </Link>

            </div>


            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />

          </div>


          {/* Login Button*/}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"
            }

          </button>

        </form>


        {/* Register */}

        <div className="register-section">

          <span>
            Don't have an account?
          </span>


          <Link to="/register">
            Create an account
          </Link>

        </div>


        {/* Back to Landing Page*/}

        <div className="back-home">

          <Link to="/">
            ← Back to ShareSpare
          </Link>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;