import React from "react";
import { Svg, Path, Rect, Polygon, Circle, Ellipse } from "react-native-svg";

export default function VanSvg({ width = 64, height = 38 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 500 300" fill="none">
      {/* Van Body */}
      <Path d="M100 180 L380 180 L420 140 L420 100 L300 100 L260 80 L100 80 Z" fill="#90caf9" stroke="#42a5f5" strokeWidth={2} />
      {/* Roof */}
      <Path d="M100 80 L260 80 L300 100 L100 100 Z" fill="#64b5f6" />
      {/* Windows */}
      <Rect x={120} y={100} width={60} height={40} fill="#bbdefb" stroke="#64b5f6" strokeWidth={1} />
      <Rect x={190} y={100} width={60} height={40} fill="#bbdefb" stroke="#64b5f6" strokeWidth={1} />
      <Polygon points="260,100 300,100 300,140 260,140" fill="#bbdefb" stroke="#64b5f6" strokeWidth={1} />
      {/* Side Panel Detail */}
      <Rect x={120} y={145} width={250} height={20} fill="#64b5f6" opacity={0.5} />
      {/* Wheels */}
      <Circle cx={150} cy={180} r={20} fill="#424242" />
      <Circle cx={150} cy={180} r={10} fill="#757575" />
      <Circle cx={350} cy={180} r={20} fill="#424242" />
      <Circle cx={350} cy={180} r={10} fill="#757575" />
      {/* Front Bumper */}
      <Rect x={380} y={170} width={20} height={10} fill="#90a4ae" />
      {/* Headlights */}
      <Circle cx={420} cy={120} r={6} fill="#fff59d" stroke="#fdd835" strokeWidth={1} />
      <Circle cx={420} cy={140} r={6} fill="#fff59d" stroke="#fdd835" strokeWidth={1} />
      {/* Shadow under Van */}
      <Ellipse cx={250} cy={200} rx={180} ry={20} fill="#000" opacity={0.1} />
    </Svg>
  );
} 