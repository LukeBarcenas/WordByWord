import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;
    sessionStorage.setItem("reader_text", text);
    navigate("/reader", { state: { text } });
  }

  return (
    <div className="home-container">
      <h1>Home</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="textInput" className="home-label">
          Input your text:
        </label>
        <input
          id="textInput"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type something..."
          className="home-input"
        />
        <button type="submit" className="home-button">
          Start reading
        </button>
      </form>
    </div>
  );
}
