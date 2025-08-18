import Terminal from "./components/Terminal.jsx";
import { profile } from "./data/config.js";

export default function App() {
  return (
    <div className="terminal-wrapper" data-theme="cyber">
      <div className="terminal-frame">
        <div className="titlebar">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
          <span className="title">{profile.promptHost} — terminal</span>
        </div>
        <div className="screen">
          <Terminal />
        </div>
      </div>
      <footer className="footer">
        © {new Date().getFullYear()} {profile.name} • built with Vite • theme: <code>terminal</code>
      </footer>
    </div>
  );
}
