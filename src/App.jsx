import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const apiKey = import.meta.env.VITE_API_KEY
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);


  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });


const handleClick = async () => {
  setLoading(true);
  try {
    const result = await model.generateContentStream(text); 
    const response = await result.response;
    setPrompt(response.text())
    setText("");
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
}

  return (
    <div>
      <h1>Text Prompt</h1>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)}/>
      <button type="button" onClick={handleClick}>Search</button>

      {loading && <p>Loading...</p>}
      {prompt && <p>{prompt}</p>}
    </div>
  );
}

export default App;
