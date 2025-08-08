import { useEffect, useRef } from "react";

export default function BanjoGame({
  game,
  basePath = "/games",
  id = "canvas",
  width = 800,
  height = 600,
  children,
}) {
  const canvasRef = useRef(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    if (!game) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#fff";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Loading...", width / 2, height / 2);

    const Module = {
      canvas,
      locateFile: (path) => `${basePath}/${path}`,
    };
    window.Module = Module;

    const script = document.createElement("script");
    script.src = `${basePath}/${game}.js`;
    script.async = true;
    scriptRef.current = script;
    document.head.appendChild(script);

    return () => {
      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      if (window.Module === Module) {
        try { delete window.Module; } catch { window.Module = undefined; }
      }
    };
  }, [game, basePath, width, height]);

  return (
    <figure style={{ margin: 0, textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        id={id}
        width={width}
        height={height}
        className="emscripten"
        onContextMenu={(e) => e.preventDefault()}
        tabIndex={-1}
        style={{
          display: "block",
          margin: "0 auto",
          border: "1px solid #ccc",
          backgroundColor: "#000",
        }}
      />
      {children && (
        <figcaption
          style={{
            width: `${width}px`,      // match canvas width
            margin: "0.5rem auto 0",  // center relative to canvas
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          {children}
        </figcaption>
      )}
    </figure>
  );
}
