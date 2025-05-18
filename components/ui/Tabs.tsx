'use client';

import React, { useState, ReactNode } from 'react';

interface TabProps {
  id: string;
  title: string;
  children: ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

interface TabPanelProps {
  id: string;
  children: ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children }) => {
  return <div className="py-4">{children}</div>;
};

interface TabViewProps {
  children: React.ReactElement<TabProps>[];
  defaultActiveTab?: number;
  onChange?: (index: number) => void;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
}

export const TabView: React.FC<TabViewProps> = ({
  children,
  defaultActiveTab = 0,
  onChange,
  className = '',
  tabClassName = 'mr-2 py-2 px-4 font-medium text-sm border-b-2',
  activeTabClassName = 'border-blue-500 text-blue-600',
  inactiveTabClassName = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  // Filtrer uniquement les éléments Tab valides
  const tabs = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<TabProps> => 
      React.isValidElement(child) && child.type === Tab
  );

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <div className={className}>
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap -mb-px" role="tablist">
          {tabs.map((tab, index) => (
            <button
              key={tab.props.id}
              type="button"
              onClick={() => handleTabClick(index)}
              className={`${tabClassName} ${
                activeTab === index ? activeTabClassName : inactiveTabClassName
              }`}
              role="tab"
              aria-selected={activeTab === index}
              aria-controls={`tabpanel-${tab.props.id}`}
              id={`tab-${tab.props.id}`}
            >
              {tab.props.title}
            </button>
          ))}
        </nav>
      </div>

      <div className="tab-content">
        {tabs.map((tab, index) => (
          <div
            key={tab.props.id}
            id={`tabpanel-${tab.props.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.props.id}`}
            hidden={activeTab !== index}
          >
            {activeTab === index && tab.props.children}
          </div>
        ))}
      </div>
    </div>
  );
}; 