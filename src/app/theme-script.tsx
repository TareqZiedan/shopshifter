"use client";

import Script from "next/script";

export function ThemeScript() {
  return (
    <Script
      id="theme-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          try {
            const theme = localStorage.getItem('theme') || 'light';
            document.documentElement.classList.toggle('dark', theme === 'dark');
          } catch (e) {
            console.error('Error setting theme:', e);
          }
        `,
      }}
    />
  );
}
