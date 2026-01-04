"use client";
import { useEffect, useState, useMemo } from "react";

// SVG blob paths (irregular, organic)
const blobPaths = [
  "M47.6,-74.2C61.9,-65.8,74.2,-52.1,78.5,-36.1C82.8,-20.1,79.1,-1.7,71.2,13.7C63.3,29.1,51.2,41.5,37.1,53.3C23,65.1,7,76.2,-11.7,79.1C-30.4,82,-60.8,76.7,-72.9,59.1C-85,41.5,-78.8,11.7,-69.2,-12.1C-59.6,-35.9,-46.6,-53.7,-30.1,-63.8C-13.6,-73.9,6.4,-76.3,24.7,-74.2C43,-72.1,59.5,-65.8,47.6,-74.2Z",
  "M55.9,-71.2C70.4,-61.5,80.6,-44.1,84.2,-25.1C87.8,-6.1,84.8,14.5,74.8,29.1C64.8,43.7,47.8,52.3,31.1,61.7C14.4,71.1,-2,81.3,-18.9,81.2C-35.8,81.1,-53.2,70.7,-65.2,55.2C-77.2,39.7,-83.7,19.8,-83.2,0.3C-82.7,-19.2,-75.2,-38.4,-61.8,-50.9C-48.4,-63.4,-29.2,-69.2,-10.1,-72.1C9,-75,18,-75,55.9,-71.2Z",
  "M36.5,-58.2C48.6,-50.7,60.1,-41.2,68.4,-28.1C76.7,-15,81.8,1.7,77.5,16.4C73.2,31.1,59.6,43.8,44.5,54.2C29.4,64.6,12.7,72.7,-4.4,78.1C-21.5,83.5,-43,86.2,-56.9,75.3C-70.8,64.4,-77.1,39.9,-77.8,17.1C-78.5,-5.7,-73.6,-26.8,-61.5,-40.6C-49.4,-54.4,-29.9,-60.9,-11.5,-65.6C6.9,-70.3,13.8,-73.2,36.5,-58.2Z",
  "M47.2,-72.5C61.7,-64.8,75.7,-52.8,81.2,-37.2C86.7,-21.6,83.7,-2.4,76.1,13.9C68.5,30.2,56.3,43.6,42.1,55.7C27.9,67.8,11.7,78.6,-5.8,81.1C-23.3,83.6,-46.6,77.8,-61.2,63.3C-75.8,48.8,-81.7,25.6,-81.6,2.1C-81.5,-21.4,-75.4,-42.8,-61.4,-55.6C-47.4,-68.4,-25.7,-72.6,-5.5,-67.9C14.7,-63.2,29.4,-49.6,47.2,-72.5Z",
];

// Responsive shapes
const shapes = [
  { size: { base: 90, md: 130, lg: 180 }, color: "fill-sky-300/40", top: { base: "10%", md: "10%", lg: "10%" }, left: { base: "8%", md: "12%", lg: "15%" } },
  { size: { base: 80, md: 120, lg: 150 }, color: "fill-emerald-400/30", top: { base: "28%", md: "30%", lg: "30%" }, left: { base: "55%", md: "58%", lg: "60%" } },
  { size: { base: 78, md: 110, lg: 140 }, color: "fill-rose-300/30", top: { base: "52%", md: "54%", lg: "55%" }, left: { base: "20%", md: "23%", lg: "25%" } },
  { size: { base: 88, md: 130, lg: 170 }, color: "fill-indigo-400/30", top: { base: "70%", md: "70%", lg: "70%" }, left: { base: "65%", md: "68%", lg: "70%" } },
  { size: { base: 68, md: 95, lg: 120 }, color: "fill-purple-400/30", top: { base: "38%", md: "39%", lg: "40%" }, left: { base: "78%", md: "82%", lg: "85%" } },
  { size: { base: 84, md: 120, lg: 150 }, color: "fill-cyan-400/30", top: { base: "14%", md: "14%", lg: "15%" }, left: { base: "72%", md: "78%", lg: "80%" } },
  { size: { base: 64, md: 85, lg: 100 }, color: "fill-amber-300/30", top: { base: "62%", md: "64%", lg: "65%" }, left: { base: "8%", md: "9%", lg: "10%" } },
  { size: { base: 82, md: 115, lg: 140 }, color: "fill-pink-400/30", top: { base: "44%", md: "45%", lg: "45%" }, left: { base: "40%", md: "43%", lg: "45%" } },
];

