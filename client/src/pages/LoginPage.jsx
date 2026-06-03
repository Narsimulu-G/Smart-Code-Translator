import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext.jsx';
import { register, emailLogin, googleLogin } from '../services/authService.js';
import '../styles/login.css';

function LoginPage() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email || !password) return toast.error("Please fill in all fields.");
    if (isSignUp && !name) return toast.error("Please enter your name.");
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");

    setLoading(true);
    try {
      let data;
      if (isSignUp) {
        data = await register(name, email, password);
        toast.success("Account registered successfully!");
      } else {
        data = await emailLogin(email, password);
        toast.success(`Welcome back, ${data.user.name}!`);
      }
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const data = await googleLogin(credentialResponse.credential);
      login(data.token, data.user);
      toast.success(`Welcome, ${data.user.name}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Google Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="brand-section">
          <div className="logo-container">
            <div className="logo-icon">T</div>
            <h1 className="brand-name">Smart Code Translator</h1>
          </div>
          <p className="brand-subtitle">
            Translate source code between languages, perform space/time complexity analysis, optimize structures, and get plain explanations instantly.
          </p>
        </div>

        <div className="features-list">
          <div className="feature-card">
            <div className="feature-icon-wrapper">⇄</div>
            <div>
              <h3 className="feature-title">Multi-Language Translator</h3>
              <p className="feature-desc">Convert algorithms between C, C++, C#, Java, and Python with idiomatic translations.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">⏱</div>
            <div>
              <h3 className="feature-title">Complexity Analysis</h3>
              <p className="feature-desc">Analyze code time and space complexity with detailed explanations and Big-O notation.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">⚡</div>
            <div>
              <h3 className="feature-title">Optimization Suggestions</h3>
              <p className="feature-desc">Refactor code for performance and readability with clean explanations of modifications.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="auth-form-card glass-card">
          <div className="form-header">
            <h2 className="form-title">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
            <p className="form-subtitle">
              {isSignUp ? "Sign up to begin translating code" : "Sign in to access your translation panel"}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  className="input-field"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  className="input-field"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary form-submit-btn">
              {loading ? "Authenticating..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="auth-divider">Or</div>

          <div className="google-auth-btn-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google sign-in failed")}
              theme="filled_dark"
              shape="rectangular"
              text="continue_with"
              width="320px"
            />
          </div>

          <div className="toggle-auth-mode">
            <span>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>
            <span className="toggle-auth-link" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
