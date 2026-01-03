'use client'

import { useState, useEffect } from 'react'
import ChallengeCard from '../ChallengeCard'
import ChallengePopup from '../ChallengePopup'

import getApiClient from '@/lib/api-client'
import { toast } from 'sonner'
import type { Challenge } from '@/types'
import { triggerSideCannons } from '@/lib/confetti'

// shadcn
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const PublicChallanges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  const [selected, setSelected] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [correctIds, setCorrectIds] = useState<string[]>([])

  // 🔎 Filters
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | undefined>()
  const [difficulty, setDifficulty] = useState<string | undefined>()
  const [solved, setSolved] = useState(false)
  const [unsolved, setUnsolved] = useState(false)

  const handleOpen = (id: string) => {
    setSelected(id)
    setOpen(true)
  }

  const handleAddCorrect = (id: string | null) => {
    if (!id) return
    setCorrectIds((prev) => [...prev, id])
    setOpen(false)
    triggerSideCannons()
  }

  const fetchChallenges = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (search) params.append('search', search)
      if (category) params.append('category', category)
      if (difficulty) params.append('difficulty', difficulty)
      if (solved) params.append('solved', 'true')
      if (unsolved) params.append('unsolved', 'true')

      const res = await getApiClient().get(
        `/challenges/public?${params.toString()}`
      )

      setChallenges(res.data)
    } catch (error) {
      toast.error('Failed to load challenges.')
    } finally {
      setLoading(false)
    }
  }

  // initial load
  useEffect(() => {
    fetchChallenges()
  }, [])

  // debounce search + filters
  useEffect(() => {
    const t = setTimeout(fetchChallenges, 300)
    return () => clearTimeout(t)
  }, [search, category, difficulty, solved, unsolved])

  if (loading)
    return (
      <div>
        <div className="skeleton w-[120px]! h-[32px]!"></div>
        <div className="mt-4 space-y-2">
          <div className="skeleton h-[100px]!"></div>
          <div className="skeleton h-[100px]!"></div>
          <div className="skeleton h-[100px]!"></div>
        </div>
      </div>
    )

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Challenges</h2>

      {/* ================= FILTER BAR ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {/* Search */}
        <Input
          placeholder="Search challenges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frontend">Frontend</SelectItem>
            <SelectItem value="backend">Backend</SelectItem>
            <SelectItem value="algorithms">Algorithms</SelectItem>
            <SelectItem value="system-design">System Design</SelectItem>
          </SelectContent>
        </Select> */}

        {/* Difficulty */}
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BEGINNER">Beginner</SelectItem>
            <SelectItem value="EASY">Easy</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HARD">Hard</SelectItem>
            <SelectItem value="EXPERT">Expert</SelectItem>
          </SelectContent>
        </Select>

        {/* Solved
        <div className="flex items-center gap-2 px-2">
          <Checkbox
            id="solved"
            checked={solved}
            onCheckedChange={(v) => {
              setSolved(Boolean(v))
              if (v) setUnsolved(false)
            }}
          />
          <Label htmlFor="solved">Solved</Label>
        </div>

        {/* Unsolved
        <div className="flex items-center gap-2 px-2">
          <Checkbox
            id="unsolved"
            checked={unsolved}
            onCheckedChange={(v) => {
              setUnsolved(Boolean(v))
              if (v) setSolved(false)
            }}
          />
          <Label htmlFor="unsolved">Unsolved</Label>
        </div> */}
      </div>

      {/* ================= CHALLENGE LIST ================= */}
      <div className="space-y-2">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            title={challenge.title}
            description={challenge.description}
            difficulty={challenge.difficulty}
            points={challenge.points}
            timeLimit={challenge.timeLimit}
            onStart={() => handleOpen(challenge.id)}
            isSolved={
              correctIds.includes(challenge.id) || challenge.isSolved
            }
          />
        ))}
      </div>

      {/* Popup */}
      <ChallengePopup
        challengeId={selected}
        open={open}
        onCorrect={() => handleAddCorrect(selected)}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}

export default PublicChallanges
