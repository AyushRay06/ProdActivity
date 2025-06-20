import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, BarChart3, Calendar, Target } from "lucide-react"
import TaskManager from "@/components/TaskManager"
import DailyTracker from "@/components/DailyTracker"
import Analytics from "@/components/Analytics"
import MotivationalMessage from "@/components/MotivationalMessage"

import Navbar from "@/components/Navbar.tsx"

export interface Task {
  id: string
  name: string
  points: number
  color: string
}

export interface DailyProgress {
  date: string
  completedTasks: string[]
  totalPoints: number
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<"tracker" | "tasks" | "analytics">(
    "tracker"
  )
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", name: "Code", points: 4, color: "#6B46C1" },
    { id: "2", name: "Apply to jobs", points: 3, color: "#7C3AED" },
    { id: "3", name: "Gym", points: 2, color: "#8B5CF6" },
    { id: "4", name: "Diet", points: 1, color: "#A78BFA" },
    { id: "5", name: "Learning", points: 3, color: "#C4B5FD" },
  ])

  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("productivity-tasks")
    const savedProgress = localStorage.getItem("productivity-progress")

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }

    if (savedProgress) {
      setDailyProgress(JSON.parse(savedProgress))
    }
  }, [])

  // Save data to localStorage when tasks or progress changes
  useEffect(() => {
    localStorage.setItem("productivity-tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("productivity-progress", JSON.stringify(dailyProgress))
  }, [dailyProgress])

  const updateDailyProgress = (date: string, completedTaskIds: string[]) => {
    const totalPoints = completedTaskIds.reduce((sum, taskId) => {
      const task = tasks.find((t) => t.id === taskId)
      return sum + (task?.points || 0)
    }, 0)

    setDailyProgress((prev) => {
      const existing = prev.find((p) => p.date === date)
      if (existing) {
        return prev.map((p) =>
          p.date === date
            ? { ...p, completedTasks: completedTaskIds, totalPoints }
            : p
        )
      } else {
        return [
          ...prev,
          { date, completedTasks: completedTaskIds, totalPoints },
        ]
      }
    })
  }

  const calculateTotalPoints = () => {
    return dailyProgress.reduce((sum, day) => sum + day.totalPoints, 0)
  }

  const getCurrentStreak = () => {
    const today = new Date()
    let streak = 0

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const dayProgress = dailyProgress.find((p) => p.date === dateStr)
      if (dayProgress && dayProgress.totalPoints > 0) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Navbar />
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-100">
            💀 STAY HARD TRACKER.
          </h1>
          <p className="text-lg text-gray-400">
            "You have to be willing to go to war with yourself" - David Goggins
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Total Points</p>
                  <p className="text-2xl font-bold">{calculateTotalPoints()}</p>
                </div>
                <Target className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100 border-gray-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Current Streak</p>
                  <p className="text-2xl font-bold">
                    {getCurrentStreak()} days
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 border-gray-400">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Active Tasks</p>
                  <p className="text-2xl font-bold">{tasks.length}</p>
                </div>
                <Plus className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-gray-500 to-purple-600 text-gray-100 border-purple-400">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300">Avg. Daily</p>
                  <p className="text-2xl font-bold">
                    {dailyProgress.length > 0
                      ? Math.round(
                          calculateTotalPoints() / dailyProgress.length
                        )
                      : 0}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Message */}
        <MotivationalMessage
          totalPoints={calculateTotalPoints()}
          streak={getCurrentStreak()}
          todayPoints={(() => {
            const today = new Date().toISOString().split("T")[0]
            const todayProgress = dailyProgress.find((p) => p.date === today)
            return todayProgress?.totalPoints || 0
          })()}
        />

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 rounded-lg p-2 shadow-sm border bg-gray-900 border-gray-700">
          <Button
            onClick={() => setActiveTab("tracker")}
            variant={activeTab === "tracker" ? "default" : "ghost"}
            className={`flex-1 min-w-[120px] ${
              activeTab === "tracker"
                ? "bg-purple-600 hover:bg-purple-700 text-gray-100"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
            }`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Daily Tracker
          </Button>
          <Button
            onClick={() => setActiveTab("tasks")}
            variant={activeTab === "tasks" ? "default" : "ghost"}
            className={`flex-1 min-w-[120px] ${
              activeTab === "tasks"
                ? "bg-purple-600 hover:bg-purple-700 text-gray-100"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
            }`}
          >
            <Target className="h-4 w-4 mr-2" />
            Manage Tasks
          </Button>
          <Button
            onClick={() => setActiveTab("analytics")}
            variant={activeTab === "analytics" ? "default" : "ghost"}
            className={`flex-1 min-w-[120px] ${
              activeTab === "analytics"
                ? "bg-purple-600 hover:bg-purple-700 text-gray-100"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "tracker" && (
            <DailyTracker
              tasks={tasks}
              dailyProgress={dailyProgress}
              onUpdateProgress={updateDailyProgress}
            />
          )}

          {activeTab === "tasks" && (
            <TaskManager tasks={tasks} onTasksChange={setTasks} />
          )}

          {activeTab === "analytics" && (
            <Analytics tasks={tasks} dailyProgress={dailyProgress} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Index
