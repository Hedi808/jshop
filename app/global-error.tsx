"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="fr"><body><main style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "Arial, sans-serif", textAlign: "center", padding: 24 }}><div><p style={{ color: "#ff6500", fontWeight: 900 }}>Jshop</p><h1>Une erreur est survenue</h1><p>Actualisez la page puis réessayez.</p><button type="button" onClick={reset} style={{ marginTop: 16, border: 0, borderRadius: 8, background: "#0a0a0a", color: "white", padding: "12px 20px", fontWeight: 800 }}>RÉESSAYER</button></div></main></body></html>;
}
