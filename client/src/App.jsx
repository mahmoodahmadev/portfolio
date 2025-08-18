import { useEffect, useState } from "react";
import Terminal from "./components/Terminal.jsx";
import { profile } from "./data/config.js";

export default function App() {
  const bootDate = new Date("2023-12-13T11:00:00");
  const [uptime, setUptime] = useState("");

  useEffect(() => {
    const updateUptime = () => {
      const now = new Date();
      const diff = Math.floor((now - bootDate) / 1000); // seconds since boot

      const days = Math.floor(diff / (24 * 3600));
      const hours = Math.floor((diff % (24 * 3600)) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      const formatted = `${days} days, ${hours.toString().padStart(2,"0")}:${minutes
        .toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;

      setUptime(formatted);
    };

    updateUptime();
    const interval = setInterval(updateUptime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-wrapper" data-theme="cyber">
      <div className="terminal-frame">
        <div className="titlebar">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
          <span className="title">Welcome to my portfolio</span>
        </div>
        <div className="screen">
          <Terminal />
        </div>
      </div>
      <footer className="footer">
        System uptime: {uptime}
      </footer>
    </div>
  );
}
