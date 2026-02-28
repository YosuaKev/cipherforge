/**
 * CIPHER PANEL — Shared Layout Wrapper (Responsive)
 * Wraps all cipher components with consistent output/mode/steps UI
 */

import { useState } from "react";
import {
  Label, Panel, ButtonPrimary, ButtonSecondary,
  Badge, Divider, CopyButton,
} from "./Primitives";
import { useBreakpoint } from "../../hooks/useBreakpoint";

/* ── Step Log ── */
function StepLog({ steps }) {
  const [open, setOpen] = useState(false);
  if (!steps || steps.length === 0) return null;

  return (
    <div style={{ marginTop: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          background: "var(--paper)",
          border: "var(--border)",
          borderTop: "none",
          padding: "9px 16px",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.12em",
          color: "var(--charcoal)",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "2px 2px 0 var(--black)",
        }}
      >
        <span>PROCESS LOG — {steps.length} STEPS</span>
        <span style={{ fontSize: 12 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{
          border: "var(--border)",
          borderTop: "none",
          background: "var(--black)",
          maxHeight: 220,
          overflowY: "auto",
          boxShadow: "var(--shadow)",
        }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: i % 2 === 0 ? "#d4d4d4" : "#aaaaaa",
              padding: "5px 14px",
              borderBottom: "1px solid #222",
              lineHeight: 1.5,
              wordBreak: "break-all",
            }}>
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Result Box ── */
function ResultBox({ result, error }) {
  return (
    <div>
      <div style={{
        background: error ? "var(--red-pale)" : result ? "var(--black)" : "var(--paper)",
        border: "var(--border)",
        borderLeft: error ? "4px solid var(--red)" : result ? "4px solid var(--yellow)" : "var(--border)",
        minHeight: 90,
        padding: "14px 16px",
        boxShadow: "var(--shadow)",
      }}>
        {error ? (
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--red)",
            lineHeight: 1.6,
            wordBreak: "break-word",
          }}>
            ⚠ ERROR<br />
            <span style={{ color: "var(--red-dark)", fontWeight: 400 }}>{error}</span>
          </div>
        ) : result ? (
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--yellow)",
            letterSpacing: "0.1em",
            wordBreak: "break-all",
            lineHeight: 1.7,
          }}>
            {result}
          </div>
        ) : (
          <div style={{
            fontFamily: "var(--font-sans)",
            fontStyle: "italic",
            fontSize: 14,
            color: "var(--gray)",
            paddingTop: 6,
          }}>
            Output will appear here after processing…
          </div>
        )}
      </div>

      {result && !error && (
        <div style={{
          background: "var(--paper)",
          border: "var(--border)",
          borderTop: "none",
          padding: "8px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "var(--shadow)",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--charcoal)",
          }}>
            {result.length} CHARS
          </span>
          <CopyButton text={result} />
        </div>
      )}
    </div>
  );
}

/* ══ CIPHER PANEL ══ */
export function CipherPanel({
  title, cipherKey, badgeLabel, description, note,
  controls, onEncrypt, onDecrypt, result, error, steps,
}) {
  const [mode, setMode] = useState("encrypt");
  const { isMobile, isTablet } = useBreakpoint();
  const isSmall = isMobile || isTablet;

  const handleExecute = () => {
    mode === "encrypt" ? onEncrypt() : onDecrypt();
  };

  return (
    <div className="anim-slide-up">
      {/* ── Title block ── */}
      <div style={{ marginBottom: isSmall ? 20 : 28 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
          flexWrap: "wrap",
        }}>
          <h2 style={{
            fontFamily: "var(--font-mono)",
            fontSize: isMobile ? 18 : isTablet ? 22 : 28,
            fontWeight: 700,
            letterSpacing: "0.03em",
            color: "var(--black)",
            lineHeight: 1,
          }}>
            {title}
          </h2>
          <Badge color="red">{badgeLabel}</Badge>
          {!isMobile && <Badge color="black">{cipherKey}</Badge>}
        </div>
        <Divider thick />
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: isMobile ? 13 : 14,
          color: "var(--charcoal)",
          lineHeight: 1.7,
          marginTop: 10,
        }}>
          {description}
        </p>
      </div>

      {/* ── Layout: 2-col on desktop, 1-col on mobile/tablet ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr",
        gap: isSmall ? 20 : 24,
        alignItems: "start",
      }}>

        {/* LEFT — Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {controls}

          {/* Mode toggle */}
          <div>
            <Label>Operation Mode</Label>
            <div style={{ display: "flex", gap: 0, border: "var(--border)" }}>
              <ButtonSecondary active={mode === "encrypt"} onClick={() => setMode("encrypt")}>
                🔒 Encrypt
              </ButtonSecondary>
              <div style={{ width: 2, background: "var(--black)" }} />
              <ButtonSecondary active={mode === "decrypt"} onClick={() => setMode("decrypt")}>
                🔓 Decrypt
              </ButtonSecondary>
            </div>
          </div>

          {/* Execute */}
          <ButtonPrimary onClick={handleExecute} fullWidth>
            ▶ {mode === "encrypt" ? "Encrypt Message" : "Decrypt Message"}
          </ButtonPrimary>
        </div>

        {/* RIGHT — Output (on mobile: shows below controls) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div>
            <Label>Output Result</Label>
            <ResultBox result={result} error={error} />
          </div>

          <StepLog steps={steps} />

          {note && (
            <Panel yellow style={{ marginTop: 14 }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.15em",
                marginBottom: 4,
              }}>
                NOTE
              </div>
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--charcoal)",
                lineHeight: 1.6,
              }}>
                {note}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
