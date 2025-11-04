import BgSvg from "@/app/(landings)/competitions/BgSvg";
import Link from "next/link";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <div className="flex justify-center items-center h-screen overflow-y-auto flex-col">
          <Link href="/" className="mb-10 hover:scale-105 transition-transform">
            <img src="/img/logo_icon.png" alt="Oprix CTF Logo" width={80} height={80} />
          </Link>
            {children}
            <BgSvg className="fixed right-0 -z-10 -top-2" />
            <BgSvg className="fixed left-0 scale-x-[-1] -z-10 -top-2" />
        </div>
    </>
  );
}

export default layout;
