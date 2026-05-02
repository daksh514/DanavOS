import StartBtn from "./StartBtn";
import Button from "./appButtons/Button";

export default function BottomBar() {
  return (
    <div className="absolute bottom-0 w-full  h-16 flex items-center justify-center ">
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div
          className="flex items-end gap-4 px-6 py-3 rounded-2xl 
                  bg-white/10 backdrop-blur-xl 
                  border border-white/20 shadow-lg"
        >
          <Button name="settings" icon="⚙️" className="w-12 h-12 rounded-xl" />

          <Button name="explorer" icon="📂" className="w-12 h-12 rounded-xl" />
        </div>
      </div>

      {/* Corner element */}
      <StartBtn />
    </div>
  );
}
