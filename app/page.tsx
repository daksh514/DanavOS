import Image from "next/image";
import HeroText from "@/components/ui/HeroText";
import HomeInput from "@/components/ui/homeInput";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // ✅ ensure fresh cookies

export default async function Home() {
  const cookieStore = await cookies();
  const name = cookieStore.get("name");
  const password = cookieStore.get("password");
  console.log("Cookie 'name' value:", name?.value); // Debug log to check cookie value
  console.log("Cookie 'password' value:", password?.value); // Debug log to check cookie value

  return (
    <div className="flex min-h-screen flex-col items-center">
      <Image
        src="/bg.jpg"
        alt="background"
        fill
        priority
        className="object-cover -z-10"
      />

      <div className="mt-40">
        <HeroText name={name?.value} />
        <div className="mt-4">
          <HomeInput name={name?.value} password={password?.value} />
        </div>
      </div>
    </div>
  );
}
