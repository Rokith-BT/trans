// utils/organImages.ts

import HeartImage from "@/assets/imgs/heart.png";
import KidneyImage from "@/assets/imgs/kidney.png";
import LiverImage from "@/assets/imgs/liver.png";
import LungsImage from "@/assets/imgs/lungs.png";
import PancreasImage from "@/assets/imgs/pancreas.png";
import Stomach from "@assets/imgs/stomach.png";
import Smallbowel from "@/assets/imgs/intestine.png";
import Hand from "@assets/imgs/hand.png";
import Heartvalves from "@assets/imgs/heart2.png";
import Corner from "@assets/imgs/eye.png";
import Skin from "@assets/imgs/skin.png";
import Bone from "@assets/imgs/bone.png";
import Abdomanal from "@assets/imgs/abdomanal-flap.png";

// Define a mapping between organ names and their respective image paths
const organImages: { [key: string]: string } = {
  heart: HeartImage,
  kidney: KidneyImage,
  "kidney(1)": KidneyImage,
  "kidney(2)": KidneyImage,
  liver: LiverImage,
  duallungs: LungsImage,
  pancreas: PancreasImage,
  stomach: Stomach,
  Stomach:Stomach,
  smallbowel: Smallbowel,
  hand: Hand,
  heartvalves: Heartvalves,
  cornea: Corner,
  // Cornea: Corner,
  skin: Skin,
  bone: Bone,
  abdominalflap: Abdomanal,
  // Add more organ mappings as needed
};

// Helper function to format organ name (removing spaces and standardizing case)
const formatOrganName = (organName: string): string => {
  return organName?.replace(/\s+/g, "")?.toLowerCase(); // Replace spaces with underscores and lowercase
};

// The function that will return the corresponding image URL
export const getOrganImage = (organName: string): string => {
  const formattedName = formatOrganName(organName); // Format the organ name
  return organImages[formattedName] || ""; // Return the image or an empty string if not found
};
