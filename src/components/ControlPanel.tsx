import React, { useState, useRef } from 'react';
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
  ListOrdered,
  X,
  Save,
  Trash2,
  Plus
} from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  department: string;
  seniority: number;
  position: number;
  status: 'completed' | 'in-progress' | 'waiting';
  assignedModules: AssignedModule[];
}

interface AssignedModule {
  id: string;
  name: string;
  course: string;
  hours: number;
}

interface AssignmentStatus {
  isStarted: boolean;
  isCompleted: boolean;
  startedAt?: string;
  completedAt?: string;
  totalTeachers: number;
  completedTeachers: number;
  mode?: 'wheel' | 'block';
}

type MenuItem = 'assignment-management' | 'data-upload' | 'swap-modules' | 'edit-assigned' | 'selection-order';

export default function ControlPanel() {
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItem>('assignment-management');
  const [showStartModal, setShowStartModal] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  
  const [assignmentStatus, setAssignmentStatus] = useState<AssignmentStatus>({
    isStarted: true,
    isCompleted: false,
    startedAt: new Date().toISOString(),
    totalTeachers: 7,
    completedTeachers: 2,
    mode: 'wheel'
  });

  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: '1',
      name: 'Prof. María García',
      department: 'Computer Science',
      seniority: 15,
      position: 1,
      status: 'completed',
      assignedModules: [
        { id: 'm1', name: 'Programming', course: '1M', hours: 7 },
        { id: 'm2', name: 'Databases', course: '1M', hours: 6 },
        { id: 'm3', name: 'Web Development', course: '1FQ', hours: 5 }
      ]
    },
    {
      id: '2',
      name: 'Prof. Carlos Martínez',
      department: 'Computer Science',
      seniority: 12,
      position: 2,
      status: 'completed',
      assignedModules: [
        { id: 'm4', name: 'Operating Systems', course: '1M', hours: 5 },
        { id: 'm5', name: 'Networks', course: '1FQ', hours: 8 },
        { id: 'm6', name: 'Systems Management', course: '2M', hours: 5 }
      ]
    },
    {
      id: '3',
      name: 'Prof. Ana López',
      department: 'Computer Science',
      seniority: 10,
      position: 3,
      status: 'in-progress',
      assignedModules: []
    },
    {
      id: '4',
      name: 'Prof. David Rodríguez',
      department: 'Computer Science',
      seniority: 8,
      position: 4,
      status: 'waiting',
      assignedModules: []
    },
    {
      id: '5',
      name: 'Prof. Elena Fernández',
      department: 'Computer Science',
      seniority: 6,
      position: 5,
      status: 'waiting',
      assignedModules: []
    },
    {
      id: '6',
      name: 'Prof. Miguel Santos',
      department: 'Computer Science',
      seniority: 4,
      position: 6,
      status: 'waiting',
      assignedModules: []
    },
    {
      id: '7',
      name: 'Prof. Laura Jiménez',
      department: 'Computer Science',
      seniority: 3,
      position: 7,
      status: 'waiting',
      assignedModules: []
    }
  ]);

  const [availableModules] = useState<AssignedModule[]>([
    { id: 'am1', name: 'Data Access', course: '2M', hours: 7 },
    { id: 'am2', name: 'Mobile Development', course: '2M', hours: 5 },
    { id: 'am3', name: 'User Interfaces', course: '2M', hours: 4 },
    { id: 'am4', name: 'Markup Languages', course: '1M', hours: 4 },
    { id: 'am5', name: 'Computer Hardware', course: '1FQ', hours: 6 }
  ]);

  const [draggedTeacher, setDraggedTeacher] = useState<string | null>(null);
  const [originalTeacherOrder, setOriginalTeacherOrder] = useState<Teacher[]>([]);
  const [selectedTeacherForEdit, setSelectedTeacherForEdit] = useState<string>('');
  const [selectedTeacher1ForSwap, setSelectedTeacher1ForSwap] = useState<string>('');
  const [selectedTeacher2ForSwap, setSelectedTeacher2ForSwap] = useState<string>('');
  const [selectedModule1ForSwap, setSelectedModule1ForSwap] = useState<string>('');
  const [selectedModule2ForSwap, setSelectedModule2ForSwap] = useState<string>('');

  // File input refs
  const moduleFileInputRef = useRef<HTMLInputElement>(null);
  const teacherFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleStartAssignment = (mode: 'wheel' | 'block') => {
    setAssignmentStatus({
      ...assignmentStatus,
      isStarted: false,
      startedAt: new Date().toISOString(),
      mode
    });
    setShowStartModal(false);
  };

  const handleFinishAssignment = () => {
    setAssignmentStatus({
      ...assignmentStatus,
      isCompleted: true,
      completedAt: new Date().toISOString()
    });
  };

  const handleFileSelect = (type: 'modules' | 'teachers') => {
    if (type === 'modules') {
      moduleFileInputRef.current?.click();
    } else {
      teacherFileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'modules' | 'teachers') => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Selected ${type} file:`, file.name);
      // Here you would handle the file upload
    }
  };

  const handleSwapModules = () => {
    if (!selectedTeacher1ForSwap || !selectedTeacher2ForSwap || !selectedModule1ForSwap || !selectedModule2ForSwap) {
      return;
    }

    setTeachers(prevTeachers => prevTeachers.map(teacher => {
      if (teacher.id === selectedTeacher1ForSwap) {
        const newModules = teacher.assignedModules.map(module => 
          module.id === selectedModule1ForSwap 
            ? teachers.find(t => t.id === selectedTeacher2ForSwap)?.assignedModules.find(m => m.id === selectedModule2ForSwap)!
            : module
        );
        return { ...teacher, assignedModules: newModules };
      } else if (teacher.id === selectedTeacher2ForSwap) {
        const newModules = teacher.assignedModules.map(module => 
          module.id === selectedModule2ForSwap 
            ? teachers.find(t => t.id === selectedTeacher1ForSwap)?.assignedModules.find(m => m.id === selectedModule1ForSwap)!
            : module
        );
        return { ...teacher, assignedModules: newModules };
      }
      return teacher;
    }));

    // Reset selections
    setSelectedTeacher1ForSwap('');
    setSelectedTeacher2ForSwap('');
    setSelectedModule1ForSwap('');
    setSelectedModule2ForSwap('');
  };

  const handleRemoveModule = (teacherId: string, moduleId: string) => {
    setTeachers(prevTeachers => prevTeachers.map(teacher => 
      teacher.id === teacherId 
        ? { ...teacher, assignedModules: teacher.assignedModules.filter(m => m.id !== moduleId) }
        : teacher
    ));
  };

  const handleAddModule = (teacherId: string, moduleId: string) => {
    const moduleToAdd = availableModules.find(m => m.id === moduleId);
    if (!moduleToAdd) return;

    setTeachers(prevTeachers => prevTeachers.map(teacher => 
      teacher.id === teacherId 
        ? { ...teacher, assignedModules: [...teacher.assignedModules, moduleToAdd] }
        : teacher
    ));
  };

  const handleDragStart = (e: React.DragEvent, teacherId: string) => {
    setDraggedTeacher(teacherId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Store original order when drag starts
    if (originalTeacherOrder.length === 0) {
      setOriginalTeacherOrder([...teachers]);
    }
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
    setShowSaveButton(true);
  };

  const handleSaveOrder = () => {
    setOriginalTeacherOrder([]);
    setShowSaveButton(false);
    // Here you would save to backend
  };

  const handleCancelOrder = () => {
    setTeachers(originalTeacherOrder);
    setOriginalTeacherOrder([]);
    setShowSaveButton(false);
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

  const getTeacher1Modules = () => {
    return teachers.find(t => t.id === selectedTeacher1ForSwap)?.assignedModules || [];
  };

  const getTeacher2Modules = () => {
    return teachers.find(t => t.id === selectedTeacher2ForSwap)?.assignedModules || [];
  };

  const getSelectedTeacherModules = () => {
    return teachers.find(t => t.id === selectedTeacherForEdit)?.assignedModules || [];
  };

  const getAvailableModulesForTeacher = () => {
    const assignedModuleIds = teachers.flatMap(t => t.assignedModules.map(m => m.id));
    return availableModules.filter(m => !assignedModuleIds.includes(m.id));
  };

  // Start Assignment Modal
  const StartAssignmentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Start Assignment Process</h3>
          <button
            onClick={() => setShowStartModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Choose the assignment mode for the module selection process:
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => handleStartAssignment('wheel')}
            className="w-full p-4 text-left border-2 border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
          >
            <div className="font-medium text-gray-900">Wheel Mode</div>
            <div className="text-sm text-gray-600 mt-1">
              Teachers select modules in rotating order based on seniority
            </div>
          </button>
          
          <button
            onClick={() => handleStartAssignment('block')}
            className="w-full p-4 text-left border-2 border-green-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors duration-200"
          >
            <div className="font-medium text-gray-900">Block Mode</div>
            <div className="text-sm text-gray-600 mt-1">
              Teachers select all their modules at once in order of seniority
            </div>
          </button>
        </div>
      </div>
    </div>
  );

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
                <span>In Progress ({assignmentStatus.mode?.toUpperCase()})</span>
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
            onClick={() => setShowStartModal(true)}
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
            <button 
              onClick={() => handleFileSelect('modules')}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 transition-colors duration-200"
            >
              Choose Excel File
            </button>
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
            <button 
              onClick={() => handleFileSelect('teachers')}
              className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-300 rounded-md hover:bg-green-100 transition-colors duration-200"
            >
              Choose Excel File
            </button>
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

      {/* Hidden file inputs */}
      <input
        ref={moduleFileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => handleFileChange(e, 'modules')}
        className="hidden"
      />
      <input
        ref={teacherFileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => handleFileChange(e, 'teachers')}
        className="hidden"
      />
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
                onChange={(e) => {
                  setSelectedTeacher1ForSwap(e.target.value);
                  setSelectedModule1ForSwap('');
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select first teacher...</option>
                {teachers.filter(t => t.status === 'completed' && t.assignedModules.length > 0).map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
            </div>
            
            {selectedTeacher1ForSwap && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Module</label>
                <select 
                  value={selectedModule1ForSwap}
                  onChange={(e) => setSelectedModule1ForSwap(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select module...</option>
                  {getTeacher1Modules().map(module => (
                    <option key={module.id} value={module.id}>
                      {module.name} ({module.course}) - {module.hours}h
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Second Teacher</label>
              <select 
                value={selectedTeacher2ForSwap}
                onChange={(e) => {
                  setSelectedTeacher2ForSwap(e.target.value);
                  setSelectedModule2ForSwap('');
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select second teacher...</option>
                {teachers.filter(t => t.status === 'completed' && t.id !== selectedTeacher1ForSwap && t.assignedModules.length > 0).map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
            </div>
            
            {selectedTeacher2ForSwap && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Module</label>
                <select 
                  value={selectedModule2ForSwap}
                  onChange={(e) => setSelectedModule2ForSwap(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select module...</option>
                  {getTeacher2Modules().map(module => (
                    <option key={module.id} value={module.id}>
                      {module.name} ({module.course}) - {module.hours}h
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button 
            onClick={handleSwapModules}
            disabled={!selectedTeacher1ForSwap || !selectedTeacher2ForSwap || !selectedModule1ForSwap || !selectedModule2ForSwap}
            className="flex items-center px-6 py-3 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-300 rounded-md hover:bg-orange-100 transition-colors duration-200 disabled:text-gray-400 disabled:bg-gray-100 disabled:border-gray-300 disabled:cursor-not-allowed"
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Swap Selected Modules
          </button>
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
                  {getSelectedTeacherModules().map(module => (
                    <div key={module.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{module.name}</div>
                        <div className="text-xs text-gray-600">{module.course} • {module.hours} hours</div>
                      </div>
                      <button 
                        onClick={() => handleRemoveModule(selectedTeacherForEdit, module.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {getSelectedTeacherModules().length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No modules assigned
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Total: <span className="font-medium text-gray-900">
                      {getSelectedTeacherModules().reduce((sum, m) => sum + m.hours, 0)} hours
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Available Modules</h4>
                <div className="space-y-2">
                  {getAvailableModulesForTeacher().map(module => (
                    <div key={module.id} className="flex items-center justify-between p-3 bg-white rounded border border-dashed">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{module.name}</div>
                        <div className="text-xs text-gray-600">{module.course} • {module.hours} hours</div>
                      </div>
                      <button 
                        onClick={() => handleAddModule(selectedTeacherForEdit, module.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {getAvailableModulesForTeacher().length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No available modules
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
                Drag and drop to reorder teachers
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {showSaveButton && (
                <>
                  <button
                    onClick={handleCancelOrder}
                    className="px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveOrder}
                    className="flex items-center px-3 py-1 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 transition-colors duration-200"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Order
                  </button>
                </>
              )}
              <div className="text-sm text-gray-500">
                {teachers.length} teachers
              </div>
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

      {/* Start Assignment Modal */}
      {showStartModal && <StartAssignmentModal />}
    </div>
  );
}