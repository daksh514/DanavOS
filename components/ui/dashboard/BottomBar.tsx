import React from "react";
import StartBtn from "./StartBtn";

export default function BottomBar() {
  return (
    <div className="absolute bottom-0 w-full  h-16 flex items-center justify-center ">
      {/* Center element */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div
          className="flex items-end gap-4 px-6 py-3 rounded-2xl 
                  bg-white/10 backdrop-blur-xl 
                  border border-white/20 shadow-lg"
        >
          {/* App 1 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div
              className="w-12 h-12 rounded-xl bg-white/20 
                      flex items-center justify-center
                      transition-all duration-200 
                      group-hover:scale-125"
            >
              🏠
            </div>
          </div>

          {/* App 2 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div
              className="w-12 h-12 rounded-xl bg-white/20 
                      flex items-center justify-center
                      transition-all duration-200 
                      group-hover:scale-125"
            >
              ⚙️
            </div>
          </div>

          {/* App 3 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div
              className="w-12 h-12 rounded-xl bg-white/20 
                      flex items-center justify-center
                      transition-all duration-200 
                      group-hover:scale-125"
            >
              📁
            </div>
          </div>
        </div>
      </div>

      {/* Corner element */}
      <StartBtn />
    </div>
  );
}
