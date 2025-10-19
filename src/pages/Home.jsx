import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [uploadText, setText] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const text = inputText.trim() || uploadText.trim();
    if (!text) return;
    sessionStorage.setItem("reader_text", text);
    navigate("/reader", { state: { text } });
  }

  function handleFile(file) {
    if (!file) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      const content = fileReader.result;

      if (content && content.trim()) {
        setText(content);
      }
    };
    fileReader.readAsText(file);
  }

  return (
    <div className="home-container">
      <h1>Home</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="textInput" className="home-label">
          Input or upload your text:
        </label>
        <div className="input-group mb-3">
          <label className="input-group-text" htmlFor="inputGroupFile01">
            Upload
          </label>
          <input 
            type="file" 
            className="form-control" 
            id="inputGroupFile01" 
            accept=".txt"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
        <textarea
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
