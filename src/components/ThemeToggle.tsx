import { Moon, Sun } from "lucide-react";
import { cn } from "../lib/utils";
import { useApp } from "../context/AppContext";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300",
        isDark 
          ? "bg-slate-800 border border-slate-700" 
          : "bg-white border border-slate-200 shadow-sm",
        className
      )}
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      }}
    >
      <div className="flex justify-between items-center w-full relative">
        {/* Active toggle circle */}
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-all duration-300 ease-in-out z-10",
            isDark 
              ? "transform translate-x-0 bg-slate-700 shadow-lg" 
              : "transform translate-x-8 bg-slate-100 shadow-lg"
          )}
        >
          {isDark ? (
            <Moon 
              className="w-3.5 h-3.5 text-blue-400" 
              strokeWidth={2}
            />
          ) : (
            <Sun 
              className="w-3.5 h-3.5 text-yellow-500" 
              strokeWidth={2}
            />
          )}
        </div>
        
        {/* Inactive icon */}
        <div
          className={cn(
            "absolute flex justify-center items-center w-6 h-6 rounded-full transition-all duration-300 ease-in-out",
            isDark 
              ? "right-0 opacity-30" 
              : "left-0 opacity-30"
          )}
        >
          {isDark ? (
            <Sun 
              className="w-3.5 h-3.5 text-slate-500" 
              strokeWidth={2}
            />
          ) : (
            <Moon 
              className="w-3.5 h-3.5 text-slate-600" 
              strokeWidth={2}
            />
          )}
        </div>
      </div>
    </div>
  );
}
