import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "FX Checker | Multi-Currency Hub & Interactive Financial Analytics";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "hsl(0, 0%, 4%)", // --color-neutral-900
        backgroundImage:
          "radial-gradient(circle at 90% 10%, hsl(73, 100%, 10%) 0%, hsl(0, 0%, 4%) 75%)", // Fades from --color-lime-800 aura
        color: "hsl(0, 0%, 100%)", // --color-neutral-50
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "60px 80px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* ================= LEFT COLUMN: BRAND PROMOTION ================= */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "550px",
        }}
      >
        {/* Logo Badge */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "hsl(71, 92%, 60%)", // --color-lime-500
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "16px",
              boxShadow: "0 0 20px rgba(179, 235, 45, 0.4)",
            }}
          >
            {/* Minimalist Graphic representing exchange */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="hsl(0, 0%, 4%)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m16 3 4 4-4 4" />
              <path d="M20 7H9" />
              <path d="m8 21-4-4 4-4" />
              <path d="M4 17h11" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "36px",
              fontWeight: 800,
              letterSpacing: "-0.05em",
            }}
          >
            FX Checker
          </span>
        </div>

        {/* Main Copy */}
        <h1
          style={{
            fontSize: "44px",
            fontWeight: 800,
            lineHeight: "1.15",
            letterSpacing: "-0.04em",
            marginBottom: "16px",
          }}
        >
          Your Live Currency <br />& Financial Analytics Hub
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "hsl(0, 0%, 78%)", // --color-neutral-100
            lineHeight: "1.4",
            marginBottom: "40px",
          }}
        >
          Convert instantly with real-time accuracy and trace historical
          volatility windows up to 5Y.
        </p>

        {/* Core Feature Badge Matrix */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {[
            "🔄 Converter",
            "📈 1D–5Y History",
            "⚖️ Compare Pairs",
            "⭐ Watchlists",
            "📋 Logs",
          ].map((feature) => (
            <div
              key={feature}
              style={{
                backgroundColor: "hsl(240, 3%, 13%)", // --color-neutral-600 / --card
                border: "1px solid hsl(0, 0%, 18%)", // --color-neutral-500 / --btn
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "15px",
                fontWeight: 600,
                color: "hsl(0, 0%, 100%)",
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* ================= RIGHT COLUMN: INTERACTIVE CHART CARD ================= */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "420px",
          backgroundColor: "hsl(240, 4%, 9%)", // --background-secondary / --color-neutral-700
          border: "1px solid hsl(240, 3%, 13%)", // --color-neutral-600 / --card
          borderRadius: "24px",
          padding: "24px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
        }}
      >
        {/* Mock Header Info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "14px",
                color: "hsl(0, 0%, 78%)",
                fontWeight: 600,
                marginBottom: "4px",
              }}
            >
              EUR / USD
            </span>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: "hsl(71, 92%, 60%)", // --color-lime-500
                letterSpacing: "-0.03em",
              }}
            >
              1.0854
            </span>
          </div>
          <div
            style={{
              display: "flex",
              backgroundColor: "rgba(104, 245, 120, 0.12)",
              border: "1px solid hsl(104, 96%, 47%)", // --color-green-500
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 700,
              color: "hsl(104, 96%, 47%)",
            }}
          >
            ▲ +0.38% (1M)
          </div>
        </div>

        {/* SVG Fading Line Preview */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "160px",
            position: "relative",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 372 160"
            style={{ display: "flex" }}
          >
            {/* Gradient def for vector clipping fill */}
            <defs>
              <linearGradient id="ogGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(71, 92%, 60%)"
                  stopOpacity="0.3"
                />
                <stop
                  offset="100%"
                  stopColor="hsl(71, 92%, 60%)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {/* Area shading */}
            <path
              d="M 0,140 Q 50,70 100,105 T 200,60 T 300,35 T 372,20 L 372,160 L 0,160 Z"
              fill="url(#ogGradient)"
            />

            {/* Bold Lime Accent line path */}
            <path
              d="M 0,140 Q 50,70 100,105 T 200,60 T 300,35 T 372,20"
              fill="none"
              stroke="hsl(71, 92%, 60%)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Interactive Target Indicator Dot */}
            <circle cx="372" cy="20" r="7" fill="hsl(71, 92%, 60%)" />
            <circle
              cx="372"
              cy="20"
              r="13"
              fill="none"
              stroke="hsl(71, 92%, 60%)"
              strokeOpacity="0.4"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Interactive Timeline Tabs indicator matching layout */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px dashed hsl(240, 3%, 13%)",
            paddingTop: "16px",
            marginTop: "16px",
          }}
        >
          {["1D", "1W", "1M", "1Y", "5Y"].map((period) => {
            const isActive = period === "1M";
            return (
              <div
                key={period}
                style={{
                  padding: "4px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  backgroundColor: isActive
                    ? "hsl(71, 92%, 60%)"
                    : "transparent",
                  color: isActive ? "hsl(0, 0%, 4%)" : "hsl(0, 0%, 78%)",
                }}
              >
                {period}
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
