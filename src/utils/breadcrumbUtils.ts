// breadcrumbUtils.ts
import { matchPath } from "react-router-dom";
import { ROUTE_LABELS } from "./breadcrumbConfig";

export const getMatchedBreadcrumbLabel = (pathname: string): string | null => {
  for (const pattern in ROUTE_LABELS) {
    const match = matchPath({ path: pattern, end: false }, pathname);
    if (match) return ROUTE_LABELS[pattern];
  }
  return null;
};
