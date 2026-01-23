"use client";

import React, { useEffect, useState } from "react";
import MainTab from "./Tab";
import Announcements from "./CompetitionsPages/Announcements";
import Overview from "./CompetitionsPages/Overview";
import Challanges from "./CompetitionsPages/Challanges";
import Members from "./CompetitionsPages/Members";
import Teams from "./CompetitionsPages/Teams";
import Leaderboard from "./CompetitionsPages/Leaderboard";
import type { Competition } from "@/types";
import CertificatesPage from "./CompetitionsPages/Certificates";

interface CompetitonsPagesProps {
  id: any;
}

function CompetitionsPages({ competition }: { competition: Competition }) {
  const { id } = competition;
  const [activeTab, setActiveTab] = useState("Overview");

  const Links = [
    { name: "Announcements", tab: "announcements" },
    { name: "Overview", tab: "Overview" },
    { name: "Leaderboard", tab: "leaderboard" },
    { name: "Challanges", tab: "challanges" },
    { name: "Certificate", tab: "certificate" },
  ];
  
  // filtered links
  let filteredLinks =
    competition.status !== "ACTIVE"
      ? Links.filter(
          link =>
            link.tab !== "announcements" &&
            link.tab !== "challanges"
        )
      : Links;
    filteredLinks = 
    competition.status !== "COMPLETED"
      ? filteredLinks.filter(
          link =>
            link.tab !== "certificate"
        )
      : filteredLinks;
  

  // ✅ Detect and apply hash-based tab
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && Links.some((link) => link.tab === hash)) {
        setActiveTab(hash);
        // optional: smooth scroll to the section
        document
          .getElementById(hash)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // Run on mount
    applyHash();

    // Listen for hash changes
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  // ✅ Update hash when tab changes (for shareable URLs)
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  return (
    <div>
      {/* Tabs Links */}
      <ul className="flex gap-3 text-slate-400">
        {filteredLinks.map((link) => (
          <li
            key={link.tab}
            className={`cursor-pointer pb-2 ${
              activeTab === link.tab
                ? "border-b-2 border-blue-500 text-white"
                : ""
            }`}
            onClick={() => setActiveTab(link.tab)}
          >
            {link.name}
          </li>
        ))}
      </ul>

      {/* Tabs Content */}
      <div className="mt-4">
        <MainTab tab="announcements" activeTab={activeTab}>
          <Announcements id={id} />
        </MainTab>

        <MainTab tab="Overview" activeTab={activeTab}>
          <Overview competition={competition} />
        </MainTab>

        <MainTab tab="challanges" activeTab={activeTab}>
          <Challanges competitionId={id} />
        </MainTab>

        <MainTab tab="memebers" activeTab={activeTab}>
          <Members id={id} />
        </MainTab>

        <MainTab tab="teams" activeTab={activeTab}>
          <Teams id={id} />
        </MainTab>

        <MainTab tab="certificate" activeTab={activeTab}>
          <CertificatesPage competitionId={id} />
        </MainTab>

        <MainTab tab="leaderboard" activeTab={activeTab}>
          <Leaderboard competitionId={id} isTeamBased={competition.isTeamBased} />
        </MainTab>
      </div>
    </div>
  );
}

export default CompetitionsPages;
