import HeroText from "@/components/ui/HeroText";
import HomeInput from "@/components/ui/homeInput";
import HomeClock from "@/components/ui/HomeClock";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import UserMediaModel from "@/lib/models/userMedia";

export const dynamic = "force-dynamic"; // ✅ ensure fresh cookies

export default async function Home() {
  const cookieStore = await cookies();
  const name = cookieStore.get("name");
  const password = cookieStore.get("password");
  const userId = cookieStore.get("userId")?.value;

  let pfpLink = "";
  let wallpaper = "/bg.jpg";

  if (userId) {
    await connectDB();
    const mediaDoc = await UserMediaModel.findOne({ userId }).lean().exec();
    pfpLink = mediaDoc?.pfpLink ?? "";
    wallpaper = mediaDoc?.activeWallpaper || wallpaper;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url("/bg.jpg")` }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/45 to-black/60" />

      <div className="w-full max-w-md rounded-3xl border border-white/25 bg-white/10 px-6 py-8 shadow-2xl backdrop-blur-xl sm:px-8">
        <HeroText name={name?.value} pfpLink={pfpLink} />
        <div className="mt-6">
          <HomeInput name={name?.value} password={password?.value} />
        </div>
      </div>

      <HomeClock />
    </div>
  );
}
