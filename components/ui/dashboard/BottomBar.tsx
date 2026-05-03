import StartBtn from "./StartBtn";
import Button from "./appButtons/Button";

export default function BottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center">
      <div>
        <div
          className="flex items-end gap-4 px-6 py-3 rounded-2xl 
                  bg-white/10 backdrop-blur-xl 
                  border border-white/20 shadow-lg"
        >
          <Button name="settings" icon="⚙️" className="w-12 h-12 rounded-xl" />

          <Button name="explorer" icon="📂" className="w-12 h-12 rounded-xl" />
          <Button name="camera" icon="📷" className="w-12 h-12 rounded-xl" />
          <Button name="notepad" icon="📝" className="w-12 h-12 rounded-xl" />
          <Button name="clock" icon="⏰" className="w-12 h-12 rounded-xl" />
        </div>
      </div>

      {/* Corner element */}
      <StartBtn />
    </div>
  );
}
