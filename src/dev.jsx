/**
 * Development & Localhost Detection Utility
 * 
 * Accurately detects if the app is running on:
 * - localhost / 127.0.0.1 / [::1]
 * - Vite local development server (`import.meta.env.DEV`, including GitHub Codespaces dev tunnels)
 */

export function isLocalhost() {
  if (typeof window === 'undefined') return false;

  const hostname = window.location.hostname;

  // Check common localhost hostname variations
  const isLocalIP = Boolean(
    hostname === 'localhost' ||
    hostname === '[::1]' ||
    hostname === '127.0.0.1' ||
    hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) ||
    hostname.endsWith('.localhost')
  );

  // In Vite or modern bundlers, import.meta.env.DEV is true during "npm run dev"
  // even when accessing via Codespaces/ngrok/tunnels
  const isViteDev = Boolean(import.meta.env?.DEV);

  return isLocalIP || isViteDev;
}

export const IS_DEV = isLocalhost();

export function dev() {
  const dev_mode = isLocalhost();
  if (dev_mode) {
    console.log(
      "%c[GoodMaze] 🛠️ Dev mode is ON (Running on localhost/dev)",
      "color: #00f3ff; font-weight: bold; background: #0a0d14; padding: 4px 8px; border-radius: 4px;"
    );
  } else {
    console.log("[GoodMaze] Production mode");
  }
  return dev_mode;
}

/**
 * Optional Dev Badge Component
 * Displays a subtle indicator in the corner when in localhost/dev mode
 */
export function DevBadge() {
  if (!isLocalhost()) return null;

  return (
    <div
      className="fixed bottom-2 right-2 z-50 px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold backdrop-blur-sm pointer-events-none select-none shadow-lg"
      title="Development Environment Detected"
    >
      🛠️ DEV (localhost)
    </div>
  );
}

export default dev;