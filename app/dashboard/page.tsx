import BottomBar from "@/components/ui/dashboard/BottomBar";
import ReusableWindow from "@/components/ui/dashboard/ReusableWindow";
import Image from "next/image";

function Dashboard() {
  return (
    <div className="min-h-screen font-inter">
      <Image
        src="/solarpunk.jpg"
        alt="background"
        fill
        priority
        className="object-cover -z-10"
      />
      <div className="absolute top-6 left-6 flex flex-col gap-5">
        <div className="w-14 h-14 rounded-2xl text-2xl bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer">
          ⚙️
        </div>
        <div className="w-14 h-14 rounded-2xl text-2xl bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer">
          🧮
        </div>
        <div className="w-14 h-14 rounded-2xl text-2xl bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer">
          🕧
        </div>
      </div>
      <BottomBar />
      <ReusableWindow title="File Explorer">
        <div className="grid grid-cols-4 gap-4 text-center">
          {["Documents", "Photos", "System"].map((folder) => (
            <div
              key={folder}
              className="p-2 hover:bg-blue-100 rounded cursor-pointer"
            >
              📁 <p className="text-xs">{folder}</p>
            </div>
          ))}
        </div>
      </ReusableWindow>
    </div>
  );
}

export default Dashboard;
