import * as React from "react";
import { SVGProps } from "react";
const StopCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-circle-pause-icon lucide-circle-pause"
    {...props}
  >
    <circle cx={12} cy={12} r={10} />
    <line x1={10} x2={10} y1={15} y2={9} />
    <line x1={14} x2={14} y1={15} y2={9} />
  </svg>
);
export default StopCircle;