// Unique mouth renderers
const mouthRenderers = [
  // 0: Classic smile
  (cx = 0, cy = 20) => <path d={`M ${cx - 12} ${cy} Q ${cx} ${cy + 12} ${cx + 12} ${cy}`} stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />,
  // 1: Big grin
  (cx = 0, cy = 20) => (
    <>
      <path d={`M ${cx - 14} ${cy} Q ${cx} ${cy + 14} ${cx + 14} ${cy}`} stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d={`M ${cx - 12} ${cy} Q ${cx} ${cy + 10} ${cx + 12} ${cy}`} stroke="black" strokeWidth="1.5" fill="none" opacity="0.6" />
    </>
  ),
  // 2: Cheeky smirk (biased to one side)
  (cx = 2, cy = 20) => <path d={`M ${cx - 10} ${cy} Q ${cx + 4} ${cy + 8} ${cx + 12} ${cy - 1}`} stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />,
  // 3: Surprised ellipse
  (cx = 0, cy = 22) => <ellipse cx={cx} cy={cy} rx="6" ry="8" fill="black" />,
  // 4: Soft frown
  (cx = 0, cy = 22) => <path d={`M ${cx - 10} ${cy} Q ${cx} ${cy - 8} ${cx + 10} ${cy}`} stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />,
  // 5: Cat-like mouth
  (cx = 0, cy = 20) => (
    <>
      <path d={`M ${cx - 8} ${cy} Q ${cx - 2} ${cy + 4} ${cx} ${cy}`} stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d={`M ${cx} ${cy} Q ${cx + 2} ${cy + 4} ${cx + 8} ${cy}`} stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  // 6: Wavy grin
  (cx = 0, cy = 20) => <path d={`M ${cx - 14} ${cy} Q ${cx - 6} ${cy + 8} ${cx} ${cy} T ${cx + 14} ${cy}`} stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />,
];

export default function LeftParticleBackground() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [drift, setDrift] = useState(shapes.map(() => ({ x: 0, y: 0 })));
  const [vw, setVw] = useState(1024);
  const [mouthIndex, setMouthIndex] = useState(0);

  useEffect(() => {
    const updateVw = () => setVw(window.innerWidth);
    updateVw();
    window.addEventListener("resize", updateVw);
    return () => window.removeEventListener("resize", updateVw);
  }, []);


  // update every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMouthIndex(Math.floor(Math.random() * mouthRenderers.length));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const breakpoint = useMemo(() => {
    if (vw >= 1024) return "lg";
    if (vw >= 768) return "md";
    return "base";
  }, [vw]);

  const baseIntensity = useMemo(() => (breakpoint === "lg" ? 30 : breakpoint === "md" ? 20 : 12), [breakpoint]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      setOffset({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDrift((prev) =>
        prev.map(() => ({
          x: (Math.random() - 0.5) * (breakpoint === "lg" ? 40 : breakpoint === "md" ? 28 : 18),
          y: (Math.random() - 0.5) * (breakpoint === "lg" ? 40 : breakpoint === "md" ? 28 : 18),
        }))
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [breakpoint]);

  const visibleShapes = useMemo(() => {
    if (breakpoint === "base") return shapes.slice(0, 5);
    if (breakpoint === "md") return shapes.slice(0, 7);
    return shapes;
  }, [breakpoint]);

  return (
    <div className="absolute inset-0 -z-0 overflow-hidden">
      {visibleShapes.map((s, i) => {
        const size = s.size[breakpoint];
        const top = s.top[breakpoint];
        const left = s.left[breakpoint];
        const intensity = baseIntensity + i * (breakpoint === "lg" ? 5 : breakpoint === "md" ? 4 : 3);

        // Eye geometry within viewBox coordinates
        const eyeWhiteR = 10;
        const pupilR = 4;
        const eyeY = -12;
        const eyeXLeft = -20;
        const eyeXRight = 20;
        const pupilShift = 5;

        // Pick a mouth renderer per blob (stable by index)
        const renderMouth = mouthRenderers[i % mouthRenderers.length];

        return (
          <svg
            key={i}
            className="absolute"
            style={{
              top,
              left,
              transform: `translate(${offset.x * intensity + drift[i].x}px, ${offset.y * intensity + drift[i].y}px)`,
              transition: "transform 0.3s ease-in-out",
            }}
            width={size}
            height={size}
            viewBox="-90 -90 180 180"
          >
            {/* Blob shape */}
            <path d={blobPaths[i % blobPaths.length]} className={s.color} />

            {/* Eye whites */}
            <circle cx={eyeXLeft} cy={eyeY} r={eyeWhiteR} fill="white" />
            <circle cx={eyeXRight} cy={eyeY} r={eyeWhiteR} fill="white" />

            {/* Pupils (follow mouse slightly) */}
            <circle cx={eyeXLeft + offset.x * pupilShift} cy={eyeY + offset.y * pupilShift} r={pupilR} fill="black" />
            <circle cx={eyeXRight + offset.x * pupilShift} cy={eyeY + offset.y * pupilShift} r={pupilR} fill="black" />

            {/* Unique mouth per blob */}
            {mouthRenderers[mouthIndex](0, 20)}

          </svg>
        );
      })}
    </div>
  );
}
