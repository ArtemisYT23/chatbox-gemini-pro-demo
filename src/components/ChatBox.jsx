import { useState } from "react";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  const generateConfig = {
    stopSequence: ["\n"],
    maxOutputToken: 100,
    maxTokens: 100,
    doSample: true,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    bestOf: 1,
    n: 1,
    stop: ["\n", " Human:", " AI:"],
    safetySettings: safetySettings,
  };

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelchat = genAI.getGenerativeModel({
    model: "gemini-pro",
    generateConfig,
    safetySettings,
  });

  const chatHistory = modelchat.startChat({
    history: [],
  });

  const handleChat = async () => {
    setLoading(true)
    try {
      const result = await chatHistory.sendMessage(chat);
      const response = await result.response;
      setChatResponse(response.text());
      setChat("")
      const data = await chatHistory.getHistory();
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Chat Box</h1>
      <input
        type="text"
        value={chat}
        onChange={(e) => setChat(e.target.value)}
      />
      <button type="button" onClick={handleChat}>
        Generate chat
      </button>

      {loading && <p>Loading...</p>}
      {chatResponse && <p>{chatResponse}</p>}
    </div>
  );
}

export default App;
