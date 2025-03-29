import React, { useState, useEffect, useRef } from 'react';
import ImageComponent from '../ImageComponent/image.jsx';
import { assets } from '../../assets/assets';
import './slide.css';
import { useNavigate } from 'react-router-dom';

export const PromptReq = [];

function Slide_Bar() {
  const [menu, setMenu] = useState(false);
  const [menuIndex, setMenuIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [responseText, setResponseText] = useState('');
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('conversation')) || [];
    setConversationHistory(savedHistory);
    setRecentPrompts(savedHistory.map(item => item.prompt));
  }, []);

  useEffect(() => {
    localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
    setRecentPrompts(conversationHistory.map(item => item.prompt));
  }, [conversationHistory]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuIndex(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const deletePrompt = (index) => {
    const updatedHistory = [...conversationHistory];
    updatedHistory.splice(index, 1);
    setConversationHistory(updatedHistory);
  };

  const startRenaming = (index, prompt) => {
    setEditingIndex(index);
    setEditText(prompt.prompt);
  };

  const saveRenaming = (index) => {
    const updatedHistory = [...conversationHistory];
    updatedHistory[index].prompt = editText;
    setConversationHistory(updatedHistory);
    setEditingIndex(null);
  };

  const onPromptClick = (prompt, response) => {
    PromptReq.length = 0;
    PromptReq.push(prompt);
    showTypingEffect(response);
  };

  const showTypingEffect = (response) => {
    setResponseText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < response.length) {
        setResponseText((prev) => prev + response[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  };

  return (
    <div className="slide_container">
      {!menu && (
        <button className="hamburger" onClick={() => setMenu((prev) => !prev)}>
          ☰
        </button>
      )}

      <div className={`sidebar ${menu ? 'show' : ''}`}>
        <div className="top-section">
          <h3 className='menu'>Menu</h3>
          <button className="close-btn" onClick={() => setMenu(false)}>✖</button>
        </div>

        <ul className="cont">
          <li className="history-title">
            <ImageComponent src={assets.history_icon} /> Recent History
          </li>
          {recentPrompts.length > 0 ? (
            recentPrompts.map((prompt, index) => (
              <li key={index} className="history-item" style={{backgroundColor :"#1a73e8" }}>
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => saveRenaming(index)}
                  />
                ) : (
                  <span style={{ fontSize: "1rem"}} onClick={() => onPromptClick(prompt, conversationHistory[index].response)}>
                    {prompt}
                  </span>
                )}

                <button className="dots-btn" onClick={() => setMenuIndex(menuIndex === index ? null : index)}>
                  ⋮
                </button>

                {menuIndex === index && (
                  <div className="options-menu" ref={menuRef}>
                    <button onClick={() => startRenaming(index, { prompt })}>Rename</button>
                    <button onClick={() => deletePrompt(index)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="history-empty">No recent prompts</li>
          )}
        </ul>

        <div className="bottom-section">
          <ul className="helpcontainer">
            <li onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>
              <img
                style={{ borderRadius: '50%' }}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShoqKBIBUf2wQ8DJBoCYLC5TJhUtWf2esIsg&s"
                alt="About"
              />
              <span>About</span>
            </li>
            <li onClick={() => navigate('/help')} style={{ cursor: 'pointer' }}>
              <ImageComponent src={assets.question_icon} />
              <span>Help</span>
            </li>
            <li onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }}>
              <ImageComponent src={assets.setting_icon} />
              <span>Settings</span>
            </li>
          </ul>
        </div>
      </div>

      {responseText && (
        <div className="response-box">
          <h4>Response:</h4>
          <p>{responseText}</p>
        </div>
      )}
    </div>
  );
}

export default Slide_Bar;