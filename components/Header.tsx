"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-2">
        <Link
          href="/"
          className="flex items-baseline gap-2 md:gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-base font-medium text-foreground whitespace-nowrap">
            Syed Saqib Abbas
          </span>
          <span className="hidden text-sm font-medium text-muted sm:inline">
            UX Designer
          </span>
        </Link>

        <div className="flex items-center gap-6 md:gap-10">
          <nav
            className="hidden items-center gap-10 md:flex"
            aria-label="Primary"
          >
            {links.map((link) => {
              const isActive = activeHash === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground"
                >
                  <span
                    className={`size-1.5 shrink-0 rounded-[1px] transition-colors duration-200 ${
                      isActive
                        ? "bg-accent"
                        : "bg-transparent group-hover:bg-accent"
                    }`}
                    aria-hidden
                  />
                  <span className={isActive ? "text-foreground" : undefined}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <ThemeToggle />

          <button
            type="button"
            className="relative flex size-8 items-center justify-center md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close" : "Menu"}</span>
            <span
              className={`absolute h-px w-4 bg-foreground transition-transform duration-200 ${
                menuOpen ? "translate-y-0 rotate-45" : "-translate-y-1"
              }`}
            />
            <span
              className={`absolute h-px w-4 bg-foreground transition-transform duration-200 ${
                menuOpen ? "translate-y-0 -rotate-45" : "translate-y-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-border bg-background md:hidden ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <nav
          className="flex flex-col gap-1 px-4 py-4"
          aria-label="Mobile primary"
        >
          {links.map((link) => {
            const isActive = activeHash === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 text-base font-medium text-muted transition-colors duration-200 hover:text-foreground"
              >
                <span
                  className={`size-1.5 shrink-0 rounded-[1px] ${
                    isActive ? "bg-accent" : "bg-transparent"
                  }`}
                  aria-hidden
                />
                <span className={isActive ? "text-foreground" : undefined}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
