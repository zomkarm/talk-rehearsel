"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from 'sonner'
import { Mic, Square, SkipForward, ArrowLeft, Loader2 } from "lucide-react";

export default function PracticeView({
  situation,
  accent,
  selectedActor,
  onBack
}) {
  const lines = [...situation.lines].sort((a, b) => a.order - b.order);
  const [profile, setProfile] = useState(null)
  const streamRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const currentLine = lines[currentIndex];

  const isReady = currentLine && selectedActor;

  const isUserLine = isReady
    ? currentLine.actor.id === selectedActor.id
    : false;

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        setProfile(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }
    fetchProfile()
  }, [])

  /* -----------------------------
     Auto-play system lines
  ----------------------------- */
  useEffect(() => {
    if (!isReady) return;
    if (isUserLine) return;

    const voice = currentLine.voices.find(v => v.accent === accent);
    if (!voice?.audio_src) {
      goNext();
      return;
    }

    audioRef.current?.pause();

    const audio = new Audio(voice.audio_src);
    audioRef.current = audio;

    audio.onended = goNext;
    audio.play().catch(() => {
      // play was interrupted — safe to ignore
    });


    return () => audio.pause();
  }, [currentIndex, isReady]);

  /* -----------------------------
     Recording
  ----------------------------- */
  async function startRecording() {
    if(!profile.id){
      toast.error('Please Signin for Practice')
      return;
    }
    chunksRef.current = [];
    setRecordedUrl(null);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const recorder = new MediaRecorder(stream);


    recorder.ondataavailable = e => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const localUrl = URL.createObjectURL(blob);
      setRecordedUrl(localUrl);
      
      const formData = new FormData();
      formData.append("user_id", profile.id);
      formData.append("line_id", currentLine.id);
      formData.append("audio", blob, "recording.webm");

      try {
        const res = await fetch("/api/talkrehearsel/recordings", {
          method: "POST",
          body: formData,
        });
        console.log(res)
        if(res){
          toast.success('Recording Saved Successfully.')
        }else{
          toast.error('Failed to Record !!')
        }
      } catch (err) {
        console.error("Failed to save recording", err);
      }
    };


    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
  }

  useEffect(() => {
    return () => {
      // stop recorder
      mediaRecorderRef.current?.stop();

      // stop mic
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // stop any playing audio
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);



  /* -----------------------------
     Navigation
  ----------------------------- */
  function goNext() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current = null;
    }

    setRecordedUrl(null);
    setIsRecording(false);
    setCurrentIndex(i => i + 1);
  }


  function skipLine() {
    // later: store skipped=true
    goNext();
  }

  /* -----------------------------
     Completion
  ----------------------------- */
  if (currentIndex >= lines.length) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">Practice complete 🎉</h2>
        <button className="underline" onClick={onBack}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Practice: {situation.title}
        </h2>
        <p className="text-sm text-slate-500">
          Speak when it’s your turn — listen carefully otherwise
        </p>
      </div>

      {/* Current Line */}
      <div
        className={`
          p-6 rounded-xl border
          transition
          ${isUserLine
            ? "bg-indigo-50 border-indigo-300"
            : "bg-white/70 border-white/40"}
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-indigo-600">
            {currentLine.actor.name}
          </span>

          {!isUserLine && (
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-3 h-3 animate-spin" />
              Listening…
            </span>
          )}
        </div>

        <p className="text-lg text-slate-800 leading-relaxed">
          {currentLine.text}
        </p>
      </div>

      {/* User Line Controls */}
      {isUserLine && (
        <div className="space-y-4">
          {!isRecording && !recordedUrl && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={startRecording}
                className="
                  flex items-center gap-2
                  px-5 py-2.5
                  bg-green-600 text-white
                  rounded-lg
                  hover:bg-green-700
                "
              >
                <Mic className="w-4 h-4" />
                Start Recording
              </button>

              <button
                onClick={skipLine}
                className="
                  flex items-center gap-2
                  px-5 py-2.5
                  border rounded-lg
                  text-slate-600
                  hover:bg-slate-50
                "
              >
                <SkipForward className="w-4 h-4" />
                Skip
              </button>
            </div>
          )}

          {isRecording && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-red-600 font-medium">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                Recording…
              </div>

              <button
                onClick={stopRecording}
                className="
                  flex items-center gap-2
                  px-5 py-2.5
                  bg-red-600 text-white
                  rounded-lg
                  hover:bg-red-700
                "
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            </div>
          )}

          {recordedUrl && (
            <div className="space-y-3">
              <audio
                controls
                src={recordedUrl}
                className="w-full rounded"
              />

              <button
                onClick={goNext}
                className="
                  px-5 py-2.5
                  bg-indigo-600 text-white
                  rounded-lg
                  hover:bg-indigo-700
                "
              >
                Continue
              </button>
            </div>
          )}
        </div>
      )}

      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
    </div>
  );

}
