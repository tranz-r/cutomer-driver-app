import React from "react";
import { Svg, Rect, Line, Circle, Path } from "react-native-svg";

export default function SmartDetectionSvg({ width = 96, height = 56 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 500 300" fill="none">
      {/* Scanning Grid */}
      <Rect x={90} y={40} width={320} height={220} fill="#ffffff" />
      <Line x1={150} y1={40} x2={150} y2={260} stroke="#d1ecf9" strokeWidth={3} />
      <Line x1={210} y1={40} x2={210} y2={260} stroke="#d1ecf9" strokeWidth={3} />
      <Line x1={270} y1={40} x2={270} y2={260} stroke="#d1ecf9" strokeWidth={3} />
      <Line x1={330} y1={40} x2={330} y2={260} stroke="#d1ecf9" strokeWidth={3} />
      <Line x1={90} y1={100} x2={410} y2={100} stroke="#d1ecf9" strokeWidth={3} />
      <Line x1={90} y1={160} x2={410} y2={160} stroke="#d1ecf9" strokeWidth={3} />
      <Line x1={90} y1={220} x2={410} y2={220} stroke="#d1ecf9" strokeWidth={3} />
      {/* AI Brain Chip */}
      <Circle cx={250} cy={150} r={50} fill="#4dd0e1" />
      <Circle cx={250} cy={150} r={20} fill="#00acc1" />
      <Path d="M230,150 h40" stroke="#00838f" strokeWidth={4} />
      <Path d="M250,130 v40" stroke="#00838f" strokeWidth={4} />
      {/* Detection Highlights */}
      <Rect x={340} y={70} width={60} height={40} fill="#fff59d" />
      <Path d="M345,90 l12,12 l25,-25" stroke="#fbc02d" strokeWidth={4} fill="none" />
      <Rect x={120} y={190} width={60} height={40} fill="#c5e1a5" />
      <Path d="M125,210 l12,12 l25,-25" stroke="#7cb342" strokeWidth={4} fill="none" />
      {/* Dynamic Waves */}
      <Circle cx={250} cy={150} r={70} fill="none" stroke="#b2ebf2" strokeWidth={3} strokeDasharray="8 6" />
      <Circle cx={250} cy={150} r={100} fill="none" stroke="#80deea" strokeWidth={3} strokeDasharray="8 6" />
    </Svg>
  );
} 