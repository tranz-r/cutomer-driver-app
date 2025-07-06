import React from "react";
import { Svg, Rect, Circle } from "react-native-svg";

export default function InventorySvg({ width = 64, height = 38 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 500 300" fill="none">
      {/* Shelves */}
      <Rect x={50} y={80} width={400} height={10} fill="#ccc" />
      <Rect x={50} y={150} width={400} height={10} fill="#ccc" />
      <Rect x={50} y={220} width={400} height={10} fill="#ccc" />
      {/* Boxes on top shelf */}
      <Rect x={70} y={40} width={60} height={40} fill="#ffcc80" stroke="#e0a24d" strokeWidth={2} />
      <Rect x={140} y={40} width={60} height={40} fill="#90caf9" stroke="#42a5f5" strokeWidth={2} />
      <Rect x={210} y={40} width={60} height={40} fill="#a5d6a7" stroke="#66bb6a" strokeWidth={2} />
      {/* Boxes on middle shelf */}
      <Rect x={90} y={110} width={50} height={40} fill="#ef9a9a" stroke="#e57373" strokeWidth={2} />
      <Rect x={160} y={110} width={50} height={40} fill="#ce93d8" stroke="#ab47bc" strokeWidth={2} />
      <Rect x={230} y={110} width={50} height={40} fill="#fff176" stroke="#fbc02d" strokeWidth={2} />
      {/* Boxes on bottom shelf */}
      <Rect x={110} y={180} width={70} height={40} fill="#4dd0e1" stroke="#26c6da" strokeWidth={2} />
      <Rect x={200} y={180} width={70} height={40} fill="#aed581" stroke="#9ccc65" strokeWidth={2} />
      {/* Clipboard */}
      <Rect x={320} y={110} width={100} height={140} rx={5} fill="#fff" stroke="#bbb" strokeWidth={2} />
      <Rect x={350} y={120} width={40} height={10} fill="#eee" />
      <Rect x={330} y={140} width={60} height={8} fill="#90caf9" />
      <Rect x={330} y={160} width={60} height={8} fill="#a5d6a7" />
      <Rect x={330} y={180} width={60} height={8} fill="#ffcc80" />
      {/* Barcode Scanner */}
      <Rect x={360} y={70} width={30} height={20} fill="#b0bec5" />
      <Circle cx={375} cy={70} r={5} fill="#90a4ae" />
    </Svg>
  );
} 