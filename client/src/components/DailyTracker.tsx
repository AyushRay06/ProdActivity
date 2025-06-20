import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, Calendar, Trophy } from 'lucide-react';
import { Task, DailyProgress } from '@/pages/Index';

interface DailyTrackerProps {
  tasks: Task[];
  dailyProgress: DailyProgress[];
  onUpdateProgress: (date: string, completedTaskIds: string[]) => void;
}

const DailyTracker: React.FC<DailyTrackerProps> = ({
  tasks,
  dailyProgress,
  onUpdateProgress
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getCurrentProgress = () => {
    const dateStr = formatDate(currentDate);
    return dailyProgress.find(p => p.date === dateStr);
  };

  const handleTaskToggle = (taskId: string, checked: boolean) => {
    const dateStr = formatDate(currentDate);
    const currentProgress = getCurrentProgress();
    const currentCompletedTasks = currentProgress?.completedTasks || [];
    
    let updatedTasks;
    if (checked) {
      updatedTasks = [...currentCompletedTasks, taskId];
    } else {
      updatedTasks = currentCompletedTasks.filter(id => id !== taskId);
    }
    
    onUpdateProgress(dateStr, updatedTasks);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const isToday = () => {
    const today = new Date();
    return formatDate(currentDate) === formatDate(today);
  };

  const currentProgress = getCurrentProgress();
  const completedTaskIds = currentProgress?.completedTasks || [];
  const todayPoints = currentProgress?.totalPoints || 0;

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayProgress = dailyProgress.find(p => p.date === formatDate(date));
      
      days.push({
        date,
        points: dayProgress?.totalPoints || 0,
        isToday: formatDate(date) === formatDate(today),
        isSelected: formatDate(date) === formatDate(currentDate)
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-6">
      {/* Mini Calendar */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-100">
            <Calendar className="h-5 w-5" />
            30-Day Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {/* Fill empty cells for proper alignment */}
            {Array.from({ length: calendarDays[0]?.date.getDay() || 0 }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}
            
            {calendarDays.map((day, index) => (
              <button
                key={index}
                onClick={() => setCurrentDate(new Date(day.date))}
                className={`
                  p-2 text-sm rounded-lg border transition-all duration-200 hover:scale-105
                  ${day.isSelected 
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg' 
                    : day.isToday 
                    ? 'bg-purple-700/30 border-purple-500 text-purple-200' 
                    : day.points > 0 
                    ? 'bg-gray-700 border-purple-400 text-purple-200' 
                    : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
                  }
                `}
              >
                <div className="font-medium">{day.date.getDate()}</div>
                {day.points > 0 && (
                  <div className="text-xs mt-1">
                    {day.points}pt
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Task Tracker */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-gray-100">
              <Trophy className="h-5 w-5" />
              {isToday() ? "Today's Tasks" : "Daily Tasks"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigateDate('prev')}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium min-w-[120px] text-center text-gray-200">
                {currentDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <Button
                onClick={() => navigateDate('next')}
                variant="outline"
                size="sm"
                disabled={formatDate(currentDate) >= formatDate(new Date())}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {todayPoints > 0 && (
            <div className="text-center p-4 bg-gradient-to-r from-purple-800/30 to-purple-600/30 rounded-lg border border-purple-500/30">
              <p className="text-lg font-semibold text-gray-100">
                🎉 {todayPoints} points earned {isToday() ? 'today' : 'this day'}!
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p>No tasks available. Create some tasks first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => {
                const isCompleted = completedTaskIds.includes(task.id);
                return (
                  <div
                    key={task.id}
                    className={`
                      flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-200
                      ${isCompleted 
                        ? 'bg-purple-700/20 border-purple-500 shadow-sm' 
                        : 'bg-gray-700/30 border-gray-600 hover:border-gray-500'
                      }
                    `}
                  >
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={isCompleted}
                      onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                      className="h-5 w-5"
                    />
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: task.color }}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`
                        flex-1 font-medium cursor-pointer transition-all duration-200
                        ${isCompleted ? 'text-purple-200 line-through' : 'text-gray-100'}
                      `}
                    >
                      {task.name}
                    </label>
                    <div className={`
                      text-sm font-bold px-3 py-1 rounded-full transition-all duration-200
                      ${isCompleted 
                        ? 'bg-purple-600/30 text-purple-200' 
                        : 'bg-gray-600 text-gray-300'
                      }
                    `}>
                      {task.points} pts
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-700/20 to-purple-600/20 rounded-lg border border-purple-500/30">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-100">
                    {isToday() ? "Today's Total:" : "Day Total:"}
                  </span>
                  <span className="text-2xl font-bold text-purple-300">
                    {todayPoints} points
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  {completedTaskIds.length} of {tasks.length} tasks completed
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyTracker;
