// src/utils/abbreviations.ts

import { ReactNode } from "react";

const ZONE_ABBREVS: Record<string, string> = {
  north: "N",
  south: "S",
  east: "E",
  west: "W",
  central: "C",
  northeast: "NE",
  northwest: "NW",
  southeast: "SE",
  southwest: "SW",
};

const HOSPITAL_TYPE_ABBREVS: Record<string, string> = {
  private: "P",
  government: "G",
  ntorc: "N",
};

/**
 * Case-insensitive abbreviation for zones.
 */
export function abbreviateZone(zone: string): string {
  return ZONE_ABBREVS[zone.toLowerCase()] ?? zone;
}

/**
 * Case-insensitive abbreviation for hospital types.
 */
export function abbreviateHospitalType(type: string): ReactNode {
  return HOSPITAL_TYPE_ABBREVS[type?.toLowerCase()] ?? type;
}
