import { React, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import firebaseConfig from "../../config";
import LoadingWindow from "../../components/loading-window";
import "./style.css";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [verifyPasswordError, setVerifyPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (passwordError !== "" || verifyPasswordError !== "") {
      setErrorMessage("Please check your password.");
      return;
    }
    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, {
          displayName: name,
        })
          .then(() => {
            setLoading(false);
            console.log("profile updated");
            setErrorMessage("");
          })
          .catch((error) => {
            setLoading(false);
            setErrorMessage(error);
            console.log(error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        switch (errorCode) {
          case "auth/email-already-in-use":
            setErrorMessage("Email already in use.");
            break;
          default:
            setErrorMessage("Something went wrong.");
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

  const handleVerifyPasswordChange = (e) => {
    const input = e.target.value;
    setVerifyPassword(input);
    if (password === input) {
      setVerifyPasswordError("");
    } else {
      setVerifyPasswordError("Passwords do not match.");
    }
  };

  return (
    <div className="login-wrapper">
      {loading && <LoadingWindow loading={loading} />}
      <form className="login-form" onSubmit={handleSignup}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <h2>Sign Up to CodeFinery </h2>

          <p className="error-message">{errorMessage}</p>

          <TextField
            required
            id="name"
            label="Name"
            variant="outlined"
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ width: "100%" }}
          />
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
            onChange={handlePasswordChange}
            error={passwordError !== ""}
            helperText={passwordError}
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
          <TextField
            required
            id="verify-password"
            label="Verify Password"
            variant="outlined"
            type={showVerifyPassword ? "text" : "password"}
            value={verifyPassword}
            onChange={handleVerifyPasswordChange}
            error={verifyPasswordError !== ""}
            helperText={verifyPasswordError}
            sx={{ width: "100%" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showVerifyPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <button type="submit" className="submitBtn">
            Sign Up
          </button>
        </Box>
      </form>

      <form className="signup-form">
        <p>
          Already have account? Login
          <a href="http://localhost:3000/login"> here</a>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;
