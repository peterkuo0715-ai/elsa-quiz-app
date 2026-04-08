"use client";

/**
 * MathFigure: Renders geometric figures from JSON description.
 *
 * Figure JSON schema:
 * {
 *   "width": 200, "height": 200,
 *   "shapes": [
 *     { "type": "rect", "x": 10, "y": 10, "w": 100, "h": 80, "fill": "#E8F5E9", "stroke": "#333", "label": "10cm" },
 *     { "type": "circle", "cx": 100, "cy": 100, "r": 50, "fill": "#E3F2FD", "stroke": "#1565C0", "dash": true },
 *     { "type": "line", "x1": 0, "y1": 0, "x2": 100, "y2": 100, "stroke": "#E53935", "dash": true, "label": "對角線" },
 *     { "type": "triangle", "points": "50,10 10,90 90,90", "fill": "#FFF3E0", "stroke": "#333" },
 *     { "type": "arc", "cx": 50, "cy": 50, "r": 40, "startAngle": 0, "endAngle": 90, "fill": "#E8EAF6", "stroke": "#333" },
 *     { "type": "text", "x": 50, "y": 50, "text": "5cm", "color": "#333", "size": 12 },
 *     { "type": "angle", "cx": 10, "cy": 90, "r": 15, "startAngle": 0, "endAngle": 90 },
 *     { "type": "polygon", "points": "50,10 90,40 80,80 20,80 10,40", "fill": "#F3E5F5", "stroke": "#333" },
 *     { "type": "shaded", "d": "M10,10 L100,10 L100,100 L10,100 Z", "fill": "#FFE082", "opacity": 0.5 }
 *   ],
 *   "labels": [
 *     { "x": 55, "y": 105, "text": "底 = 10cm" }
 *   ]
 * }
 */

type Shape =
  | { type: "rect"; x: number; y: number; w: number; h: number; fill?: string; stroke?: string; dash?: boolean; label?: string; opacity?: number }
  | { type: "circle"; cx: number; cy: number; r: number; fill?: string; stroke?: string; dash?: boolean; label?: string; opacity?: number }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number; stroke?: string; dash?: boolean; label?: string; strokeWidth?: number }
  | { type: "triangle"; points: string; fill?: string; stroke?: string; label?: string; opacity?: number }
  | { type: "polygon"; points: string; fill?: string; stroke?: string; opacity?: number }
  | { type: "arc"; cx: number; cy: number; r: number; startAngle: number; endAngle: number; fill?: string; stroke?: string }
  | { type: "text"; x: number; y: number; text: string; color?: string; size?: number; bold?: boolean }
  | { type: "angle"; cx: number; cy: number; r: number; startAngle: number; endAngle: number; stroke?: string }
  | { type: "shaded"; d: string; fill?: string; opacity?: number; stroke?: string };

type Label = { x: number; y: number; text: string; color?: string; size?: number };

export type FigureData = {
  width: number;
  height: number;
  shapes: Shape[];
  labels?: Label[];
};

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const startRad = (startDeg * Math.PI) / 180;
  const endRad = (endDeg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy - r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy - r * Math.sin(endRad);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2} Z`;
}

function anglePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const startRad = (startDeg * Math.PI) / 180;
  const endRad = (endDeg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy - r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy - r * Math.sin(endRad);
  return `M ${x1} ${y1} A ${r} ${r} 0 0 0 ${x2} ${y2}`;
}

export default function MathFigure({ figure }: { figure: FigureData }) {
  const { width, height, shapes, labels } = figure;

  return (
    <div className="my-4 flex justify-center">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="rounded-xl border border-gray-200 bg-white"
        style={{ maxWidth: "100%" }}
      >
        {shapes.map((s, i) => {
          switch (s.type) {
            case "rect":
              return (
                <g key={i}>
                  <rect
                    x={s.x} y={s.y} width={s.w} height={s.h}
                    fill={s.fill ?? "#E8F5E9"} stroke={s.stroke ?? "#333"} strokeWidth={2}
                    strokeDasharray={s.dash ? "6,4" : undefined}
                    opacity={s.opacity ?? 1}
                    rx={2}
                  />
                  {s.label && (
                    <text x={s.x + s.w / 2} y={s.y + s.h / 2} textAnchor="middle" dominantBaseline="middle" fontSize={12} fill="#333" fontWeight="bold">
                      {s.label}
                    </text>
                  )}
                </g>
              );
            case "circle":
              return (
                <g key={i}>
                  <circle
                    cx={s.cx} cy={s.cy} r={s.r}
                    fill={s.fill ?? "#E3F2FD"} stroke={s.stroke ?? "#1565C0"} strokeWidth={2}
                    strokeDasharray={s.dash ? "6,4" : undefined}
                    opacity={s.opacity ?? 1}
                  />
                  {s.label && (
                    <text x={s.cx} y={s.cy} textAnchor="middle" dominantBaseline="middle" fontSize={12} fill="#333" fontWeight="bold">
                      {s.label}
                    </text>
                  )}
                </g>
              );
            case "line":
              return (
                <g key={i}>
                  <line
                    x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                    stroke={s.stroke ?? "#333"} strokeWidth={s.strokeWidth ?? 2}
                    strokeDasharray={s.dash ? "6,4" : undefined}
                  />
                  {s.label && (
                    <text x={(s.x1 + s.x2) / 2 + 5} y={(s.y1 + s.y2) / 2 - 5} fontSize={11} fill={s.stroke ?? "#333"}>
                      {s.label}
                    </text>
                  )}
                </g>
              );
            case "triangle":
              return (
                <g key={i}>
                  <polygon
                    points={s.points}
                    fill={s.fill ?? "#FFF3E0"} stroke={s.stroke ?? "#333"} strokeWidth={2}
                    opacity={s.opacity ?? 1}
                  />
                </g>
              );
            case "polygon":
              return (
                <polygon
                  key={i} points={s.points}
                  fill={s.fill ?? "#F3E5F5"} stroke={s.stroke ?? "#333"} strokeWidth={2}
                  opacity={s.opacity ?? 1}
                />
              );
            case "arc":
              return (
                <path
                  key={i}
                  d={arcPath(s.cx, s.cy, s.r, s.startAngle, s.endAngle)}
                  fill={s.fill ?? "#E8EAF6"} stroke={s.stroke ?? "#333"} strokeWidth={2}
                />
              );
            case "angle":
              return (
                <path
                  key={i}
                  d={anglePath(s.cx, s.cy, s.r, s.startAngle, s.endAngle)}
                  fill="none" stroke={s.stroke ?? "#E53935"} strokeWidth={1.5}
                />
              );
            case "text":
              return (
                <text
                  key={i} x={s.x} y={s.y}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={s.size ?? 12} fill={s.color ?? "#333"}
                  fontWeight={s.bold ? "bold" : "normal"}
                >
                  {s.text}
                </text>
              );
            case "shaded":
              return (
                <path
                  key={i} d={s.d}
                  fill={s.fill ?? "#FFE082"} opacity={s.opacity ?? 0.5}
                  stroke={s.stroke ?? "none"} strokeWidth={1}
                />
              );
            default:
              return null;
          }
        })}
        {labels?.map((l, i) => (
          <text
            key={`label-${i}`} x={l.x} y={l.y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={l.size ?? 12} fill={l.color ?? "#555"}
          >
            {l.text}
          </text>
        ))}
      </svg>
    </div>
  );
}
