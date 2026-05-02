import BottomBar from "@/components/ui/dashboard/BottomBar";
import Image from "next/image";

function Dashboard() {
  return (
    <div className="min-h-screen ">
      <Image
        src="/solarpunk.jpg"
        alt="background"
        fill
        priority
        className="object-cover -z-10"
      />
      <BottomBar />
    </div>
  );
}

export default Dashboard;
