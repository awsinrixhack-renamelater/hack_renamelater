import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MathJax, MathJaxContext } from "better-react-mathjax";

/**
 * Message interface
 */
interface Message {
  role: "user" | "ai";
  content: string;
}

/**
 * Homepage Component
 */
export default function Homepage() {
  const navigate = useNavigate(); // for navigation

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [showActionButtons, setShowActionButtons] = useState(false); // show "One more question" and "Shift Subject" buttons
  const [feedback, setFeedback] = useState<null | "correct" | "wrong">(null); // user answer feedback
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentHint, setCurrentHint] = useState("");
  const [isFirstInput, setIsFirstInput] = useState(true); // check if is the first input
  const chatEndRef = useRef<HTMLDivElement>(null); // auto scroll ref

  const colors = {
    mint: "#B7D6CC",
    teal: "#4C96A8",
    navy: "#2C3E58",
    ltgr: "#a2d3d7ff",
    ltbu: "#c5d7edff",
    white: "#ffffff",
  };

  useEffect(() => {
    const user = localStorage.getItem("username");
    setUsername(user || "User");
  }, []);

  // AUTO SCROLL TO BOTTOM
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //HANDLE SEND (USER QUESTION)
  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);
    setFeedback(null);

    try {
      if (isFirstInput) {
        // the first input: user specifies topic, AI asks first question
        const response = await fetch("http://go-api-env.eba-tm4z5dgu.us-east-1.elasticbeanstalk.com/gen", {
          method: "GET",
          body: JSON.stringify({Input: input})
        });
        if (response.status != 200) {
          // idk u figure that out carys
        }
        const resJson = await response.json();
        const aiReply = resJson[""] // what the llm is supposed 
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: "ai", content: aiReply }]);
          setIsFirstInput(false); // mark that the first input has been made
          setIsLoading(false);
        }, 1000);
      } else {
        // the subsequent inputs: user answers the question, AI evaluates
        const aiReply = `
Here's the evaluation of your answer:<br/><br/>
The quadratic formula is: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
<br/>
Also, consider: $y = \\frac{1}{2}gt^2$
`;
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: "ai", content: aiReply }]);
          setShowActionButtons(true);

          const randomFeedback = Math.random() > 0.5 ? "correct" : "wrong"; 
          setFeedback(randomFeedback);
          setIsLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "❌ Error: Failed to get response." },
      ]);
      setIsLoading(false);
    }
  };

  // ==================== HANDLE NEW AI QUESTION ====================
  const handleNewQuestion = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setShowActionButtons(false);
    setFeedback(null);

    try {
      const newQuestion = `
Here's a new question for you:<br/><br/>
Solve for x in the equation:<br/>
$$
2x^2 + 3x - 5 = 0
$$
`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "ai", content: newQuestion }]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "❌ Error: Failed to get new question." }, 
      ]);
      setIsLoading(false);
    }
  };

  // ==================== HANDLE SHIFT SUBJECT ====================
  const handleShiftSubject = () => {
    setMessages([]);
    setInput("");
    setShowActionButtons(false);
    setFeedback(null);
    setShowSidebar(false);
    setIsFirstInput(true); // check if is the first input 
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasConversation = messages.length > 0;

  // ==================== HANDLE HINT ====================
  const handleShowHint = (questionContent: string) => {
    setCurrentHint(`Detailed explanation for:\n\n"${questionContent}"\n\nThis is where the hint appears.`);
    setShowSidebar(true);
  };

  // ==================== RENDER ====================
  return (
    <MathJaxContext
      config={{
        loader: { load: ["input/tex", "output/chtml"] },
        tex: { 
          inlineMath: [["\\(", "\\)"], ["$", "$"]], 
          displayMath: [["$", "$"], ["\\[", "\\]"]] 
        },
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: colors.white,
          position: "relative",
        }}
      >
        {/* ==================== RANKING BUTTON ==================== */}
        <div style={{ padding: "12px 20px" }}>  
          <button 
            onClick={() => navigate("/Scoreboard")} 
            style={{ 
              backgroundColor: colors.teal, 
              border: "2px solid white", 
              color: "white", 
              width: "100px", 
              padding: "10px 14px", 
              borderRadius: "8px", 
              fontSize: "1rem", 
              cursor: "pointer"
            }}
          >
            Ranking
          </button>
        </div>

        {/* ==================== CHAT AREA ==================== */}
        <div
          style={{
            flex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {!hasConversation && (
            <div
              style={{
                flex: 1,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h1 style={{ fontSize: "36px", marginBottom: "20px", color: colors.navy, fontWeight: 600, textAlign: "center" }}>
                Which topic do you want to learn?
              </h1>
              <p style={{ fontSize: "18px", color: colors.teal, marginBottom: "50px", textAlign: "center" }}>
                Ask me anything!
              </p>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isLastAiMessage =
              msg.role === "ai" && (idx === messages.length - 1 || messages[idx + 1]?.role === "user");
            const userQuestion = idx > 0 ? messages[idx - 1]?.content : "";

            return (
              <div key={idx}>
                {msg.role === "user" ? (
                  <div
                    style={{
                      width: "100vw",
                      maxWidth: "800px",
                      padding: "24px 40px",
                      borderRadius: "16px",
                      backgroundColor: colors.mint,
                      color: colors.navy,
                      fontSize: "16px",
                      lineHeight: "1.8",
                      textAlign: "center",
                      marginBottom: "16px",
                      boxShadow: "-4px 0 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    {msg.content}
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        width: "100vw",
                        maxWidth: "800px",
                        padding: "24px 40px",
                        borderRadius: "16px",
                        backgroundColor: colors.ltbu,
                        color: colors.navy,
                        fontSize: "16px",
                        lineHeight: "1.8",
                        textAlign: "center",
                        marginBottom: "16px",
                        boxShadow: "-4px 0 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <MathJax dynamic>
                        <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                      </MathJax>
                    </div>

                    {isLastAiMessage && (
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: "24px",
                        }}
                      >
                        <button
                          onClick={() => handleShowHint(userQuestion)}
                          style={{
                            padding: "10px 24px",
                            borderRadius: "8px",
                            border: `2px solid ${colors.ltgr}`,
                            backgroundColor: colors.white,
                            color: colors.ltgr,
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "600",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.ltgr;
                            e.currentTarget.style.color = colors.white;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = colors.white;
                            e.currentTarget.style.color = colors.ltgr;
                          }}
                        >
                          View Hint
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div style={{ textAlign: "center", color: colors.teal, marginTop: "20px" }}>Thinking...</div>
          )}

          {feedback && (
            <div
              style={{
                textAlign: "center",
                color: feedback === "correct" ? "green" : "red",
                fontSize: "18px",
                fontWeight: "600",
                marginTop: "12px",
              }}
            >
              {feedback === "correct" ? "🎉 Congratulation!" : "❌ Wrong answer!"}
            </div>
          )}
          
          {/* auto rowing */}
          <div ref={chatEndRef} />
        </div>

        {/* ==================== INPUT AREA ==================== */}
        <div
          style={{
            padding: "20px",
            borderTop: `2px solid ${colors.mint}`,
            backgroundColor: colors.white,
          }}
        >
          <div style={{ width: "100%", margin: "0 auto", display: "flex", gap: "12px" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter your question..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "14px 20px",
                borderRadius: "12px",
                border: `2px solid ${colors.mint}`,
                fontSize: "16px",
                outline: "none",
              }}
            />
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
              }}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>

          {/* Action Buttons */}
          {showActionButtons && (
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "20px" }}>
              <button
                onClick={handleNewQuestion}
                style={{
                  padding: "10px 24px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: colors.teal,
                  color: colors.white,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                One more question
              </button>

              <button
                onClick={handleShiftSubject}
                style={{
                  padding: "10px 24px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: colors.mint,
                  color: colors.navy,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Shift Subject
              </button>
            </div>
          )}
        </div>
          
        {/* ==================== HINT SIDEBAR ==================== */}
        {showSidebar && (
          <div
            style={{
              width: "400px",
              height: "100vh",
              backgroundColor: colors.white,
              borderLeft: `3px solid ${colors.mint}`,
              display: "flex",
              flexDirection: "column",
              position: "fixed",
              right: 0,
              top: 0,
              boxShadow: "-4px 0 12px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                padding: "24px",
                borderBottom: `2px solid ${colors.mint}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: colors.ltbu,
              }}
            >
              <h2 style={{ fontSize: "16px", color: colors.navy, fontWeight: "600", margin: 0 }}>
                Detailed Explanation
              </h2>
              <button
                onClick={() => setShowSidebar(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: colors.ltgr,
                  color: colors.white,
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Close
              </button>
            </div>
            <div style={{ flex: 1, padding: "24px", overflowY: "auto", color: colors.navy, fontSize: "16px", lineHeight: "1.8" }}>
              <div style={{ whiteSpace: "pre-line" }}>{currentHint}</div>
            </div>
          </div>
        )}
      </div>
    </MathJaxContext>
  );
}