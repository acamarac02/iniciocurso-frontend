import React, { useState } from 'react';
import { Settings, User, Phone, Mail, BookOpen, Clock, MessageSquare, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AssignedModule {
  course: string;
  module: string;
  hours: number;
  grouping: string;
}

interface ResponsibilityRole {
  role: string;
  programResponsibility: string;
  reductionHours: number;
}

interface TeacherInfo {
  name: string;
  department: string;
  phone: string;
  educarexAccount: string;
}

interface TimetablePreference {
  [key: string]: {
    [key: string]: boolean;
  };
}

export default function Preferences() {
  // Check if assignment process is completed (this would come from global state)
  const [isAssignmentCompleted] = useState(true); // Set to true for demo
  
  // Teacher information form
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>({
    name: 'Prof. Laura Jiménez',
    department: 'Computer Science',
    phone: '',
    educarexAccount: ''
  });

  // Assigned modules (pre-filled from assignment process)
  const [assignedModules, setAssignedModules] = useState<AssignedModule[]>([
    { course: '1M', module: 'Programming', hours: 7, grouping: '' },
    { course: '2M', module: 'Data Access', hours: 7, grouping: '' },
    { course: '1FQ', module: 'Web Development', hours: 4, grouping: '' },
    { course: '', module: '', hours: 0, grouping: '' },
    { course: '', module: '', hours: 0, grouping: '' },
    { course: '', module: '', hours: 0, grouping: '' }
  ]);

  // Responsibility roles
  const [responsibilityRoles, setResponsibilityRoles] = useState<ResponsibilityRole[]>([
    { role: '', programResponsibility: '', reductionHours: 0 },
    { role: '', programResponsibility: '', reductionHours: 0 },
    { role: '', programResponsibility: '', reductionHours: 0 }
  ]);

  // Timetable preferences
  const hours = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const [timetablePreferences, setTimetablePreferences] = useState<TimetablePreference>(() => {
    const initial: TimetablePreference = {};
    hours.forEach(hour => {
      initial[hour] = {};
      days.forEach(day => {
        initial[hour][day] = false;
      });
    });
    return initial;
  });

  // Duty preference
  const [dutyPreference, setDutyPreference] = useState<'regular' | 'recess'>('regular');

  // Additional comments
  const [comments, setComments] = useState('');

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleTeacherInfoChange = (field: keyof TeacherInfo, value: string) => {
    setTeacherInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleModuleGroupingChange = (index: number, grouping: string) => {
    setAssignedModules(prev => prev.map((module, i) => 
      i === index ? { ...module, grouping } : module
    ));
  };

  const handleResponsibilityChange = (index: number, field: keyof ResponsibilityRole, value: string | number) => {
    setResponsibilityRoles(prev => prev.map((role, i) => 
      i === index ? { ...role, [field]: value } : role
    ));
  };

  const handleTimetableChange = (hour: string, day: string) => {
    setTimetablePreferences(prev => ({
      ...prev,
      [hour]: {
        ...prev[hour],
        [day]: !prev[hour][day]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset submitted state after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const getTotalAssignedHours = () => {
    return assignedModules.reduce((total, module) => total + module.hours, 0);
  };

  const getTotalReductionHours = () => {
    return responsibilityRoles.reduce((total, role) => total + role.reductionHours, 0);
  };

  // If assignment process is not completed, show waiting state
  if (!isAssignmentCompleted) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <Settings className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Complete your teaching preferences and schedule requirements
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
          <AlertCircle className="h-16 w-16 text-orange-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Assignment Process Not Completed</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            The preferences form will be available once the module assignment process has been completed. 
            Please wait for all teachers to finish their module selection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
              <span className="ml-3 px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                Available
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Complete your teaching preferences and schedule requirements
            </p>
          </div>
          {isSubmitted && (
            <div className="flex items-center text-green-600">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Preferences saved successfully!</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Teacher Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <User className="h-5 w-5 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Teacher Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teacher's Name
              </label>
              <input
                type="text"
                value={teacherInfo.name}
                onChange={(e) => handleTeacherInfoChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                value={teacherInfo.department}
                onChange={(e) => handleTeacherInfoChange('department', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                value={teacherInfo.phone}
                onChange={(e) => handleTeacherInfoChange('phone', e.target.value)}
                placeholder="+34 XXX XXX XXX"
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Educarex Account
              </label>
              <input
                type="email"
                value={teacherInfo.educarexAccount}
                onChange={(e) => handleTeacherInfoChange('educarexAccount', e.target.value)}
                placeholder="username@educarex.es"
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Assigned Modules */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Assigned Modules</h3>
            </div>
            <div className="text-sm text-gray-600">
              Total: <span className="font-medium text-green-600">{getTotalAssignedHours()} hours</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Course</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Module</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Hours</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Grouping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assignedModules.map((module, index) => (
                  <tr key={index} className={module.course ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {module.course || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {module.module || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {module.hours > 0 ? `${module.hours}h` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {module.course ? (
                        <input
                          type="text"
                          value={module.grouping}
                          onChange={(e) => handleModuleGroupingChange(index, e.target.value)}
                          placeholder="Enter grouping"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Responsibility Roles */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Additional Responsibilities</h3>
            </div>
            <div className="text-sm text-gray-600">
              Total Reduction: <span className="font-medium text-purple-600">{getTotalReductionHours()} hours</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Program Responsibility</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Reduction Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {responsibilityRoles.map((role, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={role.role}
                        onChange={(e) => handleResponsibilityChange(index, 'role', e.target.value)}
                        placeholder="e.g., Department Coordinator"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={role.programResponsibility}
                        onChange={(e) => handleResponsibilityChange(index, 'programResponsibility', e.target.value)}
                        placeholder="e.g., Curriculum Development"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={role.reductionHours || ''}
                        onChange={(e) => handleResponsibilityChange(index, 'reductionHours', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timetable Preferences */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <Clock className="h-5 w-5 text-orange-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Timetable Preferences</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Check the time slots when you prefer <strong>NOT</strong> to work
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Hour</th>
                  {days.map(day => (
                    <th key={day} className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {hours.map(hour => (
                  <tr key={hour} className="bg-white">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {hour} hour
                    </td>
                    {days.map(day => (
                      <td key={`${hour}-${day}`} className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={timetablePreferences[hour][day]}
                          onChange={() => handleTimetableChange(hour, day)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Duty Preference */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <Settings className="h-5 w-5 text-indigo-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Duty Preference</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="regular-duty"
                name="duty"
                value="regular"
                checked={dutyPreference === 'regular'}
                onChange={(e) => setDutyPreference(e.target.value as 'regular' | 'recess')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="regular-duty" className="ml-3 text-sm text-gray-700">
                <span className="font-medium">Regular Duty</span>
                <span className="block text-gray-500">Standard supervision duties during class hours</span>
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="recess-duty"
                name="duty"
                value="recess"
                checked={dutyPreference === 'recess'}
                onChange={(e) => setDutyPreference(e.target.value as 'regular' | 'recess')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="recess-duty" className="ml-3 text-sm text-gray-700">
                <span className="font-medium">Recess Duty</span>
                <span className="block text-gray-500">Supervision duties during break times and recess</span>
              </label>
            </div>
          </div>
        </div>

        {/* Additional Comments */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <MessageSquare className="h-5 w-5 text-gray-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Additional Comments</h3>
          </div>
          
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Any additional preferences, requirements, or comments you'd like to share..."
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
          />
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Please review all information before submitting your preferences.
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                isSubmitting
                  ? 'text-gray-400 bg-gray-100 border border-gray-300 cursor-not-allowed'
                  : 'text-white bg-blue-600 border border-transparent hover:bg-blue-700 shadow-sm hover:shadow-md'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Submit Preferences
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}