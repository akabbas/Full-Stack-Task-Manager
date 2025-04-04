import React, { useState } from 'react';
import { format } from 'date-fns';
import TaskForm from './TaskForm';

const TaskList = ({ tasks, onUpdate, onDelete }) => {
  const [editingTask, setEditingTask] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No tasks found. Create your first task!
        </div>
      ) : (
        tasks.map(task => (
          <div key={task.id} className="bg-white rounded-lg shadow-md p-6">
            {editingTask?.id === task.id ? (
              <TaskForm
                initialData={task}
                onSubmit={(updatedTask) => {
                  onUpdate(task.id, updatedTask);
                  setEditingTask(null);
                }}
                onCancel={() => setEditingTask(null)}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{task.title}</h3>
                    <p className="text-gray-600 mt-2">{task.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  {task.dueDate && (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList; 