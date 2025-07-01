import React, { useState } from 'react';
import { Clock, CheckCircle2, Circle, Lock, Filter, Users, ArrowRight, Lightbulb, Target, Plus } from 'lucide-react';

interface Module {
  id: string;
  name: string;
  hours: number;
  selected: boolean;
  available: boolean;
  assignedTo?: string;
}

interface Course {
  id: string;
  name: string;
  modules: Module[];
  isEvening: boolean;
}

interface Suggestion {
  id: string;
  modules: { courseId: string; moduleName: string; hours: number }[];
  totalHours: number;
  supportHours: number;
  description: string;
}

type FilterType = 'all' | 'daytime' | 'evening';

interface SelectModuleProps {
  isYourTurn?: boolean;
  currentChooser?: string;
  peopleAhead?: number;
  onNavigateToSelectionOrder?: () => void;
}

export default function SelectModule({ 
  isYourTurn = true, 
  currentChooser = "Prof. Ana López",
  peopleAhead = 3,
  onNavigateToSelectionOrder
}: SelectModuleProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1m',
      name: '1M',
      isEvening: false,
      modules: [
        { id: 'prog-1m', name: 'Programming', hours: 7, selected: false, available: true },
        { id: 'db-1m', name: 'Databases', hours: 6, selected: false, available: false, assignedTo: 'Prof. García' },
        { id: 'markup-1m', name: 'Markup Languages', hours: 4, selected: false, available: true },
      ],
    },
    {
      id: '2m',
      name: '2M',
      isEvening: false,
      modules: [
        { id: 'data-access-2m', name: 'Data Access', hours: 7, selected: false, available: true },
        { id: 'pmdm-2m', name: 'PMDM', hours: 5, selected: false, available: true },
        { id: 'systems-2m', name: 'Systems', hours: 2, selected: false, available: false, assignedTo: 'Prof. Martínez' },
      ],
    },
    {
      id: '1fq',
      name: '1FQ',
      isEvening: false,
      modules: [
        { id: 'web-dev-1fq', name: 'Web Development', hours: 8, selected: false, available: true },
        { id: 'networks-1fq', name: 'Networks', hours: 3, selected: false, available: true },
      ],
    },
    {
      id: '1mv',
      name: '1MV',
      isEvening: true,
      modules: [
        { id: 'prog-1mv', name: 'Programming', hours: 7, selected: false, available: true },
        { id: 'db-1mv', name: 'Databases', hours: 6, selected: false, available: true },
        { id: 'markup-1mv', name: 'Markup Languages', hours: 4, selected: false, available: false, assignedTo: 'Prof. López' },
      ],
    },
    {
      id: '2mv',
      name: '2MV',
      isEvening: true,
      modules: [
        { id: 'data-access-2mv', name: 'Data Access', hours: 7, selected: false, available: false, assignedTo: 'Prof. Rodríguez' },
        { id: 'pmdm-2mv', name: 'PMDM', hours: 2, selected: false, available: true },
      ],
    },
  ]);

  const toggleModuleSelection = (courseId: string, moduleId: string) => {
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          modules: course.modules.map(module => 
            module.id === moduleId && module.available
              ? { ...module, selected: !module.selected }
              : module
          ),
        };
      }
      return course;
    }));
  };

  const applySuggestion = (suggestion: Suggestion) => {
    // First clear all selections
    setCourses(courses.map(course => ({
      ...course,
      modules: course.modules.map(module => ({ ...module, selected: false }))
    })));

    // Then apply the suggestion
    setCourses(prevCourses => prevCourses.map(course => ({
      ...course,
      modules: course.modules.map(module => {
        const suggestionModule = suggestion.modules.find(
          sm => course.id === sm.courseId && module.name === sm.moduleName
        );
        return suggestionModule && module.available
          ? { ...module, selected: true }
          : { ...module, selected: false };
      })
    })));
  };

  const clearSelection = () => {
    setCourses(courses.map(course => ({
      ...course,
      modules: course.modules.map(module => ({ ...module, selected: false }))
    })));
  };

  const getSelectedModulesCount = () => {
    return courses.reduce((total, course) => 
      total + course.modules.filter(module => module.selected).length, 0
    );
  };

  const getTotalHours = () => {
    return courses.reduce((total, course) => 
      total + course.modules.filter(module => module.selected)
        .reduce((courseTotal, module) => courseTotal + module.hours, 0), 0
    );
  };

  const getAvailableModules = () => {
    return courses.flatMap(course => 
      course.modules
        .filter(module => module.available && !module.selected)
        .map(module => ({ ...module, courseId: course.id, courseName: course.name }))
    );
  };

  const generateSuggestions = (): Suggestion[] => {
    const currentHours = getTotalHours();
    const hoursNeeded = 18 - currentHours;
    const availableModules = getAvailableModules();
    
    if (hoursNeeded <= 0 || hoursNeeded >= 10) return [];

    const suggestions: Suggestion[] = [];

    // Generate combinations that get close to the needed hours
    const findCombinations = (modules: any[], targetHours: number, maxModules: number = 3) => {
      const combinations: any[][] = [];
      
      const backtrack = (start: number, current: any[], currentHours: number) => {
        if (current.length <= maxModules && currentHours >= targetHours - 2 && currentHours <= targetHours + 1) {
          combinations.push([...current]);
        }
        
        if (current.length >= maxModules || currentHours > targetHours + 1) return;
        
        for (let i = start; i < modules.length; i++) {
          current.push(modules[i]);
          backtrack(i + 1, current, currentHours + modules[i].hours);
          current.pop();
        }
      };
      
      backtrack(0, [], 0);
      return combinations;
    };

    const combinations = findCombinations(availableModules, hoursNeeded);
    
    combinations.slice(0, 3).forEach((combo, index) => {
      const totalModuleHours = combo.reduce((sum, module) => sum + module.hours, 0);
      const finalTotal = currentHours + totalModuleHours;
      const supportHours = Math.max(0, 18 - finalTotal);
      
      suggestions.push({
        id: `suggestion-${index}`,
        modules: combo.map(module => ({
          courseId: module.courseId,
          moduleName: module.name,
          hours: module.hours
        })),
        totalHours: finalTotal,
        supportHours,
        description: combo.length === 1 
          ? `Add ${combo[0].name} from ${combo[0].courseName}`
          : `Combine ${combo.map(m => m.name).join(' + ')}`
      });
    });

    return suggestions.filter(s => s.totalHours >= 16 && s.totalHours <= 19);
  };

  const getCourseColor = (courseId: string, isEvening: boolean) => {
    if (isEvening) {
      const colors: { [key: string]: string } = {
        '1mv': 'bg-indigo-50 border-indigo-200',
        '2mv': 'bg-violet-50 border-violet-200',
      };
      return colors[courseId] || 'bg-slate-50 border-slate-200';
    } else {
      const colors: { [key: string]: string } = {
        '1m': 'bg-blue-50 border-blue-200',
        '2m': 'bg-green-50 border-green-200',
        '1fq': 'bg-orange-50 border-orange-200',
      };
      return colors[courseId] || 'bg-gray-50 border-gray-200';
    }
  };

  const getCourseAccent = (courseId: string, isEvening: boolean) => {
    if (isEvening) {
      const colors: { [key: string]: string } = {
        '1mv': 'text-indigo-700 bg-indigo-100',
        '2mv': 'text-violet-700 bg-violet-100',
      };
      return colors[courseId] || 'text-slate-700 bg-slate-100';
    } else {
      const colors: { [key: string]: string } = {
        '1m': 'text-blue-700 bg-blue-100',
        '2m': 'text-green-700 bg-green-100',
        '1fq': 'text-orange-700 bg-orange-100',
      };
      return colors[courseId] || 'text-gray-700 bg-gray-100';
    }
  };

  // Filter courses based on selected filter
  const getFilteredCourses = () => {
    switch (filter) {
      case 'daytime':
        return courses.filter(course => !course.isEvening);
      case 'evening':
        return courses.filter(course => course.isEvening);
      default:
        return courses;
    }
  };

  // Group filtered courses by daytime/evening
  const filteredCourses = getFilteredCourses();
  const daytimeCourses = filteredCourses.filter(course => !course.isEvening);
  const eveningCourses = filteredCourses.filter(course => course.isEvening);

  // Generate suggestions
  const currentHours = getTotalHours();
  const hoursRemaining = 18 - currentHours;
  const suggestions = generateSuggestions();
  const showSuggestions = hoursRemaining > 0 && hoursRemaining < 10 && suggestions.length > 0;

  // If it's not the user's turn, show waiting state
  if (!isYourTurn) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Select Modules</h2>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Waiting for your turn to select modules
          </p>
        </div>

        {/* Waiting State */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-12 text-center">
            <div className="relative mb-6">
              <Clock className="h-20 w-20 text-blue-500 mx-auto animate-pulse" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{peopleAhead}</span>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              It's not your turn yet
            </h3>
            
            <div className="space-y-3 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Users className="h-4 w-4" />
                <span className="text-sm">
                  <span className="font-medium text-blue-600">{currentChooser}</span> is currently selecting modules
                </span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm">
                  {peopleAhead === 1 
                    ? "You're next in line!" 
                    : `${peopleAhead} ${peopleAhead === 1 ? 'person' : 'people'} ahead of you`
                  }
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>What happens next?</strong><br />
                  You'll be notified when it\'s your turn to select modules. 
                  The selection process follows the established department order.
                </p>
              </div>

              {/* Link to Selection Order */}
              <button
                onClick={onNavigateToSelectionOrder}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 transition-colors duration-200"
              >
                <Users className="h-4 w-4 mr-2" />
                View Selection Order
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderCourseGroup = (courseList: Course[], title: string, subtitle: string) => (
    <div className="space-y-6">
      <div className="border-l-4 border-blue-500 pl-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {courseList.map((course) => (
          <div
            key={course.id}
            className={`rounded-lg border-2 transition-all duration-200 ${getCourseColor(course.id, course.isEvening)}`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <h4 className="text-lg font-semibold text-gray-900">Course {course.name}</h4>
                  {course.isEvening && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                      Evening
                    </span>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCourseAccent(course.id, course.isEvening)}`}>
                  {course.modules.length} modules
                </span>
              </div>
              
              <div className="space-y-3">
                {course.modules.map((module) => (
                  <div
                    key={module.id}
                    onClick={() => module.available && toggleModuleSelection(course.id, module.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      !module.available
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                        : module.selected
                        ? 'border-blue-300 bg-blue-50 shadow-sm cursor-pointer'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {!module.available ? (
                          <Lock className="h-5 w-5 text-gray-400 mr-3" />
                        ) : module.selected ? (
                          <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400 mr-3" />
                        )}
                        <div>
                          <h5 className={`font-medium ${
                            !module.available
                              ? 'text-gray-500'
                              : module.selected 
                              ? 'text-blue-900' 
                              : 'text-gray-900'
                          }`}>
                            {module.name}
                          </h5>
                          {!module.available && module.assignedTo && (
                            <p className="text-xs text-gray-500 mt-1">
                              Assigned to {module.assignedTo}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className={`h-4 w-4 mr-1 ${
                          !module.available
                            ? 'text-gray-400'
                            : module.selected 
                            ? 'text-blue-600' 
                            : 'text-gray-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          !module.available
                            ? 'text-gray-500'
                            : module.selected 
                            ? 'text-blue-700' 
                            : 'text-gray-600'
                        }`}>
                          {module.hours}h
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Regular selection interface when it's the user's turn
  return (
    <div className="space-y-8">
      {/* Header with integrated filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center">
              <CheckCircle2 className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Select Modules</h2>
              <span className="ml-3 px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                Your Turn
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Choose the modules you would like to teach this academic year (18-21 hours required)
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
            {/* Compact Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Courses</option>
                <option value="daytime">Daytime Only</option>
                <option value="evening">Evening Only</option>
              </select>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span className="font-medium">{getSelectedModulesCount()}</span> modules selected
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              <span className={`font-medium ${
                currentHours < 18 ? 'text-orange-600' : 
                currentHours > 21 ? 'text-red-600' : 'text-green-600'
              }`}>
                {currentHours}/18-21 hours
              </span>
            </div>
          </div>
        </div>
        {filter !== 'all' && (
          <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            Showing {filteredCourses.length} of {courses.length} courses ({filter} only)
          </div>
        )}
        
        {/* Hours Status */}
        {currentHours > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Progress to minimum requirement</span>
              <span className={`font-medium ${
                currentHours < 18 ? 'text-orange-600' : 'text-green-600'
              }`}>
                {currentHours >= 18 ? 'Requirement met!' : `${hoursRemaining} hours remaining`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentHours < 18 ? 'bg-orange-500' : 
                  currentHours > 21 ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((currentHours / 21) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions Section */}
      {showSuggestions && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg shadow-sm p-6 border border-amber-200">
          <div className="flex items-center mb-4">
            <Lightbulb className="h-6 w-6 text-amber-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Suggested Combinations</h3>
            <span className="ml-3 px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full">
              {hoursRemaining} hours needed
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Here are some combinations that would help you reach the 18-hour minimum requirement:
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white rounded-lg border border-amber-200 p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 text-green-600 mr-2" />
                    <span className="font-medium text-gray-900">
                      {suggestion.totalHours} hours total
                    </span>
                  </div>
                  {suggestion.supportHours > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      +{suggestion.supportHours}h support
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  {suggestion.modules.map((module, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{module.moduleName}</span>
                      <span className="text-gray-500 font-medium">{module.hours}h</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => applySuggestion(suggestion)}
                  className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-amber-700 bg-amber-100 border border-amber-300 rounded-md hover:bg-amber-200 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Apply This Combination
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Groups */}
      {filter === 'all' || filter === 'daytime' ? (
        daytimeCourses.length > 0 && renderCourseGroup(
          daytimeCourses, 
          "Daytime Courses", 
          "Regular schedule courses (morning and afternoon)"
        )
      ) : null}

      {filter === 'all' || filter === 'evening' ? (
        eveningCourses.length > 0 && renderCourseGroup(
          eveningCourses, 
          "Evening Courses", 
          "Evening schedule courses for working students"
        )
      ) : null}

      {/* No Results Message */}
      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
          <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">
            No courses match the current filter. Try selecting a different filter option.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {getSelectedModulesCount() > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-600">
              You have selected <span className="font-medium text-gray-900">{getSelectedModulesCount()} modules</span> 
              {' '}totaling <span className={`font-medium ${
                currentHours < 18 ? 'text-orange-600' : 
                currentHours > 21 ? 'text-red-600' : 'text-green-600'
              }`}>{currentHours} hours</span>
              {currentHours < 18 && (
                <span className="text-orange-600"> ({hoursRemaining} hours short of minimum)</span>
              )}
              {currentHours > 21 && (
                <span className="text-red-600"> ({currentHours - 21} hours over maximum)</span>
              )}
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={clearSelection}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Clear Selection
              </button>
              <button 
                disabled={currentHours < 18 || currentHours > 21}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  currentHours >= 18 && currentHours <= 21
                    ? 'text-white bg-blue-600 border border-transparent hover:bg-blue-700'
                    : 'text-gray-400 bg-gray-100 border border-gray-300 cursor-not-allowed'
                }`}
              >
                Save Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}