"use client";

import { useEffect, useState } from "react";
import MatrixRain from "./MatrixRain";

const THEME_CODE = ["m", "a", "t", "r", "i", "x"];

export default function ThemeSwitcher() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let index = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key.toLowerCase() === THEME_CODE[index].toLowerCase()) {
        index++;
        if (index === THEME_CODE.length) {
          setIsActive(prev => !prev);
          index = 0;
        }
      } else {
        index = 0;
        if (e.key.toLowerCase() === THEME_CODE[0].toLowerCase()) {
          index = 1;
        }
      }
    };

    const handleToggle = () => {
      setIsActive(prev => !prev);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("toggle-theme", handleToggle);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("toggle-theme", handleToggle);
    };
  }, []);

  return (
    <>
      {isActive && (
        <div className="fixed inset-0 z-[100] pointer-events-none opacity-20">
          <MatrixRain />
        </div>
      )}
    </>
  );
}
