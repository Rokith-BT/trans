// src/components/Tabs.tsx
import React, { useEffect, useState } from 'react';

interface TabViewItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabViewItem[];
  defaultActiveTab?: string;
}

export const TabView: React.FC<TabsProps> = ({ tabs, defaultActiveTab }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0].id);
  useEffect(() => {
    if (defaultActiveTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab]);
  return (
    <div className="flex bg-purple-200 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-[5%] py-3 text-sm font-medium focus:outline-none ${
            activeTab === tab.id ? 'bg-[#804595] text-white rounded-lg' : 'text-[#804595]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
