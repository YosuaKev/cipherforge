/**
 * SIDEBAR NAVIGATION — Cipher selector
 *
 * Two modes, controlled by parent:
 *   isDrawer={false}  → Desktop: static inline left rail (normal flow)
 *   isDrawer={true}   → Mobile/Tablet: fixed overlay drawer
 *
 * Props:
 *   active         string   — current cipher id
 *   onSelect       fn       — called with cipher id when item clicked
 *   isDrawer       bool     — true = drawer, false = inline rail
 *   drawerOpen     bool     — (drawer mode only) is drawer visible?
 *   onDrawerClose  fn       — (drawer mode only) close callback
 */

import { useBreakpoint } from "../../hooks/useBreakpoint";

export const CIPHERS = [
  { id: "vigenere", num: "01", label: "Vigenère",  sub: "Polyalphabetic",  tag: "KEY"  },
  { id: "affine",   num: "02", label: "Affine",    sub: "Linear Function", tag: "MATH" },
  { id: "playfair", num: "03", label: "Playfair",  sub: "Digraph Matrix",  tag: "GRID" },
  { id: "hill",     num: "04", label: "Hill",      sub: "Matrix Algebra",  tag: "MAT"  },
  { id: "enigma",   num: "05", label: "Enigma",    sub: "Rotor Machine",   tag: "MECH" },
];

/* ─── shared list of nav items ─── */
function NavList({ active, onSelect }) {
  return (
    <>
      <div style={{
        padding: "12px 16px 8px",
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.22em",
        color: "var(--gray)",
        borderBottom: "1px solid var(--gray-pale)",
        marginBottom: 4,
      }}>
        SELECT CIPHER
      </div>

      {CIPHERS.map((c) => {
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "none",
              borderBottom: "1px solid var(--gray-pale)",
              borderLeft: isActive ? "4px solid var(--red)" : "4px solid transparent",
              background: isActive ? "var(--white)" : "transparent",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              transition: "background 0.12s",
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--paper)"; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: isActive ? "var(--red)" : "var(--gray-light)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}>
                  {c.num}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: isActive ? "var(--black)" : "var(--charcoal)",
                }}>
                  {c.label}
                </span>
              </div>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.12em",
                padding: "2px 6px",
                background: isActive ? "var(--red)" : "var(--paper)",
                color: isActive ? "var(--white)" : "var(--gray)",
                border: "1px solid var(--gray-pale)",
                flexShrink: 0,
              }}>
                {c.tag}
              </span>
            </div>
            <span style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              color: "var(--gray)",
              paddingLeft: 22,
            }}>
              {c.sub}
            </span>
          </button>
        );
      })}

      <div style={{
        padding: "14px 16px",
        marginTop: 4,
        borderTop: "1px solid var(--gray-pale)",
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        color: "var(--gray-light)",
        lineHeight: 1.9,
        letterSpacing: "0.06em",
      }}>
      </div>
    </>
  );
}

/* ─── main export ─── */
export default function Sidebar({
  active,
  onSelect,
  isDrawer,
  drawerOpen,
  onDrawerClose,
}) {
  const { isMobile } = useBreakpoint();

  /* ══ DESKTOP: static inline rail ══ */
  if (!isDrawer) {
    return (
      <nav style={{
        width: 220,
        flexShrink: 0,
        borderRight: "var(--border)",
        background: "var(--off-white)",
        paddingTop: 8,
        /* Stick to full height */
        alignSelf: "stretch",
      }}>
        <NavList active={active} onSelect={onSelect} />
      </nav>
    );
  }

  /* ══ MOBILE / TABLET: fixed overlay drawer ══ */
  return (
    <>
      {/* Backdrop — only visible when open */}
      <div
        onClick={onDrawerClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 200,
          backdropFilter: "blur(2px)",
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
          transition: "opacity 0.22s ease",
        }}
      />

      {/* Drawer panel */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100dvh",          /* dynamic viewport height — handles mobile chrome bar */
        width: isMobile ? "min(80vw, 300px)" : 300,
        background: "var(--off-white)",
        borderRight: "var(--border)",
        zIndex: 201,
        overflowY: "auto",
        transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease",
        boxShadow: drawerOpen ? "8px 0 32px rgba(0,0,0,0.3)" : "none",
      }}>
        {/* Drawer header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "var(--black)",
          borderBottom: "2px solid var(--red)",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "var(--white)",
          }}>
            CIPHER<span style={{ color: "var(--red)" }}>FORGE</span>
          </span>
          <button
            onClick={onDrawerClose}
            aria-label="Close menu"
            style={{
              background: "var(--red)",
              border: "none",
              color: "var(--white)",
              width: 32,
              height: 32,
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        <NavList active={active} onSelect={onSelect} />
      </nav>
    </>
  );
}
