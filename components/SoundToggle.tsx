"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/audiofile.mpeg";
const BAR_COUNT = 7;
const FFT_SIZE = 256;

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const enabledRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stopVisual = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    barsRef.current.forEach((bar) => {
      if (bar) bar.style.transform = "scaleY(0.22)";
    });
  }, []);

  const draw = useCallback(() => {
    const analyser = analyserRef.current;
    const data = dataRef.current;
    if (!analyser || !data || !enabledRef.current) return;

    analyser.getByteFrequencyData(data);

    const step = Math.max(1, Math.floor(data.length / (BAR_COUNT * 2.2)));
    for (let i = 0; i < BAR_COUNT; i++) {
      const bar = barsRef.current[i];
      if (!bar) continue;
      // Mirror-ish weighting: outer bars quieter, center reacts strongest
      const bin = i * step + 3;
      const value = data[bin] ?? 0;
      const weight = 0.55 + (1 - Math.abs(i - (BAR_COUNT - 1) / 2) / BAR_COUNT);
      const scale = Math.max(0.18, Math.min(1, (value / 155) * weight));
      bar.style.transform = `scaleY(${scale})`;
    }

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  const ensureAudio = useCallback(async () => {
    if (!audioRef.current) {
      const audio = new Audio(AUDIO_SRC);
      audio.loop = true;
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";
      audioRef.current = audio;
    }

    if (!ctxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) throw new Error("Web Audio API unavailable");
      ctxRef.current = new AudioCtx();
    }

    const ctx = ctxRef.current;
    if (ctx.state === "suspended") await ctx.resume();

    if (!analyserRef.current && audioRef.current && !sourceRef.current) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.68;
      analyserRef.current = analyser;
      dataRef.current = new Uint8Array(
        new ArrayBuffer(analyser.frequencyBinCount),
      );

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      sourceRef.current = source;
    }

    return audioRef.current;
  }, []);

  const disableSound = useCallback(() => {
    enabledRef.current = false;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setEnabled(false);
    stopVisual();
  }, [stopVisual]);

  const enableSound = useCallback(async () => {
    const audio = await ensureAudio();
    await audio.play();
    enabledRef.current = true;
    setEnabled(true);
    stopVisual();
    rafRef.current = requestAnimationFrame(draw);
  }, [draw, ensureAudio, stopVisual]);

  const toggle = useCallback(async () => {
    try {
      if (enabledRef.current) {
        disableSound();
      } else {
        await enableSound();
      }
    } catch {
      disableSound();
    }
  }, [disableSound, enableSound]);

  useEffect(() => {
    return () => {
      enabledRef.current = false;
      stopVisual();
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
      try {
        sourceRef.current?.disconnect();
        analyserRef.current?.disconnect();
      } catch {
        /* already disconnected */
      }
      void ctxRef.current?.close();
      audioRef.current = null;
      sourceRef.current = null;
      analyserRef.current = null;
      ctxRef.current = null;
      dataRef.current = null;
    };
  }, [stopVisual]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <button
        type="button"
        onClick={() => void toggle()}
        className={[
          "pointer-events-auto group relative inline-flex items-center gap-3 overflow-hidden",
          "rounded-full border px-4 py-2.5 backdrop-blur-xl transition-all duration-500",
          "shadow-[0_8px_32px_rgba(0,0,0,0.28)]",
          enabled
            ? "border-accent/35 bg-[color-mix(in_srgb,var(--background)_72%,transparent)] text-foreground"
            : "border-border/80 bg-[color-mix(in_srgb,var(--background)_78%,transparent)] text-muted hover:border-foreground/25 hover:text-foreground",
        ].join(" ")}
        aria-pressed={enabled}
        aria-label={enabled ? "Turn sounds off" : "Turn sounds on"}
      >
        {/* Ambient wash when playing */}
        <span
          aria-hidden
          className={[
            "pointer-events-none absolute inset-0 transition-opacity duration-700",
            enabled ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{
            background:
              "radial-gradient(120% 80% at 70% 50%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 62%)",
          }}
        />

        <span className="relative font-mono text-[10px] leading-none text-current/40">
          [
        </span>

        <span className="relative flex items-center gap-2.5">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em]">
            Sounds {enabled ? "on" : "off"}
          </span>

          <span
            className={[
              "flex h-4 items-center gap-[3px] transition-colors duration-500",
              enabled ? "text-accent" : "text-current",
            ].join(" ")}
            aria-hidden
          >
            {Array.from({ length: BAR_COUNT }, (_, i) => (
              <span
                key={i}
                ref={(el) => {
                  barsRef.current[i] = el;
                }}
                className="w-[1.5px] origin-center rounded-full bg-current will-change-transform"
                style={{
                  height: "100%",
                  transform: "scaleY(0.22)",
                  opacity: enabled ? 1 : 0.45,
                  transition: "opacity 400ms ease",
                }}
              />
            ))}
          </span>
        </span>

        <span className="relative font-mono text-[10px] leading-none text-current/40">
          ]
        </span>
      </button>
    </div>
  );
}
