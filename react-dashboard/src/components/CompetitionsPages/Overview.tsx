"use client"

import React from "react"
import type { Competition } from "@/types"
import { formatTimeAgoOrRemaining } from "@/lib/utils"
import { CalendarDays, Clock, Flag, Shield, Trophy } from "lucide-react"

function Overview({ competition }: { competition: Competition }) {
  return (
    <div className="relative  mx-auto mt-8 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Title Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Shield className="size-6 text-blue-400" />
          {competition.name}
        </h1>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            competition.status === "ACTIVE"
              ? "bg-green-500/20 text-green-400"
              : competition.status === "PAUSED"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {competition.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-white/70 leading-relaxed mb-5">
        {competition.description || "No description available."}
      </p>

      <div className="space-y-4 text-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Start Time */}
        <div className="flex items-start gap-3">
          <CalendarDays className="size-5 text-blue-400 mt-[2px]" />
          <div>
            <p className="text-white/60 uppercase text-xs font-semibold">Starts On</p>
            <p className="text-white font-medium">
              {new Date(competition.startTime).toLocaleString()}
            </p>
            <p className="text-xs text-white/40">
              {formatTimeAgoOrRemaining(competition.startTime)}
            </p>
          </div>
        </div>

        {/* End Time */}
        <div className="flex items-start gap-3">
          <Clock className="size-5 text-purple-400 mt-[2px]" />
          <div>
            <p className="text-white/60 uppercase text-xs font-semibold">Ends On</p>
            <p className="text-white font-medium">
              {new Date(competition.endTime).toLocaleString()}
            </p>
            <p className="text-xs text-white/40">
              {formatTimeAgoOrRemaining(competition.endTime)}
            </p>
          </div>
        </div>

        {/* Admin Info */}
        {competition.admin && (
          <div className="flex items-start gap-3">
            <Flag className="size-5 text-orange-400 mt-[2px]" />
            <div>
              <p className="text-white/60 uppercase text-xs font-semibold">Organizer</p>
              <p className="text-white font-medium">
                {competition.admin.username || competition.admin.email}
              </p>
            </div>
          </div>
        )}

        {/* Rewards / Rules */}
        <div className="flex items-start gap-3">
          <Trophy className="size-5 text-yellow-400 mt-[2px]" />
          <div>
            <p className="text-white/60 uppercase text-xs font-semibold">Rewards</p>
            <p className="text-white font-medium">
              {competition.prize || "To be announced"}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="mt-8 flex justify-end hidden">
        <button className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-medium transition-all duration-200">
          Enroll Now
        </button>
      </div>

      {/* Glow Accent */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
    </div>
  )
}

export default Overview
