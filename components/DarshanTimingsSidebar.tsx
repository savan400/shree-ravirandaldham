"use client";
import { Clock, X } from "lucide-react";
import { useState } from "react";

const DarshanTimingsSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Fixed sidebar button with glow */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-0 top-1/3 z-50 bg-primary text-primary-foreground px-2.5 py-4 rounded-l-xl shadow-lg hover:bg-saffron-dark transition-all duration-300 animate-pulse-glow hover:pr-4"
        style={{ writingMode: "vertical-rl" }}
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Clock className="w-4 h-4" />
          Darshan Timings
        </span>
      </button>

      {/* Timings panel */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-card shadow-2xl z-50 overflow-y-auto animate-slide-in-right">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold gradient-text">Darshan Timings</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-destructive/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="section-divider mb-6" />
              <img
                src="https://salangpurhanumanji.org/wp-content/uploads/2024/02/new_time1.png"
                alt="Darshan Timings"
                className="w-full rounded-xl shadow-md"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DarshanTimingsSidebar;
