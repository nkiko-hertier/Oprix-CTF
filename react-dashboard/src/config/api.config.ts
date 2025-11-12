// API Configuration
export const API_CONFIG = {
  baseURL: "/api/v1",
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
}

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    ME: "/auth/me",
    CLERK: "/auth/clerk",
    WEBHOOK: "/auth/webhook",
    HEALTH: "/auth/health",
  },
  // Users
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    ME: "/users/me",
    ME_STATS: "/users/me/stats",
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    STATS: (id: string) => `/users/${id}/stats`,
    UPDATE_ROLE: (id: string) => `/users/${id}/role`,
  },
  // Competitions
  COMPETITIONS: {
    LIST: "/competitions",
    CREATE: "/competitions",
    GET: (id: string) => `/competitions/${id}`,
    UPDATE: (id: string) => `/competitions/${id}`,
    DELETE: (id: string) => `/competitions/${id}`,
    UPDATE_STATUS: (id: string) => `/competitions/${id}/status`,
    REGISTER: (id: string) => `/competitions/${id}/register`,
    UNREGISTER: (id: string) => `/competitions/${id}/register`,
  },
  // Challenges
  CHALLENGES: {
    LIST: (compId: string) => `/competitions/${compId}/challenges`,
    CREATE: (compId: string) => `/competitions/${compId}/challenges`,
    GET: (compId: string, chalId: string) => `/competitions/${compId}/challenges/${chalId}`,
    UPDATE: (compId: string, chalId: string) => `/competitions/${compId}/challenges/${chalId}`,
    DELETE: (compId: string, chalId: string) => `/competitions/${compId}/challenges/${chalId}`,
    CREATE_HINT: (compId: string, chalId: string) => `/competitions/${compId}/challenges/${chalId}/hints`,
    UNLOCK_HINT: (compId: string, chalId: string, hintId: string) =>
      `/competitions/${compId}/challenges/${chalId}/hints/${hintId}/unlock`,
  },
  // Submissions
  SUBMISSIONS: {
    CREATE: "/submissions",
    GET_MY: "/submissions/my",
    GET_ADMIN: "/submissions/admin",
    GET_ONE: (id: string) => `/submissions/${id}`,
    GET_BY_CHALLENGE: (chalId: string) => `/submissions/challenge/${chalId}`,
    GET_BY_COMPETITION: (compId: string) => `/submissions/competition/${compId}`,
  },
  // Leaderboard
  LEADERBOARD: {
    COMPETITION: (compId: string) => `/leaderboard/competition/${compId}`,
    COMPETITION_TEAM: (compId: string) => `/leaderboard/competition/${compId}/team`,
    GLOBAL: "/leaderboard/global",
    USER_RANK: (userId: string, compId: string) => `/leaderboard/user/${userId}/competition/${compId}`,
    MY_RANK: (compId: string) => `/leaderboard/my/competition/${compId}`,
    TEAM_RANK: (teamId: string, compId: string) => `/leaderboard/team/${teamId}/competition/${compId}`,
    LIVE: (compId: string) => `/leaderboard/live/${compId}`,
  },
  // Teams
  TEAMS: {
    LIST: "/teams",
    CREATE: "/teams",
    JOIN: "/teams/join",
    GET: (id: string) => `/teams/${id}`,
    UPDATE: (id: string) => `/teams/${id}`,
    DELETE: (id: string) => `/teams/${id}`,
    LEAVE: (id: string) => `/teams/${id}/leave`,
    KICK: (id: string) => `/teams/${id}/kick`,
    TRANSFER_CAPTAINCY: (id: string) => `/teams/${id}/transfer-captaincy`,
    STATS: (id: string) => `/teams/${id}/stats`,
  },
  // Files
  FILES: {
    UPLOAD: "/files/upload",
    LIST: "/files",
    GET_CHALLENGE: (chalId: string) => `/files/challenge/${chalId}`,
    DOWNLOAD: (fileName: string) => `/files/download/${fileName}`,
    GET_ONE: (id: string) => `/files/${id}`,
    DELETE: (id: string) => `/files/${id}`,
  },
  // Admin
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    PLAYERS: "/admin/players",
    BAN_PLAYER: (userId: string) => `/admin/players/${userId}/ban`,
    SUBMISSIONS: "/admin/submissions",
    COMPETITION_STATS: (compId: string) => `/admin/competitions/${compId}/stats`,
  },
  // Health
  HEALTH: {
    CHECK: "/health",
    DETAILED: "/health/detailed",
    READY: "/health/ready",
    LIVE: "/health/live",
  },
}
