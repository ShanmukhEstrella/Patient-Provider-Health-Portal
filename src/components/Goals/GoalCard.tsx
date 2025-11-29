import { useState } from 'react';
import { HealthGoal } from '../../lib/supabase';
import { Trash2, Edit2, CheckCircle, TrendingUp } from 'lucide-react';

interface GoalCardProps {
  goal: HealthGoal;
  onUpdate: (goalId: string, updates: Partial<HealthGoal>) => void;
  onDelete: (goalId: string) => void;
}

export function GoalCard({ goal, onUpdate, onDelete }: GoalCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(goal.current_value);

  const progress = goal.target_value
    ? Math.min((goal.current_value / goal.target_value) * 100, 100)
    : 0;

  function handleUpdateProgress() {
    onUpdate(goal.id, { current_value: currentValue });
    setIsEditing(false);
  }

  function handleMarkComplete() {
    onUpdate(goal.id, { status: 'completed' });
  }

  function handleDelete() {
    if (confirm('Are you sure you want to delete this goal?')) {
      onDelete(goal.id);
    }
  }

  const isCompleted = goal.status === 'completed';
  const isOverdue = goal.target_date && new Date(goal.target_date) < new Date() && !isCompleted;

  return (
    <div className={`bg-white p-5 rounded-lg border-2 transition-all ${
      isCompleted
        ? 'border-green-200 bg-green-50/50'
        : isOverdue
        ? 'border-orange-200'
        : 'border-gray-200 hover:border-teal-300'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className={`font-semibold text-gray-900 mb-1 ${isCompleted ? 'line-through text-gray-500' : ''}`}>
            {goal.title}
          </h4>
          {goal.description && (
            <p className="text-sm text-gray-600">{goal.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {!isCompleted && (
            <button
              onClick={handleMarkComplete}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Mark as complete"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete goal"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {goal.target_value && (
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">
              {goal.current_value} / {goal.target_value} {goal.unit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isCompleted ? 'bg-green-500' : 'bg-teal-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {goal.target_date && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <span>Target Date:</span>
          <span className={`font-medium ${isOverdue ? 'text-orange-600' : 'text-gray-900'}`}>
            {new Date(goal.target_date).toLocaleDateString()}
          </span>
          {isOverdue && <span className="text-orange-600 text-xs">(Overdue)</span>}
        </div>
      )}

      {!isCompleted && (
        <div className="pt-3 border-t border-gray-200">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(Number(e.target.value))}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Update progress"
              />
              <button
                onClick={handleUpdateProgress}
                className="px-3 py-1.5 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              <TrendingUp className="w-4 h-4" />
              Update Progress
            </button>
          )}
        </div>
      )}

      {isCompleted && (
        <div className="pt-3 border-t border-green-200 flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">Goal Completed!</span>
        </div>
      )}
    </div>
  );
}
