/**
 * UI PRIMITIVES — Neo-Brutalist / Bauhaus
 * Reusable low-level UI atoms
 */

import { useState } from "react";

/* ── Label ── */
export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} style={{
      display: "block",
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "var(--charcoal)",
      marginBottom: 6,
    }}>
      {children}
    </label>
  );
}

/* ── Input ── */
export function Input({ value, onChange, placeholder, type = "text", min, max, style = {}, id }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id}
      type={type}
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        background: "var(--white)",
        border: focused ? "2px solid var(--red)" : "var(--border)",
        padding: "10px 12px",
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        color: "var(--black)",
        outline: "none",
        transition: "border-color 0.15s",
        boxShadow: focused ? "var(--shadow-red)" : "var(--shadow)",
        ...style,
      }}
    />
  );
}

/* ── Textarea ── */
export function Textarea({ value, onChange, placeholder, rows = 4, id }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      id={id}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        background: "var(--white)",
        border: focused ? "2px solid var(--red)" : "var(--border)",
        padding: "10px 12px",
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        color: "var(--black)",
        outline: "none",
        resize: "vertical",
        lineHeight: 1.7,
        transition: "border-color 0.15s",
        boxShadow: focused ? "var(--shadow-red)" : "var(--shadow)",
      }}
    />
  );
}

/* ── Select ── */
export function Select({ value, onChange, children, id }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        background: "var(--white)",
        border: focused ? "2px solid var(--red)" : "var(--border)",
        padding: "10px 12px",
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        color: "var(--black)",
        outline: "none",
        cursor: "pointer",
        boxShadow: focused ? "var(--shadow-red)" : "var(--shadow)",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23111' strokeWidth='2' fill='none'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        paddingRight: 36,
      }}
    >
      {children}
    </select>
  );
}

/* ── Button — Primary (filled black) ── */
export function ButtonPrimary({ children, onClick, fullWidth = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: "13px 28px",
        background: hovered ? "var(--red)" : "var(--black)",
        color: "var(--white)",
        border: "var(--border)",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        cursor: "pointer",
        boxShadow: hovered ? "var(--shadow-red)" : "var(--shadow)",
        transform: hovered ? "translate(-2px,-2px)" : "translate(0,0)",
        transition: "all 0.12s ease",
        outline: "none",
      }}
    >
      {children}
    </button>
  );
}

/* ── Button — Secondary (outlined) ── */
export function ButtonSecondary({ children, onClick, active = false }) {
  const [hovered, setHovered] = useState(false);
  const isActive = active || hovered;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        padding: "10px 16px",
        background: isActive ? "var(--black)" : "var(--white)",
        color: isActive ? "var(--white)" : "var(--black)",
        border: "var(--border)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor: "pointer",
        boxShadow: isActive ? "3px 3px 0 var(--red)" : "var(--shadow)",
        transition: "all 0.12s ease",
        outline: "none",
      }}
    >
      {children}
    </button>
  );
}

/* ── Card / Panel ── */
export function Panel({ children, accent = false, yellow = false, style = {} }) {
  return (
    <div style={{
      background: yellow ? "var(--yellow-pale)" : accent ? "var(--red-pale)" : "var(--off-white)",
      border: "var(--border)",
      borderLeft: accent ? "4px solid var(--red)" : yellow ? "4px solid var(--yellow)" : "var(--border)",
      padding: "16px 18px",
      boxShadow: "var(--shadow)",
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Badge / Tag ── */
export function Badge({ children, color = "black" }) {
  const colors = {
    black: { bg: "var(--black)", text: "var(--white)" },
    red:   { bg: "var(--red)",   text: "var(--white)" },
    blue:  { bg: "var(--blue)",  text: "var(--white)" },
  };
  const c = colors[color] || colors.black;
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      background: c.bg,
      color: c.text,
      fontFamily: "var(--font-mono)",
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
    }}>
      {children}
    </span>
  );
}

/* ── Divider ── */
export function Divider({ thick = false }) {
  return (
    <div style={{
      height: thick ? 3 : 1,
      background: "var(--black)",
      margin: "4px 0",
    }} />
  );
}

/* ── Copy button with feedback ── */
export function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handle} style={{
      padding: "6px 14px",
      background: copied ? "var(--black)" : "var(--white)",
      color: copied ? "var(--white)" : "var(--black)",
      border: "var(--border)",
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.1em",
      cursor: "pointer",
      transition: "all 0.15s",
      boxShadow: "2px 2px 0 var(--black)",
    }}>
      {copied ? "✓ COPIED" : "⊞ COPY"}
    </button>
  );
}
