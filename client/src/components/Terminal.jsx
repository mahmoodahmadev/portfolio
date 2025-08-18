import { useEffect, useRef, useState } from "react";
import { profile } from "../data/config.js";
import { blogs } from "../data/blogs.js";
import { projects } from "../data/projects.js";
import { services } from "../data/services.js";
import { resume } from "../data/resume.js";

const sortBlogs = [...blogs].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);
const projectNames = projects.map((p) => p.title);

export default function Terminal() {
  const [lines, setLines] = useState(() => [
    `Welcome to ${profile.name}'s terminal.`,
    `Type 'help' to explore — try 'projects', 'blogs', 'resume'.`,
    "",
  ]);
  const [theme, setTheme] = useState("cyber"); // cyber | matrix
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [hIndex, setHIndex] = useState(-1);
  const screenRef = useRef(null);

  useEffect(() => {
    document
      .querySelector(".terminal-wrapper")
      ?.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    screenRef.current?.scrollTo(0, screenRef.current.scrollHeight);
  }, [lines]);

  // ------- helpers -------
  const print = (...outs) => setLines((prev) => [...prev, ...outs.flat()]);
  const cmdEcho = (cmd) => print(`$ ${cmd}`);

  const link = (label, url) =>
    `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`;
  const render = (text) => (
    <pre className="line" dangerouslySetInnerHTML={{ __html: text }} />
  );

  // ------- commands -------
  const registry = {
    help() {
      return [
        "Available commands:",
        "  help            → show this help",
        "  banner          → show the banner",
        "  whoami / about  → about me",
        "  resume          → education, skills, experience",
        "  services        → what I offer",
        "  projects        → list projects",
        "  blogs           → list blogs",
        "  cat blog <id>   → read blog post",
        "  cat project <name> → read project details",
        "  ls              → list sections",
        "  open <url>      → open link",
        "  social          → social links",
        "  theme <cyber|matrix> → switch theme",
        "  date / time     → show date/time",
        "  clear           → clear screen",
      ];
    },
    banner() {
      return [
        "████████╗███████╗██████╗  █████╗  ██████╗ ",
        "╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔════╝ ",
        "   ██║   █████╗  ██████╔╝███████║██║  ███╗",
        "   ██║   ██╔══╝  ██╔══██╗██╔══██║██║   ██║",
        "   ██║   ███████╗██║  ██║██║  ██║╚██████╔╝",
        "   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ",
        `:: ${profile.name} — ${profile.role}`,
        "",
      ];
    },
    about() {
      return [
        `${profile.name} — ${profile.role}`,
        profile.motto ? `"${profile.motto}"` : "",
        "",
      ].filter(Boolean);
    },
    whoami() {
      return registry.about();
    },

    resume() {
      const edu = resume.education.map((e) => `- ${e}`);
      const skills = `Skills: ${resume.skills.join(", ")}`;
      const exp = resume.experience.flatMap((e) => [
        `• ${e.role} @ ${e.company} (${e.years})`,
        ...e.bullets.map((b) => `   - ${b}`),
      ]);
      return [
        "== Education ==",
        ...edu,
        "",
        "== Skills ==",
        skills,
        "",
        "== Experience ==",
        ...exp,
      ];
    },

    services() {
      return services.map((s) => `• <b>${s.name}</b> — ${s.desc}`);
    },

    projects() {
      return projects.map(
        (p) => `• <b>${p.title}</b> — ${p.desc} [${link("repo", p.repo)}]`
      );
    },

    blogs() {
      return sortBlogs.map(
        (b) =>
          `${b.id}. <b>${b.title}</b> — <span class="small">${
            b.date
          }</span>  [${b.tags.join(", ")}]`
      );
    },

    cat(args) {
      const [what, ...rest] = args;
      if (what === "blog") {
        const id = parseInt(rest[0], 10);
        const b = sortBlogs.find((x) => x.id === id);
        return b ? [formatMd(b.content)] : [`No blog found with id ${rest[0]}`];
      }
      if (what === "project") {
        const name = rest.join(" ");
        const p = projects.find(
          (x) => x.title.toLowerCase() === name.toLowerCase()
        );
        return p
          ? [
              `<b>${p.title}</b>`,
              p.details?.trim() || p.desc,
              `Repo: ${link(p.repo, p.repo)}`,
            ]
          : [`No project found with name '${name}'`];
      }
      return ["Usage: cat blog <id> | cat project <name>"];
    },

    ls() {
      return [
        "Sections:\n",
        "  resume",
        "  services","  projects","  blogs "," contact",
        "",
      ];
    },

    open(args) {
      const url = (args || []).join(" ");
      if (!/^https?:\/\//i.test(url))
        return ["Usage: open https://example.com"];
      try {
        window.open(url, "_blank", "noopener,noreferrer");
        return [`Opening ${url}...`];
      } catch {
        return ["Failed to open URL"];
      }
    },

    social() {
      const out = [];
      if (profile.email)
        out.push(`Email: ${link(profile.email, `mailto:${profile.email}`)}`);
      Object.entries(profile.socials || {}).forEach(([k, v]) => {
        out.push(`${k}: ${link(v, v)}`);
      });
      return out.length ? out : ["No socials configured."];
    },

    contact() {
      return registry.social();
    },

    theme(args) {
      const choice = (args[0] || "").toLowerCase();
      if (!["cyber", "matrix"].includes(choice))
        return ["Usage: theme cyber | theme matrix"];
      setTheme(choice);
      return [`Theme set to ${choice}.`];
    },

    date() {
      return [new Date().toDateString()];
    },
    time() {
      return [new Date().toLocaleTimeString()];
    },

    clear() {
      setLines([]);
      return [];
    },
  };

  // Aliases
  const aliases = {
    "?": "help",
    h: "help",
    about: "about",
    whoami: "whoami",
    blog: "blogs",
    posts: "blogs",
    proj: "projects",
    ls: "ls",
    social: "social",
    contact: "contact",
    resume: "resume",
    services: "services",
    projects: "projects",
    blogs: "blogs",
  };

  // Autocomplete list
  const commandList = [
    "help",
    "banner",
    "about",
    "whoami",
    "resume",
    "services",
    "projects",
    "blogs",
    "cat",
    "ls",
    "open",
    "social",
    "contact",
    "theme",
    "date",
    "time",
    "clear",
  ];

  // ------- input handling -------
  const handleSubmit = (e) => {
    e.preventDefault();
    const raw = input.trim();
    if (!raw) return;
    cmdEcho(raw);
    setHistory((h) => [raw, ...h]);
    setHIndex(-1);
    setInput("");

    const [cmd, ...rest] = tokenize(raw);
    const base = (aliases[cmd] || cmd).toLowerCase();

    if (base in registry) {
      const out = registry[base](rest);
      if (out && out.length) print(...out);
    } else {
      print(`Command not found: ${cmd}. Try 'help'.`);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(history.length - 1, hIndex + 1);
      if (next >= 0) {
        setHIndex(next);
        setInput(history[next] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(-1, hIndex - 1);
      setHIndex(next);
      setInput(next === -1 ? "" : history[next] || "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.split(" ").filter(Boolean);
      if (parts.length <= 1) {
        const prefix = (parts[0] || "").toLowerCase();
        const matches = commandList.filter((c) => c.startsWith(prefix));
        if (matches.length === 1) setInput(matches[0] + " ");
        else if (matches.length > 1) print(matches.join("  "));
      } else if (
        parts.length >= 2 &&
        parts[0] === "cat" &&
        parts[1] === "project"
      ) {
        const prefix = (parts.slice(2).join(" ") || "").toLowerCase();
        const matches = projectNames.filter((n) =>
          n.toLowerCase().startsWith(prefix)
        );
        if (matches.length === 1) setInput(`cat project ${matches[0]}`);
        else if (matches.length > 1) print(matches.join("  "));
      }
    }
  };

  return (
    <>
      {lines.map((l, i) => (
        <pre
          key={i}
          className="line"
          ref={i === lines.length - 1 ? screenRef : null}
        >
          {l}
        </pre>
      ))}
      <form onSubmit={handleSubmit} className="input-row">
        <span className="prompt">
          {profile.promptUser}@{profile.promptHost}:~$
        </span>
        <input
          className="term-input caret"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          autoComplete="off"
          spellCheck="false"
          aria-label="terminal input"
        />
      </form>
      <div className="hint small">
        Try <kbd>help</kbd> • history <kbd>↑</kbd>/<kbd>↓</kbd> • autocomplete{" "}
        <kbd>Tab</kbd>
      </div>
    </>
  );
}

// ---------------- utils ----------------
function tokenize(str) {
  // simple tokenizer: split on spaces but keep quoted segments
  const tokens = [];
  let cur = "",
    inQ = false;
  for (const ch of str) {
    if (ch === '"' || ch === "'") {
      inQ = !inQ;
      continue;
    }
    if (ch === " " && !inQ) {
      if (cur) {
        tokens.push(cur);
        cur = "";
      }
    } else cur += ch;
  }
  if (cur) tokens.push(cur);
  return tokens;
}

function formatMd(md = "") {
  // very tiny MD-ish formatter for headers + bullets + code fences
  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = md.trim().split("\n");
  return lines
    .map((line) => {
      if (/^#\s+/.test(line)) return `<b>${esc(line.replace(/^#\s+/, ""))}</b>`;
      if (/^-\s+/.test(line)) return `• ${esc(line.replace(/^-\s+/, ""))}`;
      if (/^\d+\.\s+/.test(line)) return `${esc(line)}`;
      return esc(line);
    })
    .join("\n");
}
