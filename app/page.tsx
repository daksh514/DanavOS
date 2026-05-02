import HeroText from "@/components/ui/HeroText";
import HomeInput from "@/components/ui/homeInput";
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
    <div className="flex min-h-screen flex-col items-center">
      <div
        className="-z-10 absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("/bg.jpg")` }}
      />

      <div className="mt-40">
        <HeroText name={name?.value} pfpLink={pfpLink} />
        <div className="mt-4">
          <HomeInput name={name?.value} password={password?.value} />
        </div>
      </div>
    </div>
  );
}
