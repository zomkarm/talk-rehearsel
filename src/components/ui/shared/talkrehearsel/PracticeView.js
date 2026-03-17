"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from 'sonner'
import { Mic, Square, SkipForward, ArrowLeft, Loader2, PlayCircle } from "lucide-react";
import Portal from '@/components/ui/shared/Portal'

export default function PracticeView({
  situation,
  accent,
  selectedActor,
  onBack,
  onBackToRecordings
}) {
  const lines = [...situation.lines].sort((a, b) => a.order - b.order);
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState(false)

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

  const isProfileReady = !profileLoading && profile?.id
  const isPracticeLocked = profileLoading || !profile?.id


  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user', { credentials: 'include' })
        if (!res.ok) {
          setProfile(null)
          setProfileError(true)
          return
        }
        const data = await res.json()
        setProfile(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
        setProfileError(true)
      } finally {
        setProfileLoading(false)
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
    if (!isProfileReady) {
      toast.error('Please sign in to start practice')
      return
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
      <div className="flex flex-col items-center justify-center py-20 space-y-10 animate-in fade-in zoom-in-95 duration-700">
        {/* Celebration Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative w-24 h-24 bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 flex items-center justify-center border border-indigo-50">
            <span className="text-5xl">🎉</span>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Practice Complete
          </h2>
          <p className="text-slate-500 font-medium max-w-xs mx-auto">
            You've successfully finished the rehearsal for <span className="text-indigo-600 font-bold">{situation.title}</span>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <button
            onClick={onBackToRecordings}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-indigo-600 hover:-translate-y-0.5 transition-all"
          >
            View All Recordings
          </button>
          
          <button
            onClick={onBack}
            className="w-full py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            Back to Menu
          </button>
        </div>

        {/* Encouragement Badge */}
        <div className="pt-10">
          <div className="px-6 py-2 bg-emerald-50 rounded-full border border-emerald-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
              Session Saved Successfully
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Practice: {situation.title}
          </h2>
          <p className="text-slate-500 font-medium tracking-wide">
            Speak when it’s your turn — listen carefully otherwise.
          </p>
        </div>
        
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={3} />
          Exit Session
        </button>
      </div>

      {/* Primary Dialogue Card */}
      <div className={`
        relative overflow-hidden rounded-[3rem] p-10 md:p-16 transition-all duration-700
        ${isUserLine 
          ? "bg-white border-2 border-indigo-500 shadow-2xl shadow-indigo-200/50 scale-[1.02]" 
          : "bg-slate-50 border border-slate-100 opacity-90"}
      `}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isUserLine ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`} />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isUserLine ? 'text-indigo-600' : 'text-slate-500'}`}>
                {currentLine.actor.name}
              </span>
            </div>

            {!isUserLine && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm">
                <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{currentLine.actor.name} Speaking...</span>
              </div>
            )}
          </div>

          <p className={`text-2xl md:text-4xl font-bold leading-relaxed tracking-tight ${isUserLine ? 'text-slate-900' : 'text-slate-600 italic'}`}>
            "{currentLine.text}"
          </p>
        </div>
      </div>

      {/* User Control Section */}
      {isUserLine && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          
          {/* BEFORE RECORDING */}
          {!isRecording && !recordedUrl && (
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={startRecording}
                disabled={isPracticeLocked}
                className={`
                  group flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl
                  ${isPracticeLocked
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 hover:-translate-y-0.5'}
                `}
              >
                {profileLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Checking Access...</>
                ) : (
                  <><Mic className="w-4 h-4 transition-transform group-hover:scale-110" strokeWidth={3} /> Start Recording</>
                )}
              </button>

              {currentLine.voices.find(v => v.accent === accent)?.audio_src && (
                <button
                  onClick={() => {
                    const src = currentLine.voices.find(v => v.accent === accent).audio_src;
                    if (audioRef.current) audioRef.current.pause();
                    const audio = new Audio(src);
                    audioRef.current = audio;
                    audio.play();
                  }}
                  className="flex items-center gap-3 px-8 py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all"
                >
                  <PlayCircle className="w-4 h-4" strokeWidth={3} />
                  Play Reference
                </button>
              )}

              <button
                onClick={skipLine}
                className="flex items-center gap-3 px-8 py-4 border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all"
              >
                <SkipForward className="w-4 h-4" strokeWidth={3} />
                Skip
              </button>
            </div>
          )}

          {/* DURING RECORDING */}
          {isRecording && (
            <div className="flex items-center justify-between p-6 bg-red-50 border-2 border-red-100 rounded-[2rem]">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-4 h-4 bg-red-400 rounded-full animate-ping" />
                  <div className="relative w-3 h-3 bg-red-600 rounded-full" />
                </div>
                <span className="font-black text-xs text-red-600 uppercase tracking-widest">Recording Live Audio...</span>
              </div>

              <button
                onClick={stopRecording}
                className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100"
              >
                <Square className="w-4 h-4" fill="currentColor" /> Stop
              </button>
            </div>
          )}

          {/* AFTER RECORDING */}
          {recordedUrl && (
            <div className="p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Playback Ready</span>
              </div>
              
              <audio controls src={recordedUrl} className="w-full h-12 brightness-90 contrast-125" />

              <div className="flex gap-4">
                <button
                  onClick={() => setRecordedUrl(null)}
                  className="flex-1 py-4 bg-white/10 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
                >
                  Retry Recording
                </button>

                <button
                  onClick={goNext}
                  className="flex-1 py-4 bg-indigo-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 transition-all"
                >
                  Continue Session
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
