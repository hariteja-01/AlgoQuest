"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from "lucide-react";

interface Tab {
  title: string;
  icon: LucideIcon;
  href: string;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
  href?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring" as const, bounce: 0, duration: 0.6 };

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-blue-500",
  onChange,
}: ExpandableTabsProps) {
  const location = useLocation();
  const [selected, setSelected] = React.useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const outsideClickRef = React.useRef<HTMLDivElement>(null);

  // Find active tab based on current route
  const activeTabIndex = React.useMemo(() => {
    return tabs.findIndex((tab) => 
      tab.type !== "separator" && tab.href === location.pathname
    );
  }, [location.pathname, tabs]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (outsideClickRef.current && !outsideClickRef.current.contains(event.target as Node)) {
        setSelected(null);
        setHoveredIndex(null);
        onChange?.(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onChange]);

  const handleSelect = (index: number) => {
    setSelected(index);
    onChange?.(index);
  };

  const Separator = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-gray-300 dark:bg-gray-600" aria-hidden="true" />
  );

  return (
    <div
      ref={outsideClickRef}
      className={`flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-1 shadow-lg ${className || ''}`}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        const Icon = tab.icon;
        const isActive = activeTabIndex === index;
        const isExpanded = selected === index || hoveredIndex === index || isActive;

        return (
          <Link key={tab.title} to={tab.href}>
            <motion.button
              variants={buttonVariants}
              initial={false}
              animate="animate"
              custom={isExpanded}
              onClick={() => handleSelect(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              transition={transition}
              className={`relative flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? `bg-blue-50 dark:bg-blue-950/50 ${activeColor} shadow-sm border border-blue-200 dark:border-blue-800`
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.span
                    variants={spanVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={transition}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {tab.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Link>
        );
      })}
    </div>
  );
}
