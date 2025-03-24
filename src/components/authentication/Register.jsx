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
import { Appa } from "../Notify/notify";
import "./Register.css";
import { Brain } from "lucide-react";
import ParticlesBackground from "./particebackgorund";
import { assets } from "../../assets/assets";
import styles from "./Login.module.css"; // Import CSS module
import SamaVedaCard from "./VedaImage";

// Dark Theme Configuration
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Light blue
    },
    background: {
      default: "#121212", // Dark background
      paper: "#1e1e1e", // Dark paper
    },
    text: {
      primary: "#ffffff", // White text
      secondary: "#b0bec5", // Light gray
    },
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

  const validateInputs = () => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

    if (!username.trim()) newErrors.username = "Username is required.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters long.";
    else if (!passwordRegex.test(password))
      newErrors.password =
        "Password must include an uppercase letter and a special symbol.";
    if (otpRequested && !otp) newErrors.otp = "OTP is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setsignupmessage("Username already taken");
      }
    } catch (error) {
      setsignupmessage("An error occurred while registering.");
    }
  };

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
        setOtpRequested(data.message || "Failed to send otp");
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
        className="seperator"
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "10%",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "background.default",
          color: "text.primary",
        }}
      >
        <ParticlesBackground />
        <SamaVedaCard className="hello" />
        <Box className="container1" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          
          <Box
            className="container"
            sx={{
              width: "350px",
              p: 3,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: "background.paper",
              color: "text.primary",
         
            }}

          >
          
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                paddingBottom: "20px",
                fontSize: "2.5rem",
                background: "linear-gradient(90deg, #8B0000, #FF1493, #C71585)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                gap:"5%"
                
              }}
            >
              <Brain style={{ color: "#C71585" }} className={styles.logoIcon} />
              VedaMindAI
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "center" ,marginBottom :"10px"}}>
              Create new account
            </Typography>

            <form className="form_element" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={!!errors.username}
                    helperText={errors.username}
                    sx={{ input: { color: "white" } }}
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
                    sx={{ input: { color: "white" } }}
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

                {otpRequested !== "Otp Sent" && (
                  <Grid item xs={12}>
                    <Button className="btn" fullWidth variant="contained" onClick={handleOtpClick}>
                      Get OTP
                    </Button>
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
                  <Button fullWidth variant="text" className="btn" color="secondary" onClick={() => navigate("/")}>
                    Already have an account? Login
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
      {/* Google Play Button */}
      <Button
      className="btn"
        variant="contained"
        sx={{
          backgroundColor: "#4285F4",
          color: "white",
          padding: "10px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: "8px",
          "&:hover": { backgroundColor: "#357ae8" },
        }}
        startIcon={<FontAwesomeIcon icon={faGooglePlay} />}
      >
        <Link
          to="https://www.google.com/search?q=goggle+gemein+ai+playstore"
          style={{ color: "inherit", textDecoration: "none" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get it on Play Store
        </Link>
      </Button>

      {/* Microsoft Button */}
      <Button
      className="btn"
        variant="contained"
        sx={{
          backgroundColor: "#00A4EF",
          color: "white",
          padding: "10px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: "8px",
          "&:hover": { backgroundColor: "#008ecf" },
        }}
        startIcon={<FontAwesomeIcon icon={faMicrosoft} />}
      >
        <Link
          to="https://www.bing.com/search?q=goggle+gemein+ai+playstore"
          style={{ color: "inherit", textDecoration: "none" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get it on Microsoft
        </Link>
      </Button>
    </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
