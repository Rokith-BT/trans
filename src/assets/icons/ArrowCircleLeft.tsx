
import { SVGProps } from "react"
export const ArrowCircleLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
  xmlns="http://www.w3.org/2000/svg"
  width={24}
  height={24}
  fill="none"
  {...props}
>
  <g
    stroke="#C967A2"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeOpacity={0.75}
    strokeWidth={1.5}
  >
    <path
      strokeMiterlimit={10}
      d="M12 18.67a6.667 6.667 0 1 0 0-13.334 6.667 6.667 0 0 0 0 13.333Z"
    />
    <path d="m12.84 14.355-2.346-2.353 2.347-2.354" />
  </g>
</svg>
)