import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Trash2, Target, Save, X } from 'lucide-react';
import { Task } from '@/pages/Index';

interface TaskManagerProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onTasksChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ name: '', points: 1 });
  const [editTask, setEditTask] = useState({ name: '', points: 1 });

  const colors = [
    '#6B46C1', '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD',
    '#9333EA', '#A855F7', '#B87DF0', '#D8B4FE', '#EDE9FE'
  ];

  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  const handleAddTask = () => {
    if (newTask.name.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        name: newTask.name.trim(),
        points: Math.max(1, newTask.points),
        color: getRandomColor()
      };
      onTasksChange([...tasks, task]);
      setNewTask({ name: '', points: 1 });
      setIsAdding(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingId(task.id);
    setEditTask({ name: task.name, points: task.points });
  };

  const handleSaveEdit = () => {
    if (editTask.name.trim() && editingId) {
      onTasksChange(tasks.map(task => 
        task.id === editingId 
          ? { ...task, name: editTask.name.trim(), points: Math.max(1, editTask.points) }
          : task
      ));
      setEditingId(null);
      setEditTask({ name: '', points: 1 });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    onTasksChange(tasks.filter(task => task.id !== taskId));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTask({ name: '', points: 1 });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-100">
            <Plus className="h-5 w-5" />
            Manage Your Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-6">
            Create and customize your daily tasks. Assign point values based on importance or difficulty.
          </p>

          {/* Add New Task */}
          {!isAdding ? (
            <Button 
              onClick={() => setIsAdding(true)}
              className="mb-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Task
            </Button>
          ) : (
            <Card className="mb-6 border-2 border-purple-500 bg-gray-700/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="task-name" className="text-gray-300">Task Name</Label>
                    <Input
                      id="task-name"
                      value={newTask.name}
                      onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                      placeholder="e.g., Morning Workout"
                      className="mt-1 bg-gray-800 border-gray-600 text-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="task-points" className="text-gray-300">Points</Label>
                    <Input
                      id="task-points"
                      type="number"
                      min="1"
                      value={newTask.points}
                      onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) || 1 })}
                      className="mt-1 bg-gray-800 border-gray-600 text-gray-100"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAddTask} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Task
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsAdding(false);
                      setNewTask({ name: '', points: 1 });
                    }} 
                    variant="outline" 
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Task List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <Card key={task.id} className="relative overflow-hidden bg-gray-700/50 border-gray-600">
                <div 
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ backgroundColor: task.color }}
                />
                <CardContent className="p-4 pl-6">
                  {editingId === task.id ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`edit-name-${task.id}`} className="text-gray-300">Task Name</Label>
                        <Input
                          id={`edit-name-${task.id}`}
                          value={editTask.name}
                          onChange={(e) => setEditTask({ ...editTask, name: e.target.value })}
                          className="mt-1 bg-gray-800 border-gray-600 text-gray-100"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-points-${task.id}`} className="text-gray-300">Points</Label>
                        <Input
                          id={`edit-points-${task.id}`}
                          type="number"
                          min="1"
                          value={editTask.points}
                          onChange={(e) => setEditTask({ ...editTask, points: parseInt(e.target.value) || 1 })}
                          className="mt-1 bg-gray-800 border-gray-600 text-gray-100"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} size="sm" variant="default" className="bg-purple-600 hover:bg-purple-700">
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button onClick={handleCancelEdit} size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-100">{task.name}</h3>
                        <p className="text-sm text-gray-400">{task.points} points</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditTask(task)}
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteTask(task.id)}
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20 border-gray-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {tasks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p>No tasks yet. Add your first task to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskManager;
