"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import styles from "./Navbar.module.css";

function isActive(pathname, href) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    function handlePointerDown(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label={`${site.name} — Accueil`}>
          {site.name}
          <span className={styles.logoDot}>.</span>
        </Link>

        <nav className={styles.nav} aria-label="Navigation principale">
          {site.nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.link} ${active ? styles.linkActive : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <Link href="/contact" className={`btn btn-primary btn-sm ${styles.cta}`}>
            Me contacter
          </Link>
          <button
            type="button"
            className={styles.menuButton}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className={styles.mobile}>
          <nav className={styles.mobileNav} aria-label="Navigation mobile">
            {site.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.mobileLink} ${active ? styles.mobileLinkActive : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/contact" className={`btn btn-primary ${styles.mobileCta}`} onClick={() => setOpen(false)}>
              Me contacter
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
