import { React, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import firebaseConfig from "../../config";
import "./style.css";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import LoadingWindow from "../../components/loading-window";

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (input) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(input);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validatePassword(password) === false) {
      return;
    }
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setLoading(false);
        console.log(user);
        setErrorMessage("");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        switch (errorCode) {
          case "auth/user-not-found":
            setErrorMessage("Email not found. Please sign up.");
            break;
          case "auth/wrong-password":
            setErrorMessage("Incorrect password.");
            break;
          case "auth/too-many-requests":
            setErrorMessage(
              "Too many failed login attempts. Please try again later."
            );
            break;
          default:
            setErrorMessage(errorMessage);
            break;
        }
        setLoading(false);
      });
  };

  const handlePasswordChange = (e) => {
    const input = e.target.value;
    setPassword(input);
    if (validatePassword(input)) {
      setPasswordError("");
    } else {
      setPasswordError(
        "Password must contain at least 8 characters (at least 1 number and 1 letter)."
      );
    }
  };

  return (
    <div className="login-wrapper">
      {loading && <LoadingWindow loading={loading} />}
      <form className="login-form" onSubmit={handleLogin}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            gap: 2,
          }}
        >
          <h2>Sign in To CodeFinery </h2>
          <p className="error-message">{errorMessage}</p>
          <TextField
            required
            id="email"
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ width: "100%" }}
          />
          <TextField
            required
            id="password"
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={password}
            error={!!passwordError}
            helperText={passwordError}
            onChange={handlePasswordChange}
            sx={{ width: "100%" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <a className="forgot-password" href="">
            forgot password?
          </a>
          <button type="submit" className="submitBtn">
            Login
          </button>
        </Box>
      </form>
      <form className="signup-form">
        <p>
          New user? <a href="http://localhost:3000/signup">Sign Up</a> To
          CodeFinery
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
