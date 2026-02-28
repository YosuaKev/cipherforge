/**
 * APP ROOT — CipherForge v3
 * Neo-Brutalist / Bauhaus theme · Fully Responsive
 */

import { useState } from "react";
import Header from "./components/layout/Header";
import Sidebar, { CIPHERS } from "./components/layout/Sidebar";
import VigenereCipher from "./components/ciphers/VigenereCipher";
import AffineCipher   from "./components/ciphers/AffineCipher";
import PlayfairCipher from "./components/ciphers/PlayfairCipher";
import HillCipher     from "./components/ciphers/HillCipher";
import EnigmaCipher   from "./components/ciphers/EnigmaCipher";
import { useBreakpoint } from "./hooks/useBreakpoint";

function renderCipher(id) {
  switch (id) {
    case "vigenere": return <VigenereCipher />;
    case "affine":   return <AffineCipher />;
    case "playfair": return <PlayfairCipher />;
    case "hill":     return <HillCipher />;
    case "enigma":   return <EnigmaCipher />;
    default:         return null;
  }
}

export default function App() {
  const [active, setActive]     = useState("vigenere");
  const [renderKey, setKey]     = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const isSmall = isMobile || isTablet;

  const handleSelect = (id) => {
    setActive(id);
    setKey(k => k + 1);
    setMenuOpen(false);
  };

  const activeCipher = CIPHERS.find(c => c.id === active);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ─────────────── HEADER ─────────────── */}
      <Header
        onMenuToggle={() => setMenuOpen(o => !o)}
        menuOpen={menuOpen}
      />

      {/* ─────────────── BODY ─────────────── */}
      <div style={{
        display: "flex",
        flex: 1,
        maxWidth: 1280,
        width: "100%",
        margin: "0 auto",
        /* Only show outer border on desktop */
        borderLeft:  isDesktop ? "var(--border)" : "none",
        borderRight: isDesktop ? "var(--border)" : "none",
        position: "relative",
      }}>

        {/* ── DESKTOP: inline sidebar inside layout flow ── */}
        {isDesktop && (
          <Sidebar
            active={active}
            onSelect={handleSelect}
            isDrawer={false}
          />
        )}

        {/* ── MOBILE / TABLET: overlay drawer sidebar (portal-like, fixed) ── */}
        {isSmall && (
          <Sidebar
            active={active}
            onSelect={handleSelect}
            isDrawer={true}
            drawerOpen={menuOpen}
            onDrawerClose={() => setMenuOpen(false)}
          />
        )}

        {/* ── MAIN CONTENT ── */}
        <main style={{
          flex: 1,
          minWidth: 0,
          padding: isMobile
            ? "20px 16px 100px"   /* extra bottom for mobile nav bar */
            : isTablet
              ? "28px 24px 40px"
              : "36px 40px 60px",
          overflowX: "hidden",
        }}>
          {/* Breadcrumb */}
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--gray)",
            letterSpacing: "0.12em",
            marginBottom: isSmall ? 16 : 28,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}>
            <span>CIPHERFORGE</span>
            <span style={{ color: "var(--red)" }}>/</span>
            <span style={{ color: "var(--charcoal)", fontWeight: 700 }}>
              {activeCipher?.label.toUpperCase() ?? active.toUpperCase()}
            </span>
            {isSmall && activeCipher && (
              <>
                <span style={{ color: "var(--red)" }}>·</span>
                <span style={{ color: "var(--gray)" }}>{activeCipher.sub}</span>
              </>
            )}
          </div>

          {/* Cipher panel — key forces remount + fresh animation on tab switch */}
          <div key={renderKey}>
            {renderCipher(active)}
          </div>
        </main>
      </div>

      {/* ─────────────── MOBILE BOTTOM NAV ─────────────── */}
      {isMobile && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          background: "var(--black)",
          borderTop: "2px solid var(--red)",
          display: "flex",
          boxShadow: "0 -3px 0 var(--red)",
        }}>
          {CIPHERS.map((c) => {
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                style={{
                  flex: 1,
                  padding: "8px 2px 6px",
                  background: isActive ? "var(--red)" : "transparent",
                  border: "none",
                  borderRight: "1px solid #2a2a2a",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  transition: "background 0.15s",
                  minHeight: 52,
                  justifyContent: "center",
                }}
              >
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 7,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: isActive ? "rgba(255,255,255,0.7)" : "var(--gray)",
                }}>
                  {c.num}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: isActive ? "var(--white)" : "var(--gray-light)",
                }}>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ─────────────── FOOTER ─────────────── */}
      <footer style={{
        borderTop: "var(--border)",
        background: "var(--black)",
        width: "100%",
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: isMobile ? "12px 16px 70px" : "14px 40px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: isMobile ? 4 : 0,
          /* Match the body border so footer text aligns inside the sidebar+main frame */
          borderLeft:  isDesktop ? "var(--border)" : "none",
          borderRight: isDesktop ? "var(--border)" : "none",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--gray)",
            letterSpacing: "0.12em",
          }}>
            CIPHERFORGE v3.0 · NEO-BRUTALIST EDITION
          </span>
          {!isSmall && (
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--gray)",
              letterSpacing: "0.08em",
            }}>
              Yosua Kevan Unggul Budihardjo | 21120123120006
            </span>
          )}
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--red)",
            letterSpacing: "0.12em",
            fontWeight: 700,
          }}>
            REACT + VITE · 2026
          </span>
        </div>
      </footer>
    </div>
  );
}
