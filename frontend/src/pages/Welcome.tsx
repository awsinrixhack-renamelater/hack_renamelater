import { useNavigate } from 'react-router-dom';
import bonsailogo from "../assets/bonsailogo.png";
/**
 * Welcome Component - Landing page for unauthenticated users
 * Serves as the entry point before authentication
 * Features: Product showcase, call-to-action buttons, feature highlights
 */
export default function Welcome() {
  // ==================== ROUTER ====================
  
  /** Navigation hook for routing to sign in/sign up */
  const navigate = useNavigate();
  
  // ==================== COLOR THEME ====================
  
  /** Centralized color palette matching the main app */
  const colors = {
    coral: "#DE807B",
    blush: "#EAB7A9", 
    mint: "#B7D6CC",
    teal: "#4C96A8",
    navy: "#2C3E58",
    white: "#ffffff",
    lightGray: "#f5f5f5",
    accent: "#a2d3d7ff",
    lightBlue: "#c5d7edff"
  };

  // ==================== EVENT HANDLERS ====================
  
  /**
   * Navigates to sign in page
   */
  const handleSignIn = () => {
    navigate('/signin');
  };

  /**
   * Navigates to sign up (via sign in page with sign up mode)
   */
  const handleSignUp = () => {
    navigate('/signin');
  };

  // ==================== RENDER ====================

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      backgroundColor: colors.white,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 20px",
      margin: "0",
      maxWidth: "none"
    }}>

<img
  src={bonsailogo} 
  alt="bonsai"
  style={{
    position: "absolute",
    top: "20px",
    right: "10px",
    width: "150px",
    height: "auto",
    opacity: 0.9,
    pointerEvents: "none",
    zIndex: 5,
  }}
/>
      
      {/* ==================== HERO SECTION ==================== */}
      <div style={{
        maxWidth: "1200px",
        width: "100%",
        textAlign: "center",
        marginBottom: "80px"
      }}>
        
        {/* Main heading with product name placeholder */}
       <h1
  style={{
    fontSize: "72px",
    fontWeight: "800",
    color: colors.navy,
    marginBottom: "32px",
    lineHeight: "1.1",
    fontFamily: "'Poppins', 'Inter', sans-serif",
    letterSpacing: "-1px",
  }}
>
  Bons.ai
</h1>
        
        {/* Product description placeholder */}
        <p style={{
          fontSize: "20px",
          color: colors.teal,
          marginBottom: "40px",
          lineHeight: "1.6",
          maxWidth: "800px",
          margin: "0 auto 40px auto"
        }}>
          Bons.ai is a platform that helps you study smarter while connecting with others.
        </p>
        
        {/* Call-to-action buttons */}
        <div style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "60px"
        }}>
          
          {/* Sign Up Button (Primary) */}
          <button
            onClick={handleSignUp}
            style={{
              padding: "16px 40px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: colors.teal,
              color: colors.white,
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(76, 150, 168, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.navy;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(44, 62, 88, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.teal;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(76, 150, 168, 0.3)";
            }}
          >
            Sign Up
          </button>
          
          {/* Sign In Button (Secondary) */}
          <button
            onClick={handleSignIn}
            style={{
              padding: "16px 40px",
              borderRadius: "12px",
              border: `2px solid ${colors.teal}`,
              backgroundColor: colors.white,
              color: colors.teal,
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.teal;
              e.currentTarget.style.color = colors.white;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.white;
              e.currentTarget.style.color = colors.teal;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Sign In
          </button>
        </div>
      </div>

      {/* ==================== FEATURES SECTION ==================== */}
<div style={{
  maxWidth: "1100px",
  width: "100%",
  margin: "0 auto 80px auto",
  textAlign: "center",
  padding: "0 20px"
}}>
  
  <h2 style={{
    fontSize: "40px",
    fontWeight: "700",
    color: colors.navy,
    marginBottom: "50px"
  }}>
    Why Study with Bons.ai?
  </h2>

  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "40px"
  }}>
    
    {/* Feature 1 */}
    <div style={{
      padding: "36px",
      borderRadius: "20px",
      backgroundColor: colors.lightBlue,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-6px)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
      <h3 style={{ fontSize: "22px", fontWeight: "600", color: colors.navy, marginBottom: "12px" }}>
        Personalized Question Sets
      </h3>
      <p style={{ fontSize: "16px", color: colors.navy, lineHeight: "1.6" }}>
        Get study questions tailored to your chosen subject and difficulty — perfect for focused review.
      </p>
    </div>

    <div style={{
      padding: "36px",
      borderRadius: "20px",
      backgroundColor: colors.accent,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-6px)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
      <h3 style={{ fontSize: "22px", fontWeight: "600", color: colors.navy, marginBottom: "12px" }}>
        Progress Tracking
      </h3>
      <p style={{ fontSize: "16px", color: colors.navy, lineHeight: "1.6" }}>
        Keep an eye on your score and improvement over time, so you always know where you stand.
      </p>
    </div>

    {/* Feature 3 */}
    <div style={{
      padding: "36px",
      borderRadius: "20px",
      backgroundColor: colors.mint,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-6px)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
      <h3 style={{ fontSize: "22px", fontWeight: "600", color: colors.navy, marginBottom: "12px" }}>
        Scoreboard Mode
      </h3>
      <p style={{ fontSize: "16px", color: colors.navy, lineHeight: "1.6" }}>
        See how you rank among other learners and challenge yourself to climb higher.
      </p>
    </div>

  </div>
</div>

      {/* ==================== FOOTER SECTION ==================== */}
      <div style={{
        maxWidth: "1200px",
        width: "100%",
        textAlign: "center",
        padding: "40px 20px",
        borderTop: `2px solid ${colors.mint}`,
        marginTop: "auto"
      }}>
        
        {/* Additional call-to-action */}
        <h3 style={{
          fontSize: "24px",
          fontWeight: "600",
          color: colors.navy,
          marginBottom: "20px"
        }}>
          Ready to Get Started?
        </h3>
       

        {/* Secondary CTA buttons */}
        <div style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <button
            onClick={handleSignUp}
            style={{
              padding: "12px 32px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: colors.coral,
              color: colors.white,
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.navy}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.coral}
          >
            Create Account
          </button>
          
          <button
            onClick={handleSignIn}
            style={{
              padding: "12px 32px",
              borderRadius: "8px",
              border: `2px solid ${colors.coral}`,
              backgroundColor: colors.white,
              color: colors.coral,
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.coral;
              e.currentTarget.style.color = colors.white;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.white;
              e.currentTarget.style.color = colors.coral;
            }}
          >
            Sign In
          </button>
        </div>
        
        {/* Copyright/Footer text */}
        <p style={{
          fontSize: "14px",
          color: colors.teal,
          marginTop: "40px",
          opacity: "0.8"
        }}>
          © 2024 Bons.ai. All rights reserved.
        </p>
      </div>
    </div>
  );
}
