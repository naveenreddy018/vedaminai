import React, { useEffect, useState, useRef } from "react";
import { FaCopy, FaShareAlt, FaThumbsUp } from "react-icons/fa";

const TypingEffect = ({ text, delay = 30, prompt }) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [liked, setLiked] = useState(false);
  const chatContainerRef = useRef(null);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    if (!text) return;

    setDisplayText(""); // Clear previous text before typing new text
    setShowButtons(false);
    setShowContinue(false);
    setIndex(0);

    let formattedText = text
      .replace(/\*/g, "")
      .replace(/(\d+\.)/g, "\n$1"); // Format numbered lists

    let charIndex = 0;
    typingIntervalRef.current = setInterval(() => {
      if (charIndex < formattedText.length) {
        setDisplayText((prev) => prev + formattedText[charIndex]);
        charIndex += 1;
      } else {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setShowButtons(true);
      }
    }, Math.max(5, delay / 10));

    return () => clearInterval(typingIntervalRef.current);
  }, [text, delay]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [displayText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText).then(() => {
      alert("Text copied to clipboard!");
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: displayText });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing not supported in this browser.");
    }
  };

  const handleLike = () => {
    setLiked(true);
    setTimeout(() => setLiked(false), 1000);
  };

  return (
    <div style={styles.chatContainer}>
      {prompt && <div style={styles.chatPrompt}>{prompt}</div>}

      <div style={styles.chatBox} ref={chatContainerRef}>
        <div style={styles.chatMessage}>
          <div style={styles.messageText}>
            {displayText.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {showButtons && (
        <div style={styles.buttonContainer}>
          <button style={styles.iconButton} onClick={handleCopy} title="Copy">
            <FaCopy /> Copy
          </button>
          <button style={styles.iconButton} onClick={handleShare} title="Share">
            <FaShareAlt /> Share
          </button>
          <button
            style={{ ...styles.iconButton, backgroundColor: liked ? "#ffdd57" : "#ffffff" }}
            onClick={handleLike}
            title="Like"
          >
            <FaThumbsUp /> Like
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  chatContainer: {
    maxWidth: "1100px",
    margin: "auto",
    padding: "15px",
    height: "auto",
    minHeight: "65vh",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  chatBox: {
    maxHeight: "400px",
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    fontSize: "0.9rem",
  },
  chatMessage: {
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "8px",
    wordWrap: "break-word",
  },
  messageText: {
    fontSize: "1rem",
    lineHeight: "1.5",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    width: "100%",
    marginTop: "15px",
    padding: "10px 0",
    borderTop: "1px solid #ddd",
  },
  iconButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
};

export default TypingEffect;
