import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Award, Calendar, Target } from 'lucide-react';
import { Task, DailyProgress } from '@/pages/Index';

interface AnalyticsProps {
  tasks: Task[];
  dailyProgress: DailyProgress[];
}

const Analytics: React.FC<AnalyticsProps> = ({ tasks, dailyProgress }) => {
  // Generate 30 days of data for the chart
  const generateChartData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayProgress = dailyProgress.find(p => p.date === dateStr);
      const points = dayProgress?.totalPoints || 0;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        points,
        fullDate: dateStr
      });
    }
    
    return data;
  };

  // Calculate task consistency
  const calculateTaskConsistency = () => {
    return tasks.map(task => {
      const completions = dailyProgress.filter(day => 
        day.completedTasks.includes(task.id)
      ).length;
      
      const totalDays = dailyProgress.length || 1;
      const consistency = Math.round((completions / totalDays) * 100);
      
      return {
        name: task.name,
        completions,
        consistency,
        color: task.color,
        totalPoints: completions * task.points
      };
    }).sort((a, b) => b.consistency - a.consistency);
  };

  // Calculate productivity score
  const calculateProductivityScore = () => {
    if (dailyProgress.length === 0) return 0;
    
    const totalPossiblePoints = tasks.reduce((sum, task) => sum + task.points, 0) * dailyProgress.length;
    const earnedPoints = dailyProgress.reduce((sum, day) => sum + day.totalPoints, 0);
    
    return Math.round((earnedPoints / totalPossiblePoints) * 100);
  };

  // Get best and worst days
  const getBestAndWorstDays = () => {
    if (dailyProgress.length === 0) return { best: null, worst: null };
    
    const sorted = [...dailyProgress].sort((a, b) => b.totalPoints - a.totalPoints);
    return {
      best: sorted[0],
      worst: sorted[sorted.length - 1]
    };
  };

  const chartData = generateChartData();
  const taskConsistency = calculateTaskConsistency();
  const productivityScore = calculateProductivityScore();
  const { best, worst } = getBestAndWorstDays();
  
  const totalPoints = dailyProgress.reduce((sum, day) => sum + day.totalPoints, 0);
  const averageDaily = dailyProgress.length > 0 ? Math.round(totalPoints / dailyProgress.length) : 0;
  const activeDays = dailyProgress.filter(day => day.totalPoints > 0).length;

  const cardStyle = 'bg-gray-800/50 border-gray-600 text-gray-100';

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={cardStyle}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Productivity Score</p>
                <p className="text-3xl font-bold text-gray-100">{productivityScore}%</p>
              </div>
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-purple-700">
                <Award className="h-6 w-6 text-purple-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cardStyle}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Days</p>
                <p className="text-3xl font-bold text-gray-100">{activeDays}</p>
              </div>
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-purple-700">
                <Calendar className="h-6 w-6 text-purple-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cardStyle}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Daily Average</p>
                <p className="text-3xl font-bold text-gray-100">{averageDaily}</p>
              </div>
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-purple-700">
                <TrendingUp className="h-6 w-6 text-purple-200" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Progress Chart */}
      <Card className={cardStyle}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-100">
            <TrendingUp className="h-5 w-5" />
            Daily Progress (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#6B7280" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value) => [`${value} points`, 'Points']}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #6B7280',
                  color: '#F3F4F6'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="points" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2, fill: '#1F2937' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Task Consistency */}
      <Card className={cardStyle}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-100">
            <Target className="h-5 w-5" />
            Task Consistency
          </CardTitle>
        </CardHeader>
        <CardContent>
          {taskConsistency.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p>No task data available yet. Start tracking to see your consistency!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {taskConsistency.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: task.color }}
                    />
                    <div>
                      <h3 className="font-medium text-gray-100">{task.name}</h3>
                      <p className="text-sm text-gray-400">
                        {task.completions} completions • {task.totalPoints} total points
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-100">{task.consistency}%</div>
                    <div className="text-sm text-gray-400">consistency</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Best and Worst Days */}
      {(best || worst) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {best && (
            <Card className="bg-gradient-to-r from-gray-800/50 to-purple-700/50 border-purple-600">
              <CardHeader>
                <CardTitle className="text-gray-100">🏆 Best Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">
                    {new Date(best.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-2xl font-bold text-gray-100">{best.totalPoints} points</p>
                  <p className="text-sm text-gray-300">
                    {best.completedTasks.length} tasks completed
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {worst && worst.totalPoints > 0 && (
            <Card className="bg-gradient-to-r from-gray-900/50 to-gray-700/50 border-gray-600">
              <CardHeader>
                <CardTitle className="text-gray-100">📈 Room for Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">
                    {new Date(worst.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-2xl font-bold text-gray-100">{worst.totalPoints} points</p>
                  <p className="text-sm text-gray-300">
                    {worst.completedTasks.length} tasks completed
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Monthly Summary */}
      <Card className="bg-gradient-to-r from-gray-800/50 to-purple-700/50 border-purple-600">
        <CardHeader>
          <CardTitle className="text-gray-100">📊 Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-200">{totalPoints}</p>
              <p className="text-sm text-gray-400">Total Points</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-200">{activeDays}</p>
              <p className="text-sm text-gray-400">Active Days</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-200">{averageDaily}</p>
              <p className="text-sm text-gray-400">Daily Average</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-200">{productivityScore}%</p>
              <p className="text-sm text-gray-400">Overall Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
