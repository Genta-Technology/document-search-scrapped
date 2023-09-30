import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main className="w-full flex flex-center flex-col gap-5 items-center h-screen">
      <div className="items-center p-[3vw] gap-2">
        <Link href="/" className="">
          <Image src="/Genta_Logo.png" width={100} height={100} alt="Logo" />
        </Link>
        <p className="">Document Search</p>
      </div>
    </main>
  );
}
