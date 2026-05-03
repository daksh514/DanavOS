import Button from "@/components/ui/dashboard/appButtons/Button";
import BottomBar from "@/components/ui/dashboard/BottomBar";
import connectDB from "@/lib/db";
import UserMediaModel from "@/lib/models/userMedia";
import WindowManager from "@/lib/WIndowManager";
import { cookies } from "next/headers";
import Image from "next/image";

async function Dashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const wallpaperFromCookie = cookieStore.get("wallpaper")?.value;

  let wallpaper = wallpaperFromCookie || "/bg.jpg";
  if (userId) {
    await connectDB();
    const mediaDoc = await UserMediaModel.findOne({ userId }).lean().exec();
    wallpaper = mediaDoc?.activeWallpaper || wallpaper;
  }
  return (
    <div className="min-h-screen font-inter">
      <Image
        src={wallpaper || "/solarpunk.jpeg"}
        alt="background"
        fill
        priority
        className="object-cover -z-10"
      />
      <div className="absolute top-6 left-6 flex flex-col gap-5">
        <Button name="explorer" icon="📂" />
        <Button name="calculator" icon="🧮" />
        <Button name="camera" icon="📷" />
        <Button name="clock" icon="⏰" />
        <Button name="notepad" icon="📝" />
      </div>
      <BottomBar />

      <WindowManager />
    </div>
  );
}

export default Dashboard;
