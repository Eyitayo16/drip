"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { Crown, LogOut, Settings, User, Eye, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AdminHeaderProps {
  title: string
  description: string
  onSave?: () => void
  isSaving?: boolean
}

export function AdminHeader({ title, description, onSave, isSaving }: AdminHeaderProps) {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [notifications] = useState(3) // Mock notification count

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-400 text-black"
      case "admin":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3" />
      case "admin":
        return <Settings className="h-3 w-3" />
      default:
        return <User className="h-3 w-3" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Crown className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                {notifications}
              </Badge>
            )}
          </Button>

          {/* Preview Site */}
          <Button
            onClick={() => window.open("/", "_blank")}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview Site
          </Button>

          {/* Save Button */}
          {onSave && (
            <Button
              onClick={onSave}
              disabled={isSaving}
              className="bg-yellow-400 hover:bg-yellow-500 text-black flex items-center gap-2"
              size="sm"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback className="bg-yellow-400 text-black">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <Badge className={`text-xs ${getRoleColor(user?.role || "")}`}>
                      <span className="flex items-center gap-1">
                        {getRoleIcon(user?.role || "")}
                        {user?.role}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
