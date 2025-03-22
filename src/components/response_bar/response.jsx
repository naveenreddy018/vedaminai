import { useEffect, useState, useRef } from "react";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ImageComponent from "../ImageComponent/image";
import LogoutModal from "./modal";
import Slide_Bar from "../slide_bar/slide";
import TypingEffect from "./typingeffect";
import "./response.css";
import { assets } from "../../assets/assets";

export const Array = [];

const Response_Bar = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [userModalBody, setUserModalBody] = useState(false);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Get stored user data
  const getStoredUsername = () => localStorage.getItem("Username") || "Guest";
  const getStoredPhoto = () => localStorage.getItem("profilePhoto") || "/default-user.png";
  const [username, setUsername] = useState(getStoredUsername());
  const [profilePhoto, setProfilePhoto] = useState(getStoredPhoto());

  const cardPrompts = [
    "What is quantum computing?",
    "Explain AI in simple terms",
    "How does JavaScript work?",
    "Best ways to learn coding?",
  ];

  // Load conversation from local storage when component mounts
  useEffect(() => {
    const storedConversation = JSON.parse(localStorage.getItem("conversation")) || [];
    setConversation(storedConversation);
  }, []);

  // Scroll to bottom when conversation updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSend = async (currentPrompt) => {
    if (currentPrompt.trim() && !requestInProgress) {
      console.log("Sending request for prompt:", currentPrompt); // ✅ Check if this logs twice
  
      setPrompt(""); 
      setLoading(true);
      setRequestInProgress(true);
  
      Array.push(currentPrompt);
      const newConversation = [...conversation, { prompt: currentPrompt, response: "Thinking..." }];
      setConversation(newConversation);
      localStorage.setItem("conversation", JSON.stringify(newConversation));
      localStorage.setItem("lastPrompt", currentPrompt);
  
      try {
        const res = await fetch("https://render-back-end-8.onrender.com/prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: currentPrompt }),
        });
  
        if (!res.ok) throw new Error("Failed to fetch AI response");
  
        const responseData = await res.json();
        console.log("Received response:", responseData); // ✅ Check if this logs twice
  
        setLoading(false);
        const updatedConversation = newConversation.map((entry) =>
          entry.prompt === currentPrompt ? { ...entry, response: responseData.response } : entry
        );
        setConversation(updatedConversation);
        localStorage.setItem("conversation", JSON.stringify(updatedConversation));
  
      } catch (error) {
        console.error("Error:", error.message);
        setLoading(false);
        setConversation([...newConversation, { prompt: currentPrompt, response: "Error occurred." }]);
        localStorage.setItem("conversation", JSON.stringify(newConversation));
      } finally {
        setRequestInProgress(false);
      }
    }
  };
  

  // Handle Enter key to send prompt
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(prompt);
    }
  };

  // Speech recognition setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        setPrompt(transcript);
        handleSend(transcript);
      };

      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  // Start voice recognition
  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (!isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="response-container">
      <header className="response-header">
        <div className="logo-title">
          <Slide_Bar />
          <Brain className="brain-icon" />
          <h1 style={{ fontSize: "1.5rem" }}>VedaMind AI</h1>
        </div>
        <div className="header-actions">
          <Link to="/trygemini" className="advanced-link">← Advanced Version</Link>
          <div className="nav-user-icon">
            {userModalBody ? (
              <LogoutModal setUserModalBody={setUserModalBody} />
            ) : (
              <ImageComponent
                src={assets.user_icon}
                style={{ width: 50, borderRadius: "50%", cursor: "pointer" }}
                onClick={() => setUserModalBody(true)}
              />
            )}
          </div>
        </div>
      </header>

      <main className="response-main">
        {conversation.length === 0 ? (
          <div className="intro-message">
            <Brain className="intro-icon" />
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Welcome to Vedamind AI, {username}!</h2>
              <p className="text-gray-600">Start a conversation by typing a message below.</p>
            </div>
            <div className="prompt-buttons">
              {cardPrompts.map((text, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSend(text)}
                  className="prompt-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {text}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="conversation">
            {conversation.map((entry, index) => (
              <div key={index} className="chat-bubble">
                <p className="user-message">{entry.prompt}</p>
                <TypingEffect text={entry.response} className="ai-message" />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <div className="chat-input-container">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown} // Handle Enter Key
          placeholder="Ask anything..."
          className="chat-input"
        />
        <div className="chat-input-buttons">
          <button 
            onClick={startListening} 
            className={`chat-mic ${isListening ? "listening" : ""}`}
          >
            <FaMicrophone size={25} />
          </button>
          {prompt.length > 0 && (
            <button onClick={() => handleSend(prompt)} className="chat-send">
              <FaPaperPlane size={25} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Response_Bar;


// <div className="additional-icons">
// <div className="send-icon">
//   {!requestInProgress && prompt.trim() && (
//     <ImageComponent src={assets.send_icon} style={{ width: 30, cursor: "pointer" }} onClick={() => handleSend(prompt)} />
//   )}
// </div>
// </div>