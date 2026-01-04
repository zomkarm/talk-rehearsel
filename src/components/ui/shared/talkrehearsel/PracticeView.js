"use client";

import { useEffect, useRef, useState } from "react";

export default function PracticeView({
  situation,
  accent,
  selectedActor,
  onBack
}) {
  const lines = [...situation.lines].sort((a, b) => a.order - b.order);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const currentLine = lines[currentIndex];
  if (!currentLine || !currentLine.actor || !selectedActor) {
    return null;
  }

  const isUserLine = currentLine.actor.id === selectedActor.id;


  /* -----------------------------
     Auto-play system lines
  ----------------------------- */
  useEffect(() => {
    if (!currentLine || isUserLine) return;

    const voice = currentLine.voices.find(v => v.accent === accent);
    if (voice?.audio_src) {
      const audio = new Audio(voice.audio_src);
      audio.play();
    }
  }, [currentIndex]);

  /* -----------------------------
     Recording (optional)
  ----------------------------- */
  async function startRecording() {
    chunksRef.current = [];
    setRecordedUrl(null);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setRecordedUrl(URL.createObjectURL(blob));
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  function nextLine() {
    setRecordedUrl(null);
    setCurrentIndex(i => i + 1);
  }

  if (!currentLine) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold">Practice complete 🎉</h2>
        <button className="mt-4 underline" onClick={onBack}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">
        Practice: {situation.title}
      </h2>

      <div className="border rounded-lg p-6 bg-gray-50">
        <p className="text-sm text-gray-500 mb-1">
          {currentLine.actor.name}
        </p>
        <p className="text-lg">{currentLine.text}</p>
      </div>

      {isUserLine ? (
        <div className="space-y-3">
          {!isRecording && (
            <button
              onClick={startRecording}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Record (optional)
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Stop
            </button>
          )}

          {recordedUrl && <audio controls src={recordedUrl} />}

          <button
            onClick={nextLine}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Continue
          </button>
        </div>
      ) : (
        <button
          onClick={nextLine}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Next
        </button>
      )}

      <button className="text-sm underline" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
