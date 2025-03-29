import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlay, faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion
import { Brain } from "lucide-react";
import ParticlesBackground from "./particebackgorund";
import styles from "./Login.module.css";
import { Appa } from "../Notify/notify";

// Dark Theme Configuration
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#ffffff", secondary: "#b0bec5" },
  },
});

export default function SignupPage() {
  const navigate = useNavigate();
  const baseUrl = "https://render-back-end-8.onrender.com";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [otpRequested, setOtpRequested] = useState(null);
  const [signupmessage, setsignupmessage] = useState(false);

  // Form Validation
  const validateInputs = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

    if (!username.trim()) newErrors.username = "Username is required.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    else if (!passwordRegex.test(password))
      newErrors.password = "Password must include an uppercase letter and a special symbol.";
    if (otpRequested && !otp) newErrors.otp = "OTP is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Signup Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
  
    try {
      const res = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
  
      if (data.message === "resgistered successfully") {
        setsignupmessage("You have registered successfully!");
        
        // Reset input fields after successful signup
        setUsername("");
        setPassword("");
        setOtp("");
        setErrors({});
        setOtpRequested(null);
  
        setTimeout(() => navigate("/"), 3000);
      } else {
        setsignupmessage("Username already taken");
      }
    } catch (error) {
      setsignupmessage("An error occurred while registering.");
    }
  };
  
  // OTP Request
  const handleOtpClick = async () => {
    if (!username.trim()) {
      setErrors({ username: "Username is required to get OTP." });
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/getotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();

      if (!res.ok) {
        setOtpRequested(data.message || "Failed to send OTP");
        return;
      }

      setOtp(data.otp);
      setOtpRequested("Otp Sent");
    } catch (error) {
      setOtpRequested(error);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "background.default",
          color: "text.primary",
        }}
      >
        <ParticlesBackground />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              width: "350px",
              p: 3,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: "background.paper",
              textAlign: "center",      
            }}
          >
            {/* Animated Logo */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              
            >
              <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "2.5rem", color: "white !important" ,display :"flex",justifyContent:"center",alignItems:"center",gap:"5%"}}>
                <Brain style={{ color: "#C71585" }} className={styles.logoIcon} />
                VedaMindAI
              </Typography>
            </motion.div>

            <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: "10px" }}>
              Create new account
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={!!errors.username}
                    helperText={errors.username}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                </Grid>

                
                {otpRequested && otpRequested === "Otp Sent" && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      error={!!errors.otp}
                      helperText={errors.otp}
                      sx={{ input: { color: "white" } }}
                    />
                  </Grid>
                )}

{!otpRequested?.includes("Otp Sent") && (
  <Grid item xs={12}>
    <motion.div whileHover={{ scale: 1.05 }}>
      <Button fullWidth variant="contained" onClick={handleOtpClick}>
        Get OTP
      </Button>
    </motion.div>
  </Grid>
)}


                <Grid item xs={12}>
                  {otpRequested === "Otp Sent" && (
                    <Button className="btn" fullWidth variant="contained" type="submit" disabled={!otpRequested}>
                      Signup
                    </Button>
                  )}
                  {signupmessage && <Appa action={signupmessage} />}
                </Grid>

                <Grid item xs={12}>
                  <Button fullWidth variant="text" color="secondary" onClick={() => navigate("/")}>
                    Already have an account? Login
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
}
