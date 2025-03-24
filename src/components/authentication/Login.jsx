import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Sparkles, Lock, User } from "lucide-react";
import ParticlesBackground from "./particebackgorund";
import styles from "./login.module.css"; // Import CSS module
import { Appa } from "../Notify/notify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleLoginMessage = (message) => {
    setLoginMessage(message);
    setTimeout(() => setLoginMessage(""), 3000); // Clears message after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      handleLoginMessage("Please enter both username and password.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("https://render-back-end-8.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("Username", username);
        localStorage.setItem("token", JSON.stringify(data.token1));
        handleLoginMessage("Login successful! Redirecting...");

        setTimeout(() => navigate("/profile"), 1500);
      } else {
        handleLoginMessage(data.message || "Invalid credentials.");
      }
    } catch (error) {
      handleLoginMessage("An error occurred while logging in.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleGuestLogin = () => {
    if (isLoading) return; // Prevent multiple clicks
  
    setIsLoading(true);
    setLoginMessage("Logged in as Guest. Redirecting..."); // Set login message
  
    localStorage.setItem("Username", "Guest");
    
    setTimeout(() => {
      navigate("/auth");
      setIsLoading(false);
    }, 1500); // Redirect after 1.5s
  };
  

  const handleRegisterRedirect = () => navigate("/register");

  return (
    <div className={styles.loginContainer}>
      <ParticlesBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.loginBox}
      >
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={styles.loginHeader}>
          <Brain className={styles.logoIcon} />
          <div>
            <h1 className={styles.title}>VedaMindAI</h1>
            <p className={styles.subtitle}>Unlock the Power of AI</p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <User className={styles.inputIcon} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.inputField}
              placeholder="Username"
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              placeholder="Password"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={styles.loginButton}
          >
            {isLoading ? <Sparkles className={styles.loadingIcon} /> : "Login"}
          </motion.button>

          <div className={styles.guestLoginContainer}>
           
            <div className={styles.loginRedirectContainer}>
              <p>
                Don't have an account?
                <span onClick={handleRegisterRedirect}> Register here</span>
              </p>
            </div>
          </div>
        </form>
        <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGuestLogin}
              className={styles.guestButton}
            >
              Continue as Guest
            </motion.button>
      </motion.div>

  
     <div style={{position:"absolute"}}>
     {loginMessage && <Appa action={loginMessage} />}
     </div>
    </div>
  );
};

export default Login;
