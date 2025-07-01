import React, { useState } from 'react';
import { BarChart3, Clock, BookOpen, User, Filter, Eye, EyeOff } from 'lucide-react';

interface Module {
  id: string;
  name: string;
  shortName: string;
  hours: number;
  isAssigned: boolean;
  assignedTo?: string;
}

interface Course {
  id: string;
  name: string;
  fullName: string;
  modules: Module[];
  isEvening: boolean;
}

type ViewMode = 'compact' | 'detailed';
type FilterType = 'all' | 'available' | 'assigned' | 'daytime' | 'evening';

export default function ModuleSummary() {
  const [viewMode, setViewMode] = useState<ViewMode>('compact');
  const [filter, setFilter] = useState<FilterType>('all');

  const [courses] = useState<Course[]>([
    {
      id: '1m',
      name: '1M',
      fullName: 'First Year Morning',
      isEvening: false,
      modules: [
        { id: 'prog-1m', name: 'Programming', shortName: 'PROG', hours: 7, isAssigned: false },
        { id: 'db-1m', name: 'Databases', shortName: 'DB', hours: 6, isAssigned: true, assignedTo: 'Prof. García' },
        { id: 'markup-1m', name: 'Markup Languages', shortName: 'HTML', hours: 4, isAssigned: false },
        { id: 'systems-1m', name: 'Operating Systems', shortName: 'OS', hours: 5, isAssigned: true, assignedTo: 'Prof. Martínez' },
      ],
    },
    {
      id: '2m',
      name: '2M',
      fullName: 'Second Year Morning',
      isEvening: false,
      modules: [
        { id: 'data-access-2m', name: 'Data Access', shortName: 'DA', hours: 7, isAssigned: false },
        { id: 'pmdm-2m', name: 'Mobile Development', shortName: 'PMDM', hours: 5, isAssigned: false },
        { id: 'systems-2m', name: 'Systems Management', shortName: 'SYS', hours: 6, isAssigned: true, assignedTo: 'Prof. López' },
        { id: 'interfaces-2m', name: 'User Interfaces', shortName: 'UI', hours: 4, isAssigned: false },
      ],
    },
    {
      id: '1fq',
      name: '1FQ',
      fullName: 'First Year Vocational',
      isEvening: false,
      modules: [
        { id: 'web-dev-1fq', name: 'Web Development', shortName: 'WEB', hours: 8, isAssigned: false },
        { id: 'networks-1fq', name: 'Computer Networks', shortName: 'NET', hours: 5, isAssigned: true, assignedTo: 'Prof. Rodríguez' },
        { id: 'hardware-1fq', name: 'Computer Hardware', shortName: 'HW', hours: 6, isAssigned: false },
      ],
    },
    {
      id: '1mv',
      name: '1MV',
      fullName: 'First Year Evening',
      isEvening: true,
      modules: [
        { id: 'prog-1mv', name: 'Programming', shortName: 'PROG', hours: 7, isAssigned: false },
        { id: 'db-1mv', name: 'Databases', shortName: 'DB', hours: 6, isAssigned: false },
        { id: 'markup-1mv', name: 'Markup Languages', shortName: 'HTML', hours: 4, isAssigned: true, assignedTo: 'Prof. Fernández' },
        { id: 'systems-1mv', name: 'Operating Systems', shortName: 'OS', hours: 5, isAssigned: false },
      ],
    },
    {
      id: '2mv',
      name: '2MV',
      fullName: 'Second Year Evening',
      isEvening: true,
      modules: [
        { id: 'data-access-2mv', name: 'Data Access', shortName: 'DA', hours: 7, isAssigned: true, assignedTo: 'Prof. Santos' },
        { id: 'pmdm-2mv', name: 'Mobile Development', shortName: 'PMDM', hours: 5, isAssigned: false },
        { id: 'interfaces-2mv', name: 'User Interfaces', shortName: 'UI', hours: 4, isAssigned: false },
      ],
    },
  ]);

  const getFilteredCourses = () => {
    let filtered = courses;

    // Filter by schedule
    if (filter === 'daytime') {
      filtered = filtered.filter(course => !course.isEvening);
    } else if (filter === 'evening') {
      filtered = filtered.filter(course => course.isEvening);
    }

    // Filter by availability
    if (filter === 'available') {
      filtered = filtered.map(course => ({
        ...course,
        modules: course.modules.filter(module => !module.isAssigned)
      })).filter(course => course.modules.length > 0);
    } else if (filter === 'assigned') {
      filtered = filtered.map(course => ({
        ...course,
        modules: course.modules.filter(module => module.isAssigned)
      })).filter(course => course.modules.length > 0);
    }

    return filtered;
  };

  const getTotalStats = () => {
    const allModules = courses.flatMap(course => course.modules);
    const assigned = allModules.filter(module => module.isAssigned).length;
    const available = allModules.length - assigned;
    const totalHours = allModules.reduce((sum, module) => sum + module.hours, 0);
    const assignedHours = allModules.filter(module => module.isAssigned).reduce((sum, module) => sum + module.hours, 0);

    return { assigned, available, total: allModules.length, totalHours, assignedHours };
  };

  const getCourseColor = (courseId: string, isEvening: boolean) => {
    if (isEvening) {
      const colors: { [key: string]: string } = {
        '1mv': 'border-indigo-200 bg-indigo-50',
        '2mv': 'border-violet-200 bg-violet-50',
      };
      return colors[courseId] || 'border-slate-200 bg-slate-50';
    } else {
      const colors: { [key: string]: string } = {
        '1m': 'border-blue-200 bg-blue-50',
        '2m': 'border-green-200 bg-green-50',
        '1fq': 'border-orange-200 bg-orange-50',
      };
      return colors[courseId] || 'border-gray-200 bg-gray-50';
    }
  };

  const getModuleStyle = (module: Module) => {
    if (module.isAssigned) {
      return 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200';
    } else {
      return 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400';
    }
  };

  const stats = getTotalStats();
  const filteredCourses = getFilteredCourses();

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Module Summary</h2>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Overview of all courses and module assignments
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-4 lg:mt-0 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-600">Total Modules</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.assigned}</div>
              <div className="text-xs text-red-600">Assigned</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
              <div className="text-xs text-green-600">Available</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalHours}</div>
              <div className="text-xs text-blue-600">Total Hours</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Modules</option>
                <option value="available">Available Only</option>
                <option value="assigned">Assigned Only</option>
                <option value="daytime">Daytime Courses</option>
                <option value="evening">Evening Courses</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'compact' ? 'detailed' : 'compact')}
              className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              {viewMode === 'compact' ? (
                <>
                  <Eye className="h-4 w-4 mr-1" />
                  Detailed View
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 mr-1" />
                  Compact View
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
            <span className="text-gray-600">Assigned</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-full"></div>
            <span className="text-gray-600">Daytime</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-indigo-100 border border-indigo-300 rounded-full"></div>
            <span className="text-gray-600">Evening</span>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className={`rounded-lg border-2 transition-all duration-200 ${getCourseColor(course.id, course.isEvening)}`}
          >
            <div className="p-4">
              {/* Course Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-600" title={course.fullName}>
                    {viewMode === 'detailed' ? course.fullName : course.fullName.substring(0, 20) + '...'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {course.isEvening && (
                    <span className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                      Evening
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {course.modules.length} modules
                  </span>
                </div>
              </div>

              {/* Modules Grid */}
              <div className="grid grid-cols-2 gap-2">
                {course.modules.map((module) => (
                  <div
                    key={module.id}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 cursor-help ${getModuleStyle(module)}`}
                    title={module.isAssigned 
                      ? `${module.name} (${module.hours}h) - Assigned to ${module.assignedTo}`
                      : `${module.name} (${module.hours}h) - Available`
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">
                          {viewMode === 'compact' ? module.shortName : module.name}
                        </div>
                        {module.isAssigned && viewMode === 'detailed' && (
                          <div className="text-xs opacity-75 truncate mt-1">
                            {module.assignedTo}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center ml-2">
                        <Clock className="h-3 w-3 mr-1 opacity-60" />
                        <span className="text-xs font-medium">{module.hours}h</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Course Summary */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                      <span className="font-medium text-red-600">
                        {course.modules.filter(m => m.isAssigned).length}
                      </span> assigned
                    </span>
                    <span className="text-gray-600">
                      <span className="font-medium text-green-600">
                        {course.modules.filter(m => !m.isAssigned).length}
                      </span> available
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="font-medium">
                      {course.modules.reduce((sum, m) => sum + m.hours, 0)}h total
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">
            No courses match the current filter. Try selecting a different filter option.
          </p>
        </div>
      )}

      {/* Summary Footer */}
      {filteredCourses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round((stats.assigned / stats.total) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Assignment Progress</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.assigned / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((stats.assignedHours / stats.totalHours) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Hours Assigned</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.assignedHours} of {stats.totalHours} hours
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.available}
              </div>
              <div className="text-sm text-gray-600">Still Available</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.totalHours - stats.assignedHours} hours remaining
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}