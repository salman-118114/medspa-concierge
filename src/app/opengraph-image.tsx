import { ImageResponse } from "next/og";

export const alt = "Lumière Aesthetics · Meet Sofia, our 24/7 AI concierge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBF7F2",
          color: "#2B211C",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: -120, left: -80, width: 460, height: 460, borderRadius: 9999, background: "#E8C4B8", opacity: 0.7, filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: -140, right: -60, width: 420, height: 420, borderRadius: 9999, background: "#B08D57", opacity: 0.45, filter: "blur(40px)" }} />
        <div style={{ fontSize: 150, fontFamily: "serif", fontStyle: "italic", letterSpacing: -2 }}>Lumière</div>
        <div style={{ width: 90, height: 2, background: "#B08D57", marginTop: 18, marginBottom: 28 }} />
        <div style={{ fontSize: 40, letterSpacing: 1 }}>Meet Sofia, our 24/7 AI concierge</div>
        <div style={{ fontSize: 24, marginTop: 18, color: "#6b5a50" }}>Luxury med spa · Brickell, Miami</div>
      </div>
    ),
    size,
  );
}
