"use client"

import { CreateUserForm } from "@/components/createUser"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { userService } from "@/services/userService"
import type { User } from "@/types/api"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  useEffect(() => {
    fetchUsers()
  }, [searchQuery, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const params: any = { limit: 100 }
      if (searchQuery) params.search = searchQuery
      if (roleFilter !== "all") params.role = roleFilter

      const response = await userService.getUsers(params)
      setUsers(response.data)
    } catch (err: any) {
      console.error("[v0] Error fetching users:", err)
      setError(err.response?.data?.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: "user" | "admin" | "hoster") => {
    try {
      await userService.updateUserRole(userId, newRole)
      // Update local state
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
      alert("User role updated successfully")
    } catch (err: any) {
      console.error("[v0] Error updating user role:", err)
      alert(err.response?.data?.message || "Failed to update user role")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await userService.deleteUser(userId)
      setUsers(users.filter((u) => u.id !== userId))
      alert("User deleted successfully")
    } catch (err: any) {
      console.error("[v0] Error deleting user:", err)
      alert(err.response?.data?.message || "Failed to delete user")
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-500 border-red-500"
      case "hoster":
        return "bg-blue-500/20 text-blue-500 border-blue-500"
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="my-4 text-2xl font-semibold py-4">Users</h1>
        <CreateUserForm onSuccess={fetchUsers}>
          <button className="flex items-center text-sm gap-1 bg-indigo-500 text-white rounded-md p-2 px-3 h-fit">
            <Plus size={14} /> Create user
          </button>
        </CreateUserForm>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="hoster">Hoster</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <hr />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-muted-foreground" size={32} />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive text-destructive rounded-md p-4 my-4">
          <p>{error}</p>
        </div>
      ) : (
        <div className="mt-3">
          <div className="rounded-md p-1 min-h-10 bg-background dark:bg-zinc-950/50">
            <div className="grid grid-cols-4 px-5 py-2 text-muted-foreground text-sm">
              <div>User</div>
              <div>Role</div>
              <div>Joined At</div>
              <div>Actions</div>
            </div>

            {users.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">No users found</div>
            ) : (
              <div className="bg-card border border-border border-dashed rounded-md">
                {users.map((user) => (
                  <div key={user.id} className="grid grid-cols-4 items-center px-5 py-2 text-muted-foreground text-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 text-white rounded-full bg-indigo-400 flex justify-center items-center">
                          {user.username?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">
                            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
                          </div>
                          <div className="text-xs">{user.email}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value as any)}>
                        <SelectTrigger className={`w-[120px] border ${getRoleBadgeColor(user.role)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="hoster">Hoster</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
