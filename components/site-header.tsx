"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      setIsHidden(isScrollingDown && currentScrollY > 18);
      lastScrollY.current = Math.max(currentScrollY, 0);
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateHeader);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateHeader();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn("site-header", isHidden && "site-header--hidden")}
      aria-label="Primary navigation"
    >
      <a className="brand-mark" href="#top" aria-label="KCEL home">
        <span className="brand-symbol">K</span>
        <span>
          <strong>KCEL</strong>
          <small>Battery Cell Supply</small>
        </span>
      </a>
      <nav className="nav-links">
        <a href="#products">Products</a>
        <a href="#capabilities">Capabilities</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}
