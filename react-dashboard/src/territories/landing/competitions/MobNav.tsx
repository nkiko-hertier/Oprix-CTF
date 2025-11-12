import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../../components/ui/drawer";
import { ArrowRight, Menu } from "lucide-react"
import {Link} from "react-router-dom";

export function MobNav() {
  return (
    <Drawer>
      {/* 1. The Trigger to open the drawer */}
      <DrawerTrigger asChild>
        <Menu />
      </DrawerTrigger>

      {/* 2. The sliding panel content */}
      <DrawerContent className="bg-slate-950/10 backdrop-blur-2xl text-white border-none! h-[70%]!">
        <div className="mx-auto w-full max-w-sm h-full flex flex-col justify-between">
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>
              Navigate to your preferred page
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 mt-15">
            <DrawerClose asChild>

           <ul className="flex gap-5 flex-col justify-center items-center">
              <li>
                {" "}
                <Link to="/">Home</Link>{" "}
              </li>
              <li>
                {" "}
                <Link className="text-slate-500" to="/competitions">
                  Competitions
                </Link>{" "}
              </li>
              <li>
                {" "}
                <Link className="text-slate-500" to="/about-us">
                  About us
                </Link>{" "}
              </li>
              <li>
                {" "}
                <Link className="text-slate-500" to="/faq">
                  FAQ
                </Link>{" "}
              </li>
            </ul>
            </DrawerClose>
          </div>

          <DrawerFooter>
            
            <div className="flex justify-center gap-2 *:cursor-pointer mb-10">
              <button className="p-1 rounded-full px-5 bg-gradient-to-tl from-slate-800 to-slate-900 border-slate-700 border">
                Login
              </button>
              <button className="p-1 rounded-full px-5 bg-gradient-to-tl from-blue-500 to-blue-700 border-slate-700 border flex gap-2 items-center">
                Signup <ArrowRight size={17} />
              </button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}