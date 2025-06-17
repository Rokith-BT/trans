/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from 'react'

// const MobileSideBarItem = () => {
//   return (
//     <div>MobileSideBarItem</div>
//   )
// }

// export default MobileSideBarItem

import React, { useState, useEffect } from 'react';
import SideBarData from '@/data/sidebar.json';
import { useLocation, NavLink } from 'react-router-dom';
// import { SidebarItemType } from '@/types/SidebarType';
import { Box } from '@/atoms';
import { MenuDropDown } from '@/assets/icons';
// import {
//   MenuIcon,
//   HomeIcon,
//   HospitalIcon,
//   MedalStarIcon,
//   Chart2Icon,
//   ArchiveTickIcon,
//   BookSavedIcon,
//   MessageQuestionIcon,
//   HelpCircleIcon,
//   CloseIcon
// } from '../../assets/svg';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Icon: any = {
  //   HomeIcon,
  //   HospitalIcon,
  //   MedalStarIcon,
  //   Chart2Icon,
  //   ArchiveTickIcon,
  //   BookSavedIcon,
  //   MessageQuestionIcon,
  //   HelpCircleIcon
};
export const MobileSideBar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    // Close dropdown whenever route changes
    setOpenDropdown(null);
    setShowMenu(false);
  }, [location.pathname]);

  const isParentActive = (item: any): boolean => {
    if (item.route && location.pathname === item.route) return true;
    if (item.children) {
      return item.children.some((child: any) => location.pathname.startsWith(child.route));
    }
    return false;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderMenuItem = (item: any, isMobile = true) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isParentActive(item); // <- use the helper here

    if (!hasChildren) {
      return (
        <NavLink
          to={item.route}
          onClick={() => isMobile && setShowMenu(false)}
          className={({ isActive }) =>
            `flex items-center gap-1 font-[600] uppercase text-xs px-4 py-2 rounded hover:text-[#C53F4A] hover:underline hover:underline-offset-[6px] transition-all duration-300 ${
              isActive ? 'text-[#C53F4A] underline underline-offset-[6px]' : 'text-black'
            }`
          }
        >
          {Icon[item.icon] && React.createElement(Icon[item.icon], { className: 'w-5 h-5 text-red-500' })}
          {item.name}
        </NavLink>
      );
    }

    return (
      <div className="relative group ">
        <button
          onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
          className={`flex items-center gap-1 font-[600] uppercase text-xs px-4 py-2 rounded hover:text-[#C53F4A] hover:underline hover:underline-offset-[6px] transition-all duration-300 ${
            active ? 'text-[#C53F4A] underline underline-offset-[6px]' : 'text-black'
          }`}
        >
          {Icon[item.icon] && React.createElement(Icon[item.icon], { className: 'w-5 h-5' })}
          {item.name}
        </button>
        <ul
          className={`absolute top-full hidden group-hover:block left-0 bg-white rounded shadow-md min-w-[100%] text-nowrap z-20 transition-all duration-500 ${
            openDropdown === item.name ? 'block' : 'hidden'
          }`}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
          {item.children.map((child: any) => (
            <li key={child.route}>
              {child.type === 'pdf' ? (
                <a
                  href={`/pdf/${child.route}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-xs hover:bg-gray-100 text-black"
                >
                  {Icon[child.icon] &&
                    React.createElement(Icon[child.icon], { className: 'inline-block w-4 h-4 mr-1' })}
                  {child.name}
                </a>
              ) : (
                <NavLink
                  to={child.route}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-xs hover:bg-gray-100 ${
                      isActive ? 'text-[#C53F4A] font-semibold' : 'text-black'
                    }`
                  }
                >
                  {Icon[child.icon] &&
                    React.createElement(Icon[child.icon], { className: 'inline-block w-4 h-4 mr-1' })}
                  {child.name}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <nav className="bg-primary relative">
      {/* Mobile Menu Button */}
      <Box className="absolute right-2  -top-[75px] md:hidden">
        {!showMenu ? (
          //   <MenuIcon onClick={() => setShowMenu(!showMenu)} />
          <Box onClick={() => setShowMenu(true)}>
            <MenuDropDown />
          </Box>
        ) : (
          //   <CloseIcon onClick={() => setShowMenu(!showMenu)} />
          <Box onClick={() => setShowMenu(false)}>
            <MenuDropDown />
          </Box>
        )}
      </Box>

      {/* Mobile Nav */}
      {showMenu && (
        <ul className="absolute md:hidden  right-0 h-[300px] w-[300px]  overflow-y-auto flex flex-col items-start bg-white shadow-lg gap-[16px] p-3 z-50">
          {SideBarData.map((item) => (
            <li key={item.name}>
              {item.children?.length ? (
                <>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                    className="flex items-center gap-1 font-[600] text-xs px-4 py-2 w-full text-left"
                  >
                    {Icon[item.icon] && React.createElement(Icon[item.icon], { className: 'w-5 h-5 text-inherit' })}

                    {item.name}
                  </button>
                  {openDropdown === item.name && (
                    <ul className="ml-4 mt-1">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
                      {item.children.map((child: any) => (
                        <li key={child.route} className="">
                          {child.type === 'pdf' ? (
                            <a
                              href={`/pdf/${child.route}.pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-2 text-xs hover:bg-gray-100 text-black"
                            >
                              {Icon[child.icon] &&
                                React.createElement(Icon[child.icon], { className: 'inline-block w-4 h-4 mr-1' })}
                              {child.name}
                            </a>
                          ) : (
                            <NavLink
                              to={child.route}
                              className={({ isActive }) =>
                                `block px-4 py-2 text-xs hover:bg-gray-100 ${
                                  isActive ? 'text-[#C53F4A] font-semibold' : 'text-black'
                                }`
                              }
                            >
                              {Icon[child.icon] &&
                                React.createElement(Icon[child.icon], { className: 'inline-block w-4 h-4 mr-1' })}
                              {child.name}
                            </NavLink>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                renderMenuItem(item, true)
              )}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};
