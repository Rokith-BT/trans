// import { SidebarItemType } from "@/types/SidebarType";

import { SidebarItemType } from "@/types/SidebarType";

// /**
//  * Custom filter that doesn’t alter the original structure.
//  * It returns a new structure with only allowed items.
//  */
// export function filterSidebarByCustomConditions(
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   sidebarItems: any[],
//   allowedSet: Set<string>,
// ): SidebarItemType[] {
//   return sidebarItems
//     .map((item) => {
//       // Define your custom conditions based on the menu's name (or any other property)
//       let isAllowed = false;
//       switch (item.name.toLowerCase()) {
//         case "hospital management":
//           isAllowed = allowedSet.has("hospital");
//           break;
//         case "recipient management":
//           isAllowed = allowedSet.has("recipients");
//           break;
//         case "recipient transfer":
//           isAllowed = allowedSet.has("recipient transfer");
//           break;
//         // Add other custom cases as needed.
//         default:
//           // For menus not using custom conditions, you can either always show them
//           // or perform a default check (like presence of a route).
//           isAllowed = !!item.route; // for example, show if a route is defined
//       }

//       // If the item has children, filter them recursively.
//       let filteredChildren: SidebarItemType[] = [];
//       if (item.children && item.children.length) {
//         filteredChildren = filterSidebarByCustomConditions(
//           item.children,
//           allowedSet,
//         );
//       }

//       // Only return the item (unmodified) if it passes your condition, or if any allowed child exists.
//       if (isAllowed || filteredChildren.length > 0) {
//         return {
//           ...item,
//           // Replace children with the filtered list (if any); otherwise keep the original.
//           children: filteredChildren.length ? filteredChildren : item.children,
//         };
//       }
//       // If the item does not meet the condition, it will not be included.
//       return null;
//     })
//     .filter((item): item is SidebarItemType => item !== null);
// }

export function filterSidebarByCustomConditions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sidebarItems: any[],
  allowedSet: Set<string>,
): SidebarItemType[] {
  return sidebarItems
    .map((item) => {
      let isAllowed = false;

      // Define custom conditions by mapping menu names to your allowed keys.
      switch (item.name.toLowerCase()) {
        case "dashboard":
          isAllowed = allowedSet.has("dashboard");
          break;
        case "hospital management":
          // Allow if either "hospital" or "hospitals" is in the allowed set.
          isAllowed = allowedSet.has("hospital") || allowedSet.has("hospitals");
          break;
        case "donor management":
          isAllowed = allowedSet.has("donor");
          break;
        case "live transplant":
          isAllowed = allowedSet.has("LiveTransplant");
          break;
        case "approval management":
          isAllowed = allowedSet.has("approval management");
          break;
        case "recipient management":
          isAllowed = allowedSet.has("recipient");
          break;
        case "manage recipients":
          isAllowed = allowedSet.has("recipient");
          break;
        case "recipient transfer":
          isAllowed = allowedSet.has("recipient transfer");
          break;
        case "alf management":
          isAllowed = allowedSet.has("alf");
          break;
        case "alf doctors":
          isAllowed = allowedSet.has("alf doctors");
          break;
        case "waiting list":
          isAllowed = allowedSet.has("waitinglist");
          break;
        case "transtan waiting list":
          isAllowed = allowedSet.has("transtan waiting list");
          break;
        case "inhouse waiting list":
          isAllowed = allowedSet.has("inhouse waiting list");
          break;
        case "common waiting list":
          isAllowed = allowedSet.has("common waiting list");
          break;
        // For submenus, you might further add conditions
        case "master setup":
          isAllowed = allowedSet.has("setup");
          break;
        case "app settings":
          isAllowed = allowedSet.has("settings");
          break;
        case "access permission":
          isAllowed = allowedSet.has("settings");
          break;
        // Add other cases as needed…
        case "resource management":
          isAllowed = allowedSet.has("resources");
          break;
        case "tickets":
          isAllowed = allowedSet.has("tickets");
          break;
        case "settings":
          isAllowed = allowedSet.has("settings");
          break;
        default:
          // Use a default rule; for instance, check if the route key matches
          isAllowed =
            item.route &&
            allowedSet.has(item.route.replace("/", "").toLowerCase());
      }

      // If the item has children, filter them recursively.
      let filteredChildren: SidebarItemType[] = [];
      if (item.children && item.children.length) {
        filteredChildren = filterSidebarByCustomConditions(
          item.children,
          allowedSet,
        );
      }

      // You want to show the item if:
      // - The custom condition for the item is met, OR
      // - At least one child is allowed.
      if (isAllowed || filteredChildren.length > 0) {
        return {
          ...item,
          children: filteredChildren.length ? filteredChildren : item.children,
        };
      }
      return null;
    })
    .filter((item): item is SidebarItemType => item !== null);
}
