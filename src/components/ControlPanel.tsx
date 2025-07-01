import React, { useState } from 'react';
import { 
  Settings, 
  Upload, 
  Play, 
  Square, 
  RefreshCw, 
  Edit3, 
  GripVertical,
  Users,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Crown,
  User
} from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  department: string;
  seniority: number;
  position: number;
  status: 'completed' | 'in-progress' | 'waiting';
}

interface AssignmentStatus {
  isStarted: boolean;
  isCompleted: boolean;
  startedAt?: string;
  completedAt?: string;
  totalTeachers: number;
  completedTeachers: number;
}

export default function ControlPanel() {
  const [assignmentStatus, setAssignmentStatus] = useState<AssignmentStatus>({
    isStarted: false,
    isCompleted: false,
    totalTeachers: 7,
    completedTeachers: 2
  });

  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: '1',
      name: 'Prof. María García',
      department: 'Computer Science',
      seniority: 15,
      position: 1,
      status: 'completed'
    },
    {
      id: '2',
      name: 'Prof. Carlos Martínez',
      department: 'Computer Science',
      seniority: 12,
      position: 2,
      status: 'completed'
    },
    {
      id: '3',
      name: 'Prof. Ana López',
      department: 'Computer Science',
      seniority: 10,
      position: 3,
      status: 'in-progress'
    },
    {
      id: '4',
      name: 'Prof. David Rodríguez',
      department: 'Computer Science',
      seniority: 8,
      position: 4,
      status: 'waiting'
    },
    {
      id: '5',
      name: 'Prof. Elena Fernández',
      department: 'Computer Science',
      seniority: 6,
      position: 5,
      status: 'waiting'
    },
    {
      id: '6',
      name: 'Prof. Miguel Santos',
      department: 'Computer Science',
      seniority: 4,
      position: 6,
      status: 'waiting'
    },
    {
      id: '7',
      name: 'Prof. Laura Jiménez',
      department: 'Computer Science',
      seniority: 3,
      position: 7,
      status: 'waiting'
    }
  ]);

  const [draggedTeacher, setDraggedTeacher] = useState<string | null>(null);
  const [selectedTeacherForEdit, setSelectedTeacherForEdit] = useState<string>('');
  const [selectedTeacher1ForSwap, setSelectedTeacher1ForSwap] = useState<string>('');
  const [selectedTeacher2ForSwap, setSelectedTeacher2ForSwap] = useState<string>('');

  const handleStartAssignment = () => {
    setAssignmentStatus({
      ...assignmentStatus,
      isStarted: true,
      startedAt: new Date().toISOString()
    });
  };

  const handleFinishAssignment = () => {
    setAssignmentStatus({
      ...assignmentStatus,
      isCompleted: true,
      completedAt: new Date().toISOString()
    });
  };

  const handleDragStart = (e: React.DragEvent, teacherId: string) => {
    setDraggedTeacher(teacherId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTeacherId: string) => {
    e.preventDefault();
    
    if (!draggedTeacher || draggedTeacher === targetTeacherId) {
      setDraggedTeacher(null);
      return;
    }

    const draggedIndex = teachers.findIndex(t => t.id === draggedTeacher);
    const targetIndex = teachers.findIndex(t => t.id === targetTeacherId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newTeachers = [...teachers];
    const [draggedItem] = newTeachers.splice(draggedIndex, 1);
    newTeachers.splice(targetIndex, 0, draggedItem);

    // Update positions
    const updatedTeachers = newTeachers.map((teacher, index) => ({
      ...teacher,
      position: index + 1
    }));

    setTeachers(updatedTeachers);
    setDraggedTeacher(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Control Panel</h2>
              <span className="ml-3 px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                Department Head
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Administrative tools for managing module assignments and teachers
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {assignmentStatus.completedTeachers}/{assignmentStatus.totalTeachers}
            </div>
            <div className="text-sm text-gray-600">Teachers Completed</div>
          </div>
        </div>
      </div>

      {/* Assignment Status */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Assignment Status</h3>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            assignmentStatus.isCompleted 
              ? 'text-green-600 bg-green-50'
              : assignmentStatus.isStarted 
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 bg-gray-50'
          }`}>
            {assignmentStatus.isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Completed</span>
              </>
            ) : assignmentStatus.isStarted ? (
              <>
                <Clock className="h-4 w-4 animate-pulse" />
                <span>In Progress</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                <span>Not Started</span>
              </>
            )}
          </div>
        </div>

        {assignmentStatus.isStarted && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">
                {Math.round((assignmentStatus.completedTeachers / assignmentStatus.totalTeachers) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(assignmentStatus.completedTeachers / assignmentStatus.totalTeachers) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={handleStartAssignment}
            disabled={assignmentStatus.isStarted}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              assignmentStatus.isStarted
                ? 'text-gray-400 bg-gray-100 border border-gray-300 cursor-not-allowed'
                : 'text-white bg-green-600 border border-transparent hover:bg-green-700'
            }`}
          >
            <Play className="h-4 w-4 mr-2" />
            Start Assignment
          </button>
          
          <button
            onClick={handleFinishAssignment}
            disabled={!assignmentStatus.isStarted || assignmentStatus.isCompleted}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              !assignmentStatus.isStarted || assignmentStatus.isCompleted
                ? 'text-gray-400 bg-gray-100 border border-gray-300 cursor-not-allowed'
                : 'text-white bg-red-600 border border-transparent hover:bg-red-700'
            }`}
          >
            <Square className="h-4 w-4 mr-2" />
            Finish Assignment
          </button>

          {assignmentStatus.isCompleted && (
            <button className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 transition-colors duration-200">
              <Download className="h-4 w-4 mr-2" />
              Download Results
            </button>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Upload className="h-5 w-5 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Data Upload</h3>
          </div>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
              <FileSpreadsheet className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900 mb-1">Upload Modules</p>
              <p className="text-xs text-gray-600 mb-3">Excel file with module information</p>
              <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded hover:bg-blue-100 transition-colors duration-200">
                Choose File
              </button>
              <p className="text-xs text-gray-500 mt-2">Coming Soon</p>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900 mb-1">Upload Teachers</p>
              <p className="text-xs text-gray-600 mb-3">Excel file with teacher information</p>
              <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded hover:bg-blue-100 transition-colors duration-200">
                Choose File
              </button>
              <p className="text-xs text-gray-500 mt-2">Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Module Management */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <RefreshCw className="h-5 w-5 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Module Management</h3>
          </div>
          
          <div className="space-y-4">
            {/* Swap Modules */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-3">
                <RefreshCw className="h-4 w-4 text-green-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-900">Swap Modules</h4>
              </div>
              <div className="space-y-2">
                <select 
                  value={selectedTeacher1ForSwap}
                  onChange={(e) => setSelectedTeacher1ForSwap(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                >
                  <option value="">Select first teacher...</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
                <select 
                  value={selectedTeacher2ForSwap}
                  onChange={(e) => setSelectedTeacher2ForSwap(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                >
                  <option value="">Select second teacher...</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
                <button 
                  disabled={!selectedTeacher1ForSwap || !selectedTeacher2ForSwap}
                  className="w-full px-3 py-1 text-xs font-medium text-green-600 bg-green-50 border border-green-300 rounded hover:bg-green-100 transition-colors duration-200 disabled:text-gray-400 disabled:bg-gray-100 disabled:border-gray-300"
                >
                  Swap Modules
                </button>
                <p className="text-xs text-gray-500 text-center">Coming Soon</p>
              </div>
            </div>

            {/* Edit Assigned Module */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-3">
                <Edit3 className="h-4 w-4 text-orange-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-900">Edit Assigned Module</h4>
              </div>
              <div className="space-y-2">
                <select 
                  value={selectedTeacherForEdit}
                  onChange={(e) => setSelectedTeacherForEdit(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                >
                  <option value="">Select teacher to edit...</option>
                  {teachers.filter(t => t.status === 'completed').map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
                <button 
                  disabled={!selectedTeacherForEdit}
                  className="w-full px-3 py-1 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-300 rounded hover:bg-orange-100 transition-colors duration-200 disabled:text-gray-400 disabled:bg-gray-100 disabled:border-gray-300"
                >
                  Edit Modules
                </button>
                <p className="text-xs text-gray-500 text-center">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Selection Order */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <GripVertical className="h-5 w-5 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Edit Selection Order</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Drag and drop to reorder teachers (Coming Soon)
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {teachers.length} teachers
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              draggable
              onDragStart={(e) => handleDragStart(e, teacher.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, teacher.id)}
              className={`p-4 transition-all duration-200 cursor-move hover:bg-gray-50 ${
                draggedTeacher === teacher.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <GripVertical className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                      {teacher.position === 1 ? (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      ) : (
                        teacher.position
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{teacher.name}</h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <p className="text-xs text-gray-600">{teacher.department}</p>
                      <span className="text-xs text-gray-500">{teacher.seniority} years</span>
                    </div>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(teacher.status)}`}>
                  {getStatusIcon(teacher.status)}
                  <span className="capitalize">{teacher.status.replace('-', ' ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}