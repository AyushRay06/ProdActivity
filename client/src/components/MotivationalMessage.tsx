
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MotivationalMessageProps {
  totalPoints: number;
  streak: number;
  todayPoints: number;
}

const MotivationalMessage: React.FC<MotivationalMessageProps> = ({
  totalPoints,
  streak,
  todayPoints
}) => {
  const getMotivationalMessage = () => {
    // David Goggins-inspired messages with dark theme and purple hints
    if (streak >= 7) {
      return {
        emoji: '🔥',
        message: `${streak} days straight! You're becoming UNSTOPPABLE! "When your mind is telling you you're done, you're only 40% done!"`,
        color: 'from-gray-800 to-purple-700'
      };
    }
    
    if (streak >= 3) {
      return {
        emoji: '💪',
        message: `${streak} days of staying HARD! "Don't stop when you're tired. Stop when you're done!"`,
        color: 'from-gray-700 to-purple-600'
      };
    }

    if (todayPoints >= 10) {
      return {
        emoji: '👑',
        message: `${todayPoints} points today! You're CRUSHING it! "You are in danger of living a life so comfortable that you never realize your true potential!"`,
        color: 'from-gray-900 to-purple-800'
      };
    }
    
    if (todayPoints >= 5) {
      return {
        emoji: '⚡',
        message: `${todayPoints} points earned! Keep pushing! "The most important conversations you'll ever have are the ones you'll have with yourself!"`,
        color: 'from-gray-800 to-purple-700'
      };
    }

    if (todayPoints > 0) {
      return {
        emoji: '🎯',
        message: `Good start warrior! "You have to build calluses on your brain just like how you build calluses on your hands!"`,
        color: 'from-gray-700 to-purple-600'
      };
    }

    if (totalPoints >= 100) {
      return {
        emoji: '🏆',
        message: `${totalPoints} total points! You're becoming UNCOMMON! "Suffering is the true test of life!"`,
        color: 'from-gray-900 to-purple-800'
      };
    }
    
    if (totalPoints >= 50) {
      return {
        emoji: '🚀',
        message: `${totalPoints} points! You're on the path! "Be uncomfortable every damn day of your life!"`,
        color: 'from-gray-800 to-purple-700'
      };
    }
    
    if (totalPoints >= 10) {
      return {
        emoji: '💀',
        message: `${totalPoints} points! Stay HARD! "We live in an external world. Everything is about what everyone else thinks about you!"`,
        color: 'from-gray-700 to-purple-600'
      };
    }

    // Default warrior message
    return {
      emoji: '⚔️',
      message: "Time to get after it! \"The cave you fear to enter holds the treasure you seek!\" STAY HARD!",
      color: 'from-gray-800 to-purple-700'
    };
  };

  const { emoji, message, color } = getMotivationalMessage();

  return (
    <Card className={`mb-6 bg-gradient-to-r ${color} shadow-lg border text-purple-100 border-purple-600`}>
      <CardContent className="p-6 text-center">
        <div className="text-4xl mb-2">{emoji}</div>
        <p className="text-lg font-medium leading-relaxed">{message}</p>
      </CardContent>
    </Card>
  );
};

export default MotivationalMessage;
