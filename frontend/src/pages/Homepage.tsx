import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Message interface - defines the structure of chat messages
 * @property role - Identifies if message is from 'user' or 'ai'
 * @property content - The actual text content of the message
 */
interface Message {
  role: 'user' | 'ai';
  content: string;
}

/**
 * Homepage Component - Main chat interface
 * Handles user questions, AI responses, and hint explanations
 */
export default function Homepage() {
  // ==================== ROUTER ====================
  
  /** Navigation hook for logout redirect */
  const navigate = useNavigate();
  
  // ==================== STATE MANAGEMENT ====================
  
  /** Array of all messages in the conversation */
  const [messages, setMessages] = useState<Message[]>([]);
  
  /** Current text in the input field */
  const [input, setInput] = useState("");
  
  /** Controls visibility of the hint sidebar */
  const [showSidebar, setShowSidebar] = useState(false);
  
  /** Content displayed in the hint sidebar */
  const [currentHint, setCurrentHint] = useState("");
  
  /** Tracks if we're waiting for an API response */
  const [isLoading, setIsLoading] = useState(false);
  
  /** User email from localStorage */
  const [userEmail, setUserEmail] = useState("");
  
  // ==================== AUTHENTICATION CHECK ====================
  
  /**
   * Check if user is authenticated on component mount
   * Redirect to signin if no auth token found
   */
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');
    
    if (!authToken) {
      // No authentication, redirect to signin
      navigate('/signin');
    } else {
      // Set user email for display
      setUserEmail(email || 'User');
    }
  }, [navigate]);
  
  // ==================== COLOR THEME ====================
  
  /** Centralized color palette for consistent theming */
  const colors = {
    coral: "#DE807B",      // Accent color for hints
    blush: "#EAB7A9",      // AI message background
    mint: "#B7D6CC",       // User message background, borders
    teal: "#4C96A8",       // Primary action color
    navy: "#2C3E58",       // Text color, hover states
    white: "#ffffff",      // Background color
  };

  // ==================== EVENT HANDLERS ====================
  
  /**
   * Handles sending a message to the AI
   * 1. Validates input is not empty
   * 2. Adds user message to chat
   * 3. Calls backend API (TODO)
   * 4. Adds AI response to chat
   */
  const handleSend = async () => {
    // Prevent sending empty messages or multiple requests
    if (input.trim() === "" || isLoading) return;

    // Save user message before clearing input
    const userMessage = input;
    
    // Add user message to chat immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Clear input field
    setInput("");
    
    // Show loading state
    setIsLoading(true);

    try {
      // TODO: Replace with actual backend API call
      // Example API integration:
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: userMessage })
      // });
      // const data = await response.json();
      
      // TEMPORARY: Simulated AI response for development
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: `Response to "${userMessage}": Here's the explanation...` 
        }]);
        setIsLoading(false);
      }, 1000);
      
      // TODO: Replace setTimeout with actual API response:
      // setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
      // setIsLoading(false);
      
    } catch (error) {
      // Handle API errors gracefully
      console.error('Error sending message:', error);
      setIsLoading(false);
      
      // TODO: Show error message to user
      // setMessages(prev => [...prev, { 
      //   role: 'ai', 
      //   content: 'Sorry, something went wrong. Please try again.' 
      // }]);
    }
  };

  /**
   * Handles Enter key press in input field
   * @param e - Keyboard event
   * Submit on Enter, allow Shift+Enter for new lines
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default form submission
      handleSend();
    }
  };

  /**
   * Fetches and displays detailed hint for a question
   * @param questionContent - The original user question
   */
  const handleShowHint = async (questionContent: string) => {
    try {
      // TODO: Replace with actual backend API call
      // Example API integration:
      // const response = await fetch('/api/hint', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ question: questionContent })
      // });
      // const data = await response.json();
      
      // TEMPORARY: Simulated hint for development
      setCurrentHint(`Detailed Explanation:\n\n"${questionContent}"\n\nThis is where the detailed explanation will appear...`);
      
      // TODO: Replace with actual API response:
      // setCurrentHint(data.hint);
      
      // Show the sidebar with the hint
      setShowSidebar(true);
      
    } catch (error) {
      // Handle API errors gracefully
      console.error('Error fetching hint:', error);
      
      // TODO: Show error message in sidebar
    }
  };

  /**
   * Handles user logout
   * Clears authentication and redirects to signin
   */
  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    
    // Redirect to signin
    navigate('/signin');
  };

  // ==================== DERIVED STATE ====================
  
  /** Check if there are any messages to display conversation UI */
  const hasConversation = messages.length > 0;

  // ==================== RENDER ====================
  
  return (
    <div style={{ 
      width: "100vw",
      height: "100vh",
      display: "flex",
      position: "relative",
      backgroundColor: colors.white,
    }}>
      {/* ==================== MAIN CHAT AREA ==================== */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        // Adjust width when sidebar is open
        width: showSidebar ? "calc(100% - 400px)" : "100%"
      }}>
        
        {/* ==================== INITIAL STATE (No Conversation) ==================== */}
        {!hasConversation && (
          <div style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px 20px"
          }}>
            {/* Main heading */}
            <h1 style={{ 
              fontSize: "36px", 
              marginBottom: "20px",
              color: colors.navy,
              fontWeight: "600"
            }}>
              AI Learning Assistant
            </h1>
            
            {/* Subtitle */}
            <p style={{
              fontSize: "18px",
              color: colors.teal,
              marginBottom: "50px"
            }}>
              Ask me anything!
            </p>
            
            {/* Initial input container */}
            <div style={{ 
              width: "100%", 
              maxWidth: "800px",
              display: "flex", 
              gap: "12px",
              borderRadius: "12px",
              padding: "8px",
              backgroundColor: colors.white,
              border: `2px solid ${colors.mint}`
            }}>
              {/* Input field */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter your question..."
                disabled={isLoading}
                style={{
                  flex: "1",
                  padding: "16px 20px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "16px",
                  outline: "none",
                  backgroundColor: "transparent"
                }}
              />
              
              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={isLoading}
                style={{
                  padding: "12px 32px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: isLoading ? colors.mint : colors.teal,
                  color: colors.white,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  transition: "background-color 0.3s ease"
                }}
                onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = colors.navy)}
                onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = colors.teal)}
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        )}

        {/* ==================== CONVERSATION STATE ==================== */}
        {hasConversation && (
          <>
            {/* ==================== MESSAGES AREA ==================== */}
            <div
              style={{
                flex: "1",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                padding: "40px 20px"
              }}
            >
              {/* Loop through all messages */}
              {messages.map((msg, idx) => {
                // Check if this is the last AI message (to show hint button)
                const isLastAiMessage = msg.role === 'ai' && 
                  (idx === messages.length - 1 || messages[idx + 1]?.role === 'user');
                
                // Get the user's question for this AI response
                const userQuestion = idx > 0 ? messages[idx - 1]?.content : '';
                
                return (
                  <div key={idx}>
                    {msg.role === "user" ? (
                      /* ========== USER MESSAGE ========== */
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: "24px",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            maxWidth: "900px",
                            padding: "20px 40px",
                            borderRadius: "16px",
                            backgroundColor: colors.mint,
                            color: colors.navy,
                            fontSize: "18px",
                            lineHeight: "1.6",
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      /* ========== AI MESSAGE WITH HINT BUTTON ========== */
                      <div>
                        {/* AI response bubble */}
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "16px",
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              maxWidth: "900px",
                              padding: "24px 40px",
                              borderRadius: "16px",
                              backgroundColor: colors.blush,
                              color: colors.navy,
                              fontSize: "16px",
                              lineHeight: "1.8",
                              textAlign: "left",
                            }}
                          >
                            {msg.content}
                          </div>
                        </div>
                        
                        {/* Show hint button only for the most recent AI message */}
                        {isLastAiMessage && (
                          <div style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "24px"
                          }}>
                            <button
                              onClick={() => handleShowHint(userQuestion)}
                              style={{
                                padding: "10px 24px",
                                borderRadius: "8px",
                                border: `2px solid ${colors.coral}`,
                                backgroundColor: colors.white,
                                color: colors.coral,
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "600",
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
                              View Hint
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* ========== LOADING INDICATOR ========== */}
              {isLoading && (
                <div style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "24px"
                }}>
                  <div style={{
                    padding: "20px",
                    color: colors.teal,
                    fontSize: "16px"
                  }}>
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* ==================== INPUT AREA (Bottom) ==================== */}
            <div style={{
              padding: "20px",
              borderTop: `2px solid ${colors.mint}`,
              backgroundColor: colors.white
            }}>
              <div style={{
                width: "100%",
                maxWidth: "900px",
                margin: "0 auto",
                display: "flex",
                gap: "12px"
              }}>
                {/* Input field for follow-up questions */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask another question..."
                  disabled={isLoading}
                  style={{
                    flex: "1",
                    padding: "14px 20px",
                    borderRadius: "12px",
                    border: `2px solid ${colors.mint}`,
                    fontSize: "16px",
                    outline: "none",
                    transition: "border-color 0.3s ease"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = colors.teal}
                  onBlur={(e) => e.currentTarget.style.borderColor = colors.mint}
                />
                
                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  style={{
                    padding: "14px 32px",
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: isLoading ? colors.mint : colors.teal,
                    color: colors.white,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    transition: "background-color 0.3s ease"
                  }}
                  onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = colors.navy)}
                  onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = colors.teal)}
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ==================== HINT SIDEBAR ==================== */}
      {showSidebar && (
        <div style={{
          width: "400px",
          height: "100vh",
          backgroundColor: colors.white,
          borderLeft: `3px solid ${colors.mint}`,
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          right: 0,
          top: 0,
          animation: "slideIn 0.3s ease-out",
          boxShadow: "-4px 0 12px rgba(0,0,0,0.1)"
        }}>
          {/* ========== SIDEBAR HEADER ========== */}
          <div style={{
            padding: "24px",
            borderBottom: `2px solid ${colors.mint}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.blush
          }}>
            {/* Title */}
            <h2 style={{
              fontSize: "20px",
              color: colors.navy,
              fontWeight: "600",
              margin: 0
            }}>
              Detailed Explanation
            </h2>
            
            {/* Close button */}
            <button
              onClick={() => setShowSidebar(false)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: colors.coral,
                color: colors.white,
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "background-color 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.navy}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.coral}
            >
              Close
            </button>
          </div>

          {/* ========== SIDEBAR CONTENT ========== */}
          <div style={{
            flex: 1,
            padding: "24px",
            overflowY: "auto",
            color: colors.navy,
            fontSize: "15px",
            lineHeight: "1.8"
          }}>
            {/* Display hint content with preserved line breaks */}
            <div style={{
              whiteSpace: "pre-line"
            }}>
              {currentHint}
            </div>
          </div>
        </div>
      )}

      {/* ==================== ANIMATIONS ==================== */}
      <style>{`
        /* Sidebar slide-in animation */
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}