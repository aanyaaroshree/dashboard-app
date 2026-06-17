"use client";

import { useRef, useState, useEffect } from "react";
import "./page.css";

export default function Dashboard() {
const [time, setTime] = useState("");

const [logs, setLogs] = useState<string[]>([]);

const videoRef = useRef<HTMLVideoElement>(null);

const streamRef = useRef<MediaStream | null>(null);

const addLog = (message: string) => {


setLogs((prev) => {

  const updated = [...prev, message];

  if (updated.length > 6) {
    updated.shift();
  }

  return updated;
});


};

const handleStart = async () => {


if (
  streamRef.current &&
  streamRef.current.active
) {
  addLog("Camera is running");
  return;
}

try {

  const stream =
    await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

  streamRef.current = stream;

  if (videoRef.current) {
    videoRef.current.srcObject = stream;
  }

  addLog("Button [Start] Clicked");

} catch (error) {

  console.error(error);

  addLog("Camera Access Denied");
}


};

const handleStop = () => {


const stream = streamRef.current;

if (!stream || !stream.active) {
  addLog("Camera is off.");
  return;
}

stream
  .getTracks()
  .forEach((track) => track.stop());

if (videoRef.current) {
  videoRef.current.srcObject = null;
}

streamRef.current = null;

addLog("Button [Stop] Clicked");


};

const handleCapture = () => {


const stream = streamRef.current;

if (!stream || !stream.active) {
  addLog("Camera is not running");
  return;
}

const flash =
  document.getElementById("flash");

flash?.classList.add("flash-animation");

setTimeout(() => {

  flash?.classList.remove(
    "flash-animation"
  );

}, 300);

addLog("Button [Capture] Clicked");


};
useEffect(() => {

  const updateClock = () => {

    const now = new Date();

    setTime(
      now.toLocaleTimeString()
    );
  };

  updateClock();

  const interval =
    setInterval(updateClock, 1000);

  return () =>
    clearInterval(interval);

}, []);

return (


<div className="dashboard">

  <div className="top-icons">
    <span title="Start">▶</span>
    <span title="Stop">⏸</span>
    <span title="Capture">📷</span>
  </div>
  <div className="clock">
  {time}
</div>

  <h1>Hi There!</h1>

  <div className="container">

    <div className="video-section">

      <video
        ref={videoRef}
        autoPlay
        playsInline
      />

      <p>
        Click the buttons below to control the video!
      </p>

      <div className="controls">

        <button onClick={handleStart}>
          Start
        </button>

        <button onClick={handleStop}>
          Stop
        </button>

        <button onClick={handleCapture}>
          Capture
        </button>

      </div>

    </div>

    <div className="sidebar">

      <h3>Activity Log</h3>

      <ul className="logList">

        {logs.map((log, index) => (

          <li key={index}>
            {log}
          </li>

        ))}

      </ul>

    </div>

  </div>

  <div id="flash"></div>

</div>


);
}