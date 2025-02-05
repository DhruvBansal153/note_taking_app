import React, { useState } from "react";
import axios from "axios";

function NoteForm({ setNotes }) {
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/notes", { content, type: "text" }, { headers: { Authorization: localStorage.getItem("token") } });
    setNotes(prev => [res.data, ...prev]);
    setContent("");
  };

  const handleAudioSubmit = async (transcription) => {
    const res = await axios.post("http://localhost:5000/notes", { content: transcription, type: "audio" }, { headers: { Authorization: localStorage.getItem("token") } });
    setNotes(prev => [res.data, ...prev]);
  };

  const startRecording = () => {
    setIsRecording(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcription = event.results[0][0].transcript;
      handleAudioSubmit(transcription);
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="w-full border p-2 rounded mb-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        Add Note
      </button>
      <button type="button" onClick={startRecording} disabled={isRecording} className="bg-green-500 text-white px-4 py-2 rounded">
        {isRecording ? "Recording..." : "Record Audio Note"}
      </button>
    </form>
  );
}

export default NoteForm;
