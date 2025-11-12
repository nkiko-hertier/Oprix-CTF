import React from "react";
import Link from "next/link";
import { CompetitionCard } from "@/app/components/HomeCards";
import { Search } from "lucide-react";
function page() {
  return (
    <div>
      <section className="py-10 gap-2 flex flex-col justify-center">
        <h1 className="text-4xl font-bold">Explore Competitions</h1>
        <p className="text-slate-400">Grow endlessly with our Competition</p>
        <div className="flex gap-3 mt-5">
          <label
            htmlFor="search"
            className="flex bg-gradient-to-tl from-slate-700/25 to-slate-800 rounded-md p-1 pl-3 w-full"
          >
            <input
              placeholder="search by keywords..."
              className="outline-none w-full"
              name="search"
              id="search"
            />
            <Link
              className="p-2 flex gap-2 px-5 w-fit rounded-md items-center bg-gradient-to-bl hover:scale-110 from-blue-500 to-blue-700"
              href={"#"}
            >
              <Search size={15} />
              Search
            </Link>
          </label>
        </div>
      </section>
      <section>
        <h1 className="my-5">Recent Competition</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <CompetitionCard />
          <CompetitionCard />
          <CompetitionCard />
          <CompetitionCard />
          <CompetitionCard />
          <CompetitionCard />
        </div>
      </section>
    </div>
  );
}

export default page;
