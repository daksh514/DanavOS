import Button from "@/components/ui/dashboard/appButtons/Button";
import BottomBar from "@/components/ui/dashboard/BottomBar";
import ReusableWindow from "@/components/ui/dashboard/ReusableWindow";
import WindowManager from "@/lib/WIndowManager";
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
        <Button name="explorer" icon="📂" />
      </div>
      <BottomBar />

      <WindowManager />
    </div>
  );
}

export default Dashboard;
