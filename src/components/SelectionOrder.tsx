import React from 'react';
import { Users, Crown, Clock, CheckCircle2, User } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  department: string;
  seniority: number;
  isCurrentlyChoosing: boolean;
  hasCompleted: boolean;
  position: number;
}

interface SelectionOrderProps {
  isSelectionActive?: boolean;
  currentChooserPosition?: number;
}

export default function SelectionOrder({ 
  isSelectionActive = true, 
  currentChooserPosition = 3 
}: SelectionOrderProps) {
  const [teachers] = React.useState<Teacher[]>([
    {
      id: '1',
      name: 'Prof. María García',
      department: 'Computer Science',
      seniority: 15,
      isCurrentlyChoosing: false,
      hasCompleted: true,
      position: 1,
    },
    {
      id: '2',
      name: 'Prof. Carlos Martínez',
      department: 'Computer Science',
      seniority: 12,
      isCurrentlyChoosing: false,
      hasCompleted: true,
      position: 2,
    },
    {
      id: '3',
      name: 'Prof. Ana López',
      department: 'Computer Science',
      seniority: 10,
      isCurrentlyChoosing: true,
      hasCompleted: false,
      position: 3,
    },
    {
      id: '4',
      name: 'Prof. David Rodríguez',
      department: 'Computer Science',
      seniority: 8,
      isCurrentlyChoosing: false,
      hasCompleted: false,
      position: 4,
    },
    {
      id: '5',
      name: 'Prof. Elena Fernández',
      department: 'Computer Science',
      seniority: 6,
      isCurrentlyChoosing: false,
      hasCompleted: false,
      position: 5,
    },
    {
      id: '6',
      name: 'Prof. Miguel Santos',
      department: 'Computer Science',
      seniority: 4,
      isCurrentlyChoosing: false,
      hasCompleted: false,
      position: 6,
    },
    {
      id: '7',
      name: 'You (Prof. Laura Jiménez)',
      department: 'Computer Science',
      seniority: 3,
      isCurrentlyChoosing: false,
      hasCompleted: false,
      position: 7,
    },
  ]);

  const getStatusIcon = (teacher: Teacher) => {
    if (teacher.hasCompleted) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else if (teacher.isCurrentlyChoosing) {
      return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
    } else {
      return <User className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (teacher: Teacher) => {
    if (teacher.hasCompleted) {
      return 'Completed';
    } else if (teacher.isCurrentlyChoosing) {
      return 'Currently Selecting';
    } else {
      return 'Waiting';
    }
  };

  const getStatusColor = (teacher: Teacher) => {
    if (teacher.hasCompleted) {
      return 'text-green-600 bg-green-50';
    } else if (teacher.isCurrentlyChoosing) {
      return 'text-blue-600 bg-blue-50';
    } else {
      return 'text-gray-600 bg-gray-50';
    }
  };

  const getRowStyle = (teacher: Teacher) => {
    const isCurrentUser = teacher.name.includes('You');
    const baseStyle = 'transition-all duration-200';
    
    if (teacher.isCurrentlyChoosing) {
      return `${baseStyle} bg-blue-50 border-blue-200 shadow-sm`;
    } else if (isCurrentUser) {
      return `${baseStyle} bg-yellow-50 border-yellow-200`;
    } else if (teacher.hasCompleted) {
      return `${baseStyle} bg-green-50 border-green-200`;
    } else {
      return `${baseStyle} bg-white border-gray-200 hover:bg-gray-50`;
    }
  };

  const completedCount = teachers.filter(t => t.hasCompleted).length;
  const totalTeachers = teachers.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Selection Order</h2>
              {isSelectionActive && (
                <span className="ml-3 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                  Active
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Department teachers in order of module selection priority
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {completedCount}/{totalTeachers}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {isSelectionActive && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Selection Progress</span>
            <span className="text-sm text-gray-600">
              {Math.round((completedCount / totalTeachers) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalTeachers) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Teachers List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Teachers by Selection Order</h3>
          <p className="text-sm text-gray-600 mt-1">
            Order determined by seniority and department guidelines
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {teachers.map((teacher, index) => (
            <div
              key={teacher.id}
              className={`p-6 border-l-4 ${getRowStyle(teacher)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                    {teacher.position === 1 ? (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    ) : (
                      teacher.position
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {teacher.name}
                      </h4>
                      {teacher.name.includes('You') && (
                        <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-gray-600">{teacher.department}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{teacher.seniority} years seniority</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(teacher)}`}>
                    {getStatusIcon(teacher)}
                    <span>{getStatusText(teacher)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Status Legend</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-600">Completed selection</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">Currently selecting</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Waiting for turn</span>
          </div>
        </div>
      </div>
    </div>
  );
}