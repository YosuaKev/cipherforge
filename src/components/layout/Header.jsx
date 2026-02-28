/**
 * HEADER — Neo-Brutalist sticky header (Responsive)
 */

import { useBreakpoint } from "../../hooks/useBreakpoint";

export default function Header({ onMenuToggle, menuOpen }) {
  const { isMobile, isTablet } = useBreakpoint();
  const isSmall = isMobile || isTablet;

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "var(--black)",
      borderBottom: "3px solid var(--red)",
      boxShadow: "0 3px 0 var(--red)",
    }}>
      {/* Ticker tape */}
      <div style={{
        background: "var(--red)",
        overflow: "hidden",
        height: 24,
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: "marquee 22s linear infinite",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: "var(--white)",
        }}>
          {Array(3).fill(null).map((_, i) => (
            <span key={i} style={{ marginRight: 48 }}>
              VIGENERE CIPHER · AFFINE CIPHER · PLAYFAIR CIPHER · HILL CIPHER · ENIGMA MACHINE · CLASSICAL CRYPTOGRAPHY ·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Main header row */}
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: isMobile ? "0 16px" : isTablet ? "0 24px" : "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: isMobile ? 52 : 64,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: isMobile ? 20 : 26,
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "var(--white)",
          }}>
            CIPHER
          </span>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: isMobile ? 20 : 26,
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "var(--red)",
            marginLeft: 2,
          }}>
            FORGE
          </span>
          {!isMobile && (
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--gray)",
              marginLeft: 14,
              borderLeft: "2px solid var(--charcoal)",
              paddingLeft: 14,
              letterSpacing: "0.12em",
            }}>
              {isTablet ? "v3.0" : "v3.0 · ENCRYPTION LABORATORY"}
            </span>
          )}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Badges — hide on mobile */}
          {!isMobile && (
            <>
              <div style={{
                background: "var(--yellow)",
                color: "var(--black)",
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.15em",
                padding: "4px 10px",
                border: "2px solid var(--yellow)",
              }}>
                5 CIPHERS
              </div>
              {!isTablet && (
                <div style={{
                  color: "var(--gray)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  padding: "4px 10px",
                  border: "2px solid var(--charcoal)",
                }}>
                  REACT + VITE
                </div>
              )}
            </>
          )}

          {/* Hamburger — visible on tablet + mobile */}
          {isSmall && (
            <button
              onClick={onMenuToggle}
              aria-label="Toggle cipher menu"
              style={{
                background: menuOpen ? "var(--red)" : "transparent",
                border: "2px solid var(--gray)",
                color: "var(--white)",
                width: 40,
                height: 36,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                padding: "6px 8px",
                transition: "background 0.15s",
              }}
            >
              {menuOpen ? (
                <span style={{ fontSize: 16, lineHeight: 1, color: "var(--white)" }}>✕</span>
              ) : (
                <>
                  <span style={{ display: "block", width: 18, height: 2, background: "var(--white)" }} />
                  <span style={{ display: "block", width: 18, height: 2, background: "var(--white)" }} />
                  <span style={{ display: "block", width: 12, height: 2, background: "var(--white)" }} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
