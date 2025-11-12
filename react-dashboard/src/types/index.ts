// User Types
export type UserRole = "USER" | "ADMIN" | "SUPERADMIN"

export interface User {
  id: string
  clerkId: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  bio?: string
  avatarUrl?: string
  country?: string
  website?: string
  github?: string
  linkedin?: string
  skills?: string[]
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Admin {
  id: string
  email: string
  username: string
}

export interface UserStats {
  totalPoints: number
  challengesSolved: number
  challengesAttempted: number
  globalRank: number
  winRate: number
  averageTime: number
}

// Competition Types
export type CompetitionStatus = "DRAFT" | "REGISTRATION_OPEN" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED"
export type CompetitionType = "JEOPARDY" | "ATTACK_DEFENSE" | "KING_OF_THE_HILL" | "MIXED"

export interface Competition {
  id: string
  name: string
  description: string
  startTime: string
  prize: string,
  endTime: string
  type: CompetitionType
  status: CompetitionStatus
  isTeamBased: boolean
  maxTeamSize?: number
  maxParticipants?: number
  requireApproval: boolean
  isPublic: boolean
  allowedCategories: string[]
  participantCount: number
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
  admin?: User
}

// Challenge Types
export type ChallengeDifficulty = "TRIVIAL" | "EASY" | "MEDIUM" | "HARD" | "INSANE"

export interface Challenge {
  id: string
  competitionId: string
  title: string
  description: string
  category: string
  difficulty: ChallengeDifficulty
  points: number
  caseSensitive: boolean
  normalizeFlag: boolean
  isVisible: boolean
  isDynamic: boolean
  url?: string
  metadata?: Record<string, any>
  hints?: Hint[]
  solveCount?: number
  isSolved?: boolean
  createdAt: string
  updatedAt: string
}

export interface Hint {
  id: string
  content: string
  cost: number
  order: number
  isUnlocked?: boolean
}

// Submission Types
export interface Submission {
  id: string
  userId: string
  challengeId: string
  competitionId: string
  teamId?: string
  flag: string
  isCorrect: boolean
  pointsEarned: number
  submittedAt: string
  createdAt: string
}

// Team Types
export interface Team {
  id: string
  name: string
  description?: string
  inviteCode: string
  captain: User
  members: User[]
  maxSize: number
  createdAt: string
  updatedAt: string
}

export interface TeamStats {
  totalPoints: number
  memberCount: number
  challengesSolved: number
  averageScore: number
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number
  userId?: string
  teamId?: string
  name: string
  score: number
  solvedChallenges: number
  lastSubmission?: string
  avatar?: string
}

export interface TeamLeaderboardEntry {
  rank: number
  teamId: string
  teamName: string
  score: number
  memberCount: number
  solvedChallenges: number
  lastSubmission?: string
}

// File Types
export interface FileRecord {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  challengeId?: string
  description?: string
  downloadCount: number
  createdAt: string
}

// Error Types
export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
  timestamp?: string
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

// Request DTOs
export interface CreateCompetitionDto {
  name: string
  description: string
  startTime: string
  endTime: string
  type: CompetitionType
  isTeamBased?: boolean
  maxTeamSize?: number
  maxParticipants?: number
  requireApproval?: boolean
  isPublic?: boolean
  allowedCategories?: string[]
  metadata?: Record<string, any>
}

export interface CreateChallengeDto {
  title: string
  description: string
  category: string
  difficulty: ChallengeDifficulty
  points: number
  flag: string
  caseSensitive?: boolean
  normalizeFlag?: boolean
  isVisible?: boolean
  isDynamic?: boolean
  url?: string
  metadata?: Record<string, any>
  hints?: Array<{ content: string; cost: number; order: number }>
}

export interface CreateSubmissionDto {
  challengeId: string
  flag: string
  teamId?: string
}

export interface CreateTeamDto {
  name: string
  description?: string
  maxSize?: number
  competitionId: string
}

export interface JoinTeamDto {
  inviteCode: string
}

export interface UpdateProfileDto {
  firstName?: string
  lastName?: string
  bio?: string
  avatarUrl?: string
  country?: string
  website?: string
  github?: string
  linkedin?: string
  skills?: string[]
}
