import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  // ==================== ROUTER ====================

  /** Navigation hook for redirecting after successful login */
  const navigate = useNavigate();

  // ==================== STATE MANAGEMENT ====================

  /** Grade input value */
  const [grade, setGrade] = useState("");

  /** Username input value */
  const [username, setUsername] = useState("");

  /** Password input value */
  const [password, setPassword] = useState("");

  /** Confirm password for sign up mode */
  const [confirmPassword, setConfirmPassword] = useState("");

  /** Toggle between login and sign up modes */
  const [isSignUp, setIsSignUp] = useState(false);

  /** Show/hide password */
  const [showPassword, setShowPassword] = useState(false);

  /** Loading state for API calls */
  const [isLoading, setIsLoading] = useState(false);

  /** Error message display */
  const [error, setError] = useState("");

  // ==================== COLOR THEME ====================

  const colors = {
    ltgr: "#a2d3d7ff",
    ltbu: "#c5d7edff",
    mint: "#B7D6CC",
    teal: "#4C96A8",
    navy: "#2C3E58",
    white: "#ffffff",
    lightGray: "#f5f5f5",
    error: "#e74c3c"
  };

  // ==================== VALIDATION ====================

  /**
   * Validates password strength
   * @param pass - Password to validate
   * @returns boolean - true if password is greater than 8 characters long
   */
  const isValidPassword = (pass: string): boolean => {
    return pass.length >= 5; //change this first 
  };

  // ==================== EVENT HANDLERS ====================

  /**
   * Handles form submission for both login and sign up
   * test
   * Username: testuser
   * Password: password123
   */
  const handleSubmit = async () => {
    setError("");

    // Validation
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!isValidPassword(password)) {
      setError("Password must be at least 5 characters");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      setIsLoading(true);

      const endpoint = isSignUp
        ? "http://go-api-env.eba-tm4z5dgu.us-east-1.elasticbeanstalk.com/signup"
        : "http://go-api-env.eba-tm4z5dgu.us-east-1.elasticbeanstalk.com/login";

      const body = isSignUp
        ? { username, pwd: password, grade }
        : { username, pwd: password };

      const res = await fetch(endpoint, {
        method: "POST",
        // mode: "cors",
        headers: {
          "Content-Type": "application/json",
          //  "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} - ${text}`);
      }

      const data = await res.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("username", username); 
      console.log("✅ successful!");
      navigate("/home");
  } catch (err) {
    console.error("Auth error:", err);
    setError("Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

/**
 * Toggles between login and sign up modes
 */
const toggleMode = () => {
  setIsSignUp(!isSignUp);
  setError("");
  setConfirmPassword("");
};

/**
 * Handles Enter key press
 */
const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    handleSubmit();
  }
};

// ==================== RENDERING ====================

return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      padding: "20px"
    }}
  >
    {/* Main card container */}
    <div
      style={{
        width: "500px",

        padding: "40px",
        borderRadius: "16px",
        backgroundColor: colors.white,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{
          margin: "0",
          color: colors.navy,
          fontSize: "28px",
          fontWeight: "600"
        }}>
          {isSignUp ? "Sign Up" : "Login"}
        </h1>
      </div>

      {/* Test credentials info box */}
      {!isSignUp && (
        <div style={{
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "8px",
          backgroundColor: "#e8f5e9",
          border: "1px solid #4caf50",
          fontSize: "13px",
          color: "#2e7d32"
        }}>
          <strong>🧪 Test Account:</strong><br />
          Username: testuser<br />
          Password: password123
        </div>
      )}

      {/* Error message */}
      {error && (
        <div style={{
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "8px",
          backgroundColor: "#fee",
          border: `1px solid ${colors.error}`,
          color: colors.error,
          fontSize: "14px",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}

      {/* Username input */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "8px",
            border: `2px solid ${colors.mint}`,
            boxSizing: "border-box",
            fontSize: "15px",
            outline: "none",
            transition: "border-color 0.3s ease"
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = colors.teal}
          onBlur={(e) => e.currentTarget.style.borderColor = colors.mint}
        />
      </div>


      {/* Password input */}
      <div style={{ marginBottom: isSignUp ? "20px" : "12px" }}>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{
              width: "100%",
              padding: "12px 16px",
              paddingRight: "45px",
              borderRadius: "8px",
              border: `2px solid ${colors.mint}`,
              boxSizing: "border-box",
              fontSize: "15px",
              outline: "none",
              transition: "border-color 0.3s ease"
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = colors.teal}
            onBlur={(e) => e.currentTarget.style.borderColor = colors.mint}
          />
          {/* Show/hide password button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: colors.teal,
              fontSize: "12px",
              fontWeight: "600"
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Confirm password (only for sign up) */}
      {isSignUp && (
        <div style={{ marginBottom: "12px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "8px",
              border: `2px solid ${colors.mint}`,
              boxSizing: "border-box",
              fontSize: "15px",
              outline: "none",
              transition: "border-color 0.3s ease"
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = colors.teal}
            onBlur={(e) => e.currentTarget.style.borderColor = colors.mint}
          />
        </div>
      )}
      {isSignUp && (
        <div style={{ marginBottom: "12px" }}>
          <input
            // type={showPassword ? "text" : "password"}
            placeholder="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "8px",
              border: `2px solid ${colors.mint}`,
              boxSizing: "border-box",
              fontSize: "15px",
              outline: "none",
              transition: "border-color 0.3s ease"
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = colors.teal}
            onBlur={(e) => e.currentTarget.style.borderColor = colors.mint}
          />
        </div>
      )}

      {/* Submit button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: isLoading ? colors.mint : colors.teal,
          color: colors.white,
          fontSize: "16px",
          fontWeight: "600",
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s ease",
          marginTop: isSignUp ? "24px" : "0"
        }}
        onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = colors.navy)}
        onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = colors.teal)}
      >
        {isLoading
          ? "Processing..."
          : isSignUp ? "Sign Up" : "Sign In"}
      </button>

      {/* Divider */}
      <div style={{
        display: "flex",
        alignItems: "center",
        margin: "28px 0",
        color: "#999",
        fontSize: "14px"
      }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }} />
        <span style={{ padding: "0 16px" }}>OR</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }} />
      </div>

      {/* Toggle between login/signup */}
      <div style={{ textAlign: "center" }}>
        <p style={{
          fontSize: "14px",
          color: colors.navy,
          margin: 0
        }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          {" "}
          <button
            type="button"
            onClick={toggleMode}
            style={{
              background: "none",
              border: "none",
              color: colors.teal,
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "none"
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  </div>
);
}
