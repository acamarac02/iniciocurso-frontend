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
  User,
  Database,
  ArrowLeftRight,
  ListOrdered
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

type MenuItem = 'assignment-management' | 'data-upload' | 'swap-modules' | 'edit-assigned' | 'selection-order';

export default function ControlPanel() {
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItem>('assignment-management');
  
  const [assignmentStatus, setAssignmentStatus] = useState<AssignmentStatus>({
    isStarted: true,
    isCompleted: false,
    startedAt: new Date().toISOString(),
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

  const menuItems = [
    {
      id: 'assignment-management' as MenuItem,
      label: 'Assignment Management',
      icon: Play,
      description: 'Start, finish, and download results'
    },
    {
      id: 'data-upload' as MenuItem,
      label: 'Data Upload',
      icon: Database,
      description: 'Upload modules and teachers'
    },
    {
      id: 'swap-modules' as MenuItem,
      label: 'Swap Modules',
      icon: ArrowLeftRight,
      description: 'Exchange modules between teachers'
    },
    {
      id: 'edit-assigned' as MenuItem,
      label: 'Edit Assigned Modules',
      icon: Edit3,
      description: 'Modify teacher assignments'
    },
    {
      id: 'selection-order' as MenuItem,
      label: 'Edit Selection Order',
      icon: ListOrdered,
      description: 'Reorder teacher selection priority'
    }
  ];

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

  const renderAssignmentManagement = () => (
    <div className="space-y-6">
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
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">
                {Math.round((assignmentStatus.completedTeachers / assignmentStatus.totalTeachers) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(assignmentStatus.completedTeachers / assignmentStatus.totalTeachers) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{assignmentStatus.completedTeachers} completed</span>
              <span>{assignmentStatus.totalTeachers - assignmentStatus.completedTeachers} remaining</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleStartAssignment}
            disabled={assignmentStatus.isStarted}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              assignmentStatus.isStarted
                ? 'text-gray-400 bg-gray-100 border border-gray-300 cursor-not-allowed'
                : 'text-white bg-green-600 border border-transparent hover:bg-green-700 shadow-sm'
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
                : 'text-white bg-red-600 border border-transparent hover:bg-red-700 shadow-sm'
            }`}
          >
            <Square className="h-4 w-4 mr-2" />
            Finish Assignment
          </button>

          {assignmentStatus.isCompleted && (
            <button className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 transition-colors duration-200 shadow-sm">
              <Download className="h-4 w-4 mr-2" />
              Download Results
            </button>
          )}
        </div>

        {assignmentStatus.startedAt && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Started:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(assignmentStatus.startedAt).toLocaleString()}
                </span>
              </div>
              {assignmentStatus.completedAt && (
                <div>
                  <span className="text-gray-600">Completed:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {new Date(assignmentStatus.completedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <div className="text-lg font-semibold text-gray-900">{assignmentStatus.completedTeachers}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <div className="text-lg font-semibold text-gray-900">
                {teachers.filter(t => t.status === 'in-progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <div className="text-lg font-semibold text-gray-900">
                {teachers.filter(t => t.status === 'waiting').length}
              </div>
              <div className="text-sm text-gray-600">Waiting</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataUpload = () => (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Modules */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <FileSpreadsheet className="h-5 w-5 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Upload Modules</h3>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors duration-200">
            <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-900 mb-2">Upload Module Data</p>
            <p className="text-xs text-gray-600 mb-4">
              Excel file (.xlsx) with module information including course codes, names, hours, and requirements
            </p>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 transition-colors duration-200">
              Choose Excel File
            </button>
            <p className="text-xs text-gray-500 mt-3">Coming Soon</p>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Expected format:</strong> Course Code, Module Name, Hours, Prerequisites, Description
            </p>
          </div>
        </div>
        
        {/* Upload Teachers */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Upload Teachers</h3>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors duration-200">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-900 mb-2">Upload Teacher Data</p>
            <p className="text-xs text-gray-600 mb-4">
              Excel file (.xlsx) with teacher information including names, departments, seniority, and specializations
            </p>
            <button className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-300 rounded-md hover:bg-green-100 transition-colors duration-200">
              Choose Excel File
            </button>
            <p className="text-xs text-gray-500 mt-3">Coming Soon</p>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-800">
              <strong>Expected format:</strong> Name, Department, Seniority Years, Email, Specializations
            </p>
          </div>
        </div>
      </div>
      
      {/* Upload History */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h3>
        <div className="text-center py-8">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600">No recent uploads</p>
          <p className="text-xs text-gray-500 mt-1">Upload history will appear here</p>
        </div>
      </div>
    </div>
  );

  const renderSwapModules = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center mb-6">
          <ArrowLeftRight className="h-5 w-5 text-orange-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Swap Modules Between Teachers</h3>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Teacher</label>
              <select 
                value={selectedTeacher1ForSwap}
                onChange={(e) => setSelectedTeacher1ForSwap(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select first teacher...</option>
                {teachers.filter(t => t.status === 'completed').map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
            </div>
            
            {selectedTeacher1ForSwap && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Current Modules:</p>
                <div className="space-y-1">
                  <div className="text-xs text-gray-600 p-2 bg-white rounded border">Programming (7h)</div>
                  <div className="text-xs text-gray-600 p-2 bg-white rounded border">Databases (6h)</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Second Teacher</label>
              <select 
                value={selectedTeacher2ForSwap}
                onChange={(e) => setSelectedTeacher2ForSwap(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select second teacher...</option>
                {teachers.filter(t => t.status === 'completed' && t.id !== selectedTeacher1ForSwap).map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
            </div>
            
            {selectedTeacher2ForSwap && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Current Modules:</p>
                <div className="space-y-1">
                  <div className="text-xs text-gray-600 p-2 bg-white rounded border">Operating Systems (5h)</div>
                  <div className="text-xs text-gray-600 p-2 bg-white rounded border">Networks (8h)</div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button 
            disabled={!selectedTeacher1ForSwap || !selectedTeacher2ForSwap}
            className="flex items-center px-6 py-3 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-300 rounded-md hover:bg-orange-100 transition-colors duration-200 disabled:text-gray-400 disabled:bg-gray-100 disabled:border-gray-300 disabled:cursor-not-allowed"
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Swap All Modules
          </button>
        </div>
        
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Coming Soon:</strong> This feature will allow you to swap modules between teachers who have already completed their selection.
          </p>
        </div>
      </div>
    </div>
  );

  const renderEditAssigned = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center mb-6">
          <Edit3 className="h-5 w-5 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Edit Assigned Modules</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Teacher</label>
            <select 
              value={selectedTeacherForEdit}
              onChange={(e) => setSelectedTeacherForEdit(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select teacher to edit...</option>
              {teachers.filter(t => t.status === 'completed').map(teacher => (
                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
              ))}
            </select>
          </div>
          
          {selectedTeacherForEdit && (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Current Assignments</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Programming</div>
                      <div className="text-xs text-gray-600">Course 1M • 7 hours</div>
                    </div>
                    <button className="text-red-600 hover:text-red-700">
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Databases</div>
                      <div className="text-xs text-gray-600">Course 1M • 6 hours</div>
                    </div>
                    <button className="text-red-600 hover:text-red-700">
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Web Development</div>
                      <div className="text-xs text-gray-600">Course 1FQ • 5 hours</div>
                    </div>
                    <button className="text-red-600 hover:text-red-700">
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Total: <span className="font-medium text-gray-900">18 hours</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Available Modules</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white rounded border border-dashed">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Data Access</div>
                      <div className="text-xs text-gray-600">Course 2M • 7 hours</div>
                    </div>
                    <button className="text-green-600 hover:text-green-700">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded border border-dashed">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Mobile Development</div>
                      <div className="text-xs text-gray-600">Course 2M • 5 hours</div>
                    </div>
                    <button className="text-green-600 hover:text-green-700">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Coming Soon:</strong> This feature will allow you to modify module assignments for teachers who have completed their selection.
          </p>
        </div>
      </div>
    </div>
  );

  const renderSelectionOrder = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <ListOrdered className="h-5 w-5 text-purple-600 mr-3" />
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
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Coming Soon:</strong> Drag and drop functionality to reorder teacher selection priority will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'assignment-management':
        return renderAssignmentManagement();
      case 'data-upload':
        return renderDataUpload();
      case 'swap-modules':
        return renderSwapModules();
      case 'edit-assigned':
        return renderEditAssigned();
      case 'selection-order':
        return renderSelectionOrder();
      default:
        return renderAssignmentManagement();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-sm border-r border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Settings className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Control Panel</h2>
              <p className="text-sm text-gray-600">Department Head Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenuItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenuItem(item.id)}
                  className={`w-full flex items-start p-3 text-left rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-purple-50 border border-purple-200 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${
                    isActive ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <div>
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-purple-900' : 'text-gray-900'
                    }`}>
                      {item.label}
                    </div>
                    <div className={`text-xs mt-1 ${
                      isActive ? 'text-purple-600' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Quick Stats in Sidebar */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Assignment Progress</span>
              <span className="font-medium text-gray-900">
                {Math.round((assignmentStatus.completedTeachers / assignmentStatus.totalTeachers) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(assignmentStatus.completedTeachers / assignmentStatus.totalTeachers) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{assignmentStatus.completedTeachers} completed</span>
              <span>{assignmentStatus.totalTeachers - assignmentStatus.completedTeachers} pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
}