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
 

  const defaultResponses = {
    "What is quantum computing?": 
      "Quantum computing is a revolutionary approach that uses quantum mechanics principles to perform computations. " +
      "Unlike classical computers, which use bits (0s and 1s), quantum computers use qubits. " +
      "Qubits can exist in multiple states simultaneously due to a property called superposition. " +
      "This enables quantum computers to process vast amounts of data in parallel. " +
      "Another key concept is entanglement, where qubits become interconnected, meaning the state of one qubit affects the other, regardless of distance. " +
      "Quantum interference helps refine calculations by amplifying correct answers and canceling incorrect ones. " +
      "Quantum computers are particularly powerful for optimization problems, cryptography, and complex simulations. " +
      "Shor’s algorithm, for example, can factor large numbers exponentially faster than classical methods, impacting encryption. " +
      "Quantum computers are measured in quantum volume, rather than traditional speed metrics like GHz. " +
      "Leading companies like IBM, Google, and startups like Rigetti are pioneering quantum research. " +
      "IBM’s Quantum Experience allows users to run quantum algorithms on real hardware via the cloud. " +
      "Quantum computing faces challenges such as error rates, noise interference, and the need for extreme cooling. " +
      "Quantum supremacy is the point at which quantum computers outperform classical ones in practical tasks. " +
      "Google claimed quantum supremacy in 2019 with its Sycamore processor solving a task in 200 seconds that would take classical computers 10,000 years. " +
      "Superconducting qubits, trapped ions, and topological qubits are different hardware implementations of quantum computing. " +
      "Quantum computing is expected to revolutionize drug discovery by simulating molecular interactions accurately. " +
      "It could also enhance artificial intelligence by optimizing training models faster than classical GPUs. " +
      "Banks and financial institutions are exploring quantum computing for risk analysis and fraud detection. " +
      "Cryptography will undergo a transformation since quantum computers can break traditional encryption methods. " +
      "Post-quantum cryptography is a field focused on developing encryption resistant to quantum attacks. " +
      "Many governments are investing in quantum research to maintain national security and technological leadership. " +
      "Quantum annealing is a special type of quantum computing used for optimization problems, with D-Wave leading in this space. " +
      "Quantum algorithms like Grover’s search algorithm can speed up database searches significantly. " +
      "Building a large-scale quantum computer requires overcoming decoherence, which leads to information loss. " +
      "Quantum teleportation allows information to be transferred between qubits without physical movement. " +
      "Hybrid quantum-classical computing approaches are currently used, leveraging classical pre-processing before quantum calculations. " +
      "The future of quantum computing is uncertain but promises groundbreaking advances in multiple fields. " +
      "While practical applications are still in early development, quantum computing continues to evolve rapidly. " +
      "It is a field with immense potential, requiring interdisciplinary expertise in physics, mathematics, and computer science.",
  
    "Explain AI in simple terms": 
      "Artificial Intelligence (AI) is the ability of machines to simulate human intelligence. " +
      "AI systems can learn from data, recognize patterns, and make decisions without direct human intervention. " +
      "There are two main types: Narrow AI (specific tasks like voice assistants) and General AI (human-like intelligence, not yet achieved). " +
      "Machine Learning (ML) is a subset of AI where algorithms improve performance by learning from data. " +
      "Deep Learning is a type of ML that uses neural networks to recognize complex patterns in images, speech, and text. " +
      "AI is used in chatbots, recommendation systems (Netflix, Amazon), and self-driving cars. " +
      "Natural Language Processing (NLP) allows AI to understand and generate human language (like ChatGPT and Siri). " +
      "AI helps in medical diagnosis by analyzing X-rays, MRIs, and detecting diseases early. " +
      "It plays a role in cybersecurity by detecting fraudulent activities and unauthorized access. " +
      "Autonomous systems, such as drones and robots, use AI to navigate and complete tasks. " +
      "AI-powered translation tools help break language barriers across the world. " +
      "Companies use AI for predictive analytics to forecast trends and improve decision-making. " +
      "Personalized marketing and targeted ads are optimized using AI-driven data insights. " +
      "AI is transforming industries like finance, manufacturing, and healthcare through automation. " +
      "It reduces human error in tasks such as data entry and decision-making. " +
      "AI-powered virtual assistants (Google Assistant, Alexa) make daily life easier. " +
      "Ethical concerns include AI bias, privacy issues, and job displacement. " +
      "Explainability is a challenge—some AI models make decisions without clear reasoning. " +
      "Self-learning AI models improve efficiency over time without human programming. " +
      "AI-driven smart homes adjust lighting, temperature, and security systems automatically. " +
      "Robotics combined with AI enhances automation in manufacturing and logistics. " +
      "AI-driven content creation generates news articles, artwork, and even music. " +
      "Facial recognition uses AI to identify individuals in photos and videos. " +
      "Self-driving cars use AI to analyze surroundings and make driving decisions. " +
      "AI in gaming improves NPC behavior and procedural content generation. " +
      "AI-powered financial algorithms predict stock trends and automate trading. " +
      "AI in education provides personalized learning experiences and intelligent tutoring. " +
      "Future AI advancements may lead to Artificial General Intelligence (AGI). " +
      "Governments and organizations are creating regulations to ensure AI safety. " +
      "AI continues to evolve, shaping the future of technology and society.",
  
    "How does JavaScript work?": 
      "JavaScript is a scripting language used to make web pages interactive. " +
      "It runs in the browser and allows dynamic updates without refreshing the page. " +
      "JavaScript follows an event-driven, non-blocking model using the event loop. " +
      "It interacts with HTML and CSS to manipulate webpage elements dynamically. " +
      "JavaScript is a single-threaded language but can handle asynchronous operations. " +
      "It uses callbacks, promises, and async/await for handling asynchronous tasks. " +
      "JavaScript engines like V8 (Chrome) and SpiderMonkey (Firefox) execute the code. " +
      "Node.js allows JavaScript to run on the server outside of a browser. " +
      "JavaScript frameworks like React, Angular, and Vue simplify development. " +
      "It supports object-oriented, functional, and procedural programming styles. " +
      "The Document Object Model (DOM) enables JavaScript to modify webpage content. " +
      "JavaScript can validate user input in forms before sending data to the server. " +
      "It makes web applications dynamic by handling user events (clicks, scrolls, etc.). " +
      "Web APIs allow JavaScript to interact with the browser (e.g., fetch data from a server). " +
      "JavaScript supports AJAX for making asynchronous HTTP requests. " +
      "Local storage and session storage enable client-side data storage. " +
      "JavaScript is loosely typed but supports strong typing with TypeScript. " +
      "It allows modular programming through ES6 modules and CommonJS. " +
      "Closures, higher-order functions, and currying are key functional programming concepts. " +
      "Error handling is done using try-catch blocks and error objects. " +
      "Event delegation improves performance by reducing event listeners. " +
      "JavaScript supports WebSockets for real-time communication. " +
      "JavaScript frameworks simplify SPA (Single Page Application) development. " +
      "The Fetch API provides a modern way to make network requests. " +
      "Web Workers allow JavaScript to run in background threads. " +
      "Service Workers enable offline functionality and push notifications. " +
      "JavaScript supports Object Prototypes and inheritance through prototype chains. " +
      "ES6 introduced modern features like let/const, arrow functions, and template literals. " +
      "It remains one of the most popular languages for web development. " +
      "JavaScript continues to evolve, making the web more interactive and dynamic."
  };
  

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
      console.log("Sending request for prompt:", currentPrompt);
  
      setPrompt("");
      setLoading(true);
      setRequestInProgress(true);
  
      Array.push(currentPrompt);
      const newConversation = [...conversation, { prompt: currentPrompt, response: "Thinking..." }];
      setConversation(newConversation);
      localStorage.setItem("conversation", JSON.stringify(newConversation));
      localStorage.setItem("lastPrompt", currentPrompt);
  
      try {
        if (defaultResponses[currentPrompt]) {
          // Use default response
          console.log("Using default response for:", currentPrompt);
          setLoading(false);
          const updatedConversation = newConversation.map((entry) =>
            entry.prompt === currentPrompt ? { ...entry, response: defaultResponses[currentPrompt] } : entry
          );
          setConversation(updatedConversation);
          localStorage.setItem("conversation", JSON.stringify(updatedConversation));
        } else {
          // Fetch from API if no default response exists
          const res = await fetch("https://render-back-end-8.onrender.com/prompt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: currentPrompt }),
          });
  
          if (!res.ok) throw new Error("Failed to fetch AI response");
  
          const responseData = await res.json();
          console.log("Received response:", responseData);
  
          setLoading(false);
          const updatedConversation = newConversation.map((entry) =>
            entry.prompt === currentPrompt ? { ...entry, response: responseData.response } : entry
          );
          setConversation(updatedConversation);
          localStorage.setItem("conversation", JSON.stringify(updatedConversation));
        }
      } catch (error) {
        console.error("Error:", error.message);
        setLoading(false);
  
        const fallbackResponse = defaultResponses[currentPrompt] || "No response available.";
  
        const updatedConversation = newConversation.map((entry) =>
          entry.prompt === currentPrompt ? { ...entry, response: fallbackResponse } : entry
        );
  
        setConversation(updatedConversation);
        localStorage.setItem("conversation", JSON.stringify(updatedConversation));
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