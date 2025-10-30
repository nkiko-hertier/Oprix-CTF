export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  role: "user" | "admin" | "hoster"
  createdAt: string
  updatedAt: string
}

export interface Competition {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  status: "draft" | "upcoming" | "active" | "ended"
  isTeamBased: boolean
  isPublic: boolean
  maxTeamSize?: number
  startDate: string
  endDate: string
  organizationName?: string
  organizationUrl?: string
  coverImage?: string
  ownerId: string
  owner?: User
  createdAt: string
  updatedAt: string
}

export interface Challenge {
  id: string
  competitionId: string
  title: string
  description: string
  category: string
  points: number
  difficulty: "Easy" | "Medium" | "Hard"
  flag: string
  hints?: string[]
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ChallengeFile {
  id: string
  challengeId: string
  fileName: string
  fileUrl: string
  fileSize: number
  createdAt: string
}

export interface Submission {
  id: string
  challengeId: string
  userId: string
  teamId?: string
  flag: string
  isCorrect: boolean
  points: number
  submittedAt: string
}

export interface Team {
  id: string
  competitionId: string
  name: string
  description?: string
  captainId: string
  members: TeamMember[]
  score: number
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  user?: User
  role: "captain" | "member"
  joinedAt: string
}

export interface Announcement {
  id: string
  competitionId: string
  title: string
  content: string
  authorId: string
  author?: User
  createdAt: string
  updatedAt: string
}

export interface LeaderboardEntry {
  rank: number
  userId?: string
  teamId?: string
  name: string
  score: number
  solvedChallenges: number
  lastSubmission?: string
}

export interface Notification {
  id: string
  userId: string
  type: "announcement" | "challenge" | "team" | "submission"
  title: string
  message: string
  isRead: boolean
  relatedId?: string
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}
