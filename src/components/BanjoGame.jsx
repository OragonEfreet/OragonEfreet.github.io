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
  const startedRef = useRef(false);
  const instanceRef = useRef(null); // holds the running module instance (classic or modularized)

  useEffect(() => {
    if (!game) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawMsg = (msg, color = "#fff") => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = color;
      ctx.font = "28px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(msg, width / 2, height / 2);
    };

    // 1) Initial loading state
    drawMsg("Loading...");

    // 2) Install a one-time click starter (enabled when ready)
    const startGame = () => {
      if (startedRef.current || !instanceRef.current) return;
      startedRef.current = true;
      canvas.style.cursor = "default";

      const M = instanceRef.current;
      // Try different entry points depending on build
      const tryStart = () => {
        try {
          if (typeof M.callMain === "function") return void M.callMain([]);
          if (typeof M.run === "function") return void M.run();
          if (typeof M._main === "function") return void M._main(0, 0);
          if (typeof M.ccall === "function") return void M.ccall("main", "number", ["number", "number"], [0, 0]);
          throw new Error("No known start function found (callMain/run/_main/ccall).");
        } catch (e) {
          console.error("Failed to start game:", e);
          drawMsg("Failed to start game", "#f55");
        }
      };

      tryStart();
      canvas.removeEventListener("click", startGame);
    };

    // 3) Prepare both loading paths:
    //    A) Classic (global object)   B) MODULARIZE=1 (function returning Promise)
    // Classic path setup
    const classicModule = {
      canvas,
      noInitialRun: true,
      locateFile: (path) => `${basePath}/${path}`,
      onRuntimeInitialized() {
        // runtime ready, but we prevented auto main()
        instanceRef.current = classicModule;
        drawMsg("Click to start");
        canvas.style.cursor = "pointer";
        canvas.addEventListener("click", startGame, { once: true });
      },
    };

    // Expose a global so classic builds can pick it up
    // (MODULARIZE builds will ignore this and export a function instead)
    window.Module = classicModule;

    // 4) Load the glue script
    const script = document.createElement("script");
    script.src = `${basePath}/${game}.js`;
    script.async = true;
    scriptRef.current = script;
    script.addEventListener("error", () => drawMsg("Failed to load game script.", "#f55"));
    document.head.appendChild(script);

    // 5) After the script tag loads, detect MODULARIZE builds
    script.addEventListener("load", () => {
      // If MODULARIZE=1, the glue exports a function (often named Module or custom EXPORT_NAME)
      // Heuristic: if global Module is a function, call it to get a Promise<instance>.
      if (typeof window.Module === "function") {
        // Clear any classic object we set, then instantiate
        try {
          delete window.Module; // avoid confusing the factory
        } catch {
          window.Module = undefined;
        }

        // Factory may be named something else (EXPORT_NAME). Try common names.
        const factory =
          (typeof window.createModule === "function" && window.createModule) ||
          (typeof window.Module === "function" && window.Module) ||
          null;

        const opts = {
          canvas,
          noInitialRun: true,
          locateFile: (path) => `${basePath}/${path}`,
        };

        if (factory) {
          factory(opts).then((inst) => {
            instanceRef.current = inst;
            drawMsg("Click to start");
            canvas.style.cursor = "pointer";
            canvas.addEventListener("click", startGame, { once: true });
          }).catch((e) => {
            console.error("Failed to init modularized Module:", e);
            drawMsg("Failed to initialize game.", "#f55");
          });
        }
      }
    });

    // Cleanup on unmount/prop change
    return () => {
      if (scriptRef.current?.parentNode) scriptRef.current.parentNode.removeChild(scriptRef.current);
      // Try to stop a running modularized instance (if any)
      instanceRef.current = null;
      startedRef.current = false;
      canvas.style.cursor = "default";
      canvas.removeEventListener("click", startGame);
      // Best-effort cleanup of the global
      if (window.Module === classicModule) {
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
            width: `${width}px`,
            margin: "0.5rem auto 0",
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
