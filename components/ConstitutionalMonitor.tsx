'use client';

import { useGovernmentStore } from '@/lib/store';
import { Shield, AlertTriangle, CheckCircle, Scale, Eye, Crown } from 'lucide-react';
import { ConstitutionalViolation } from '@/lib/types';

export function ConstitutionalMonitor() {
  const { state } = useGovernmentStore();

  const violationsBySeverity = state.constitutionalViolations.reduce((acc, violation) => {
    acc[violation.severity] = (acc[violation.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const checksAndBalances = [
    {
      title: 'Executive Constraints',
      description: 'Presidential power limitations and congressional oversight',
      status: state.agents.filter(a => a.type === 'executive' && a.canExpandAuthority).length <= 2 ? 'healthy' : 'warning',
      details: `${state.agents.filter(a => a.type === 'executive').length} executive agents active`
    },
    {
      title: 'Legislative Balance',
      description: 'Congressional representation and committee distribution',
      status: state.agents.filter(a => a.type === 'legislative').length >= 2 ? 'healthy' : 'warning',
      details: `${state.agents.filter(a => a.type === 'legislative').length} legislative agents, ${state.agents.filter(a => a.type === 'committee').length} committees`
    },
    {
      title: 'Judicial Independence',
      description: 'Court system autonomy and constitutional review',
      status: state.agents.filter(a => a.type === 'judicial').length >= 1 ? 'healthy' : 'critical',
      details: `${state.agents.filter(a => a.type === 'judicial').length} judicial agents monitoring constitutionality`
    },
    {
      title: 'Oversight Mechanisms',
      description: 'Independent agencies and watchdog organizations',
      status: state.agents.filter(a => a.type === 'oversight').length >= 1 ? 'healthy' : 'warning',
      details: `${state.agents.filter(a => a.type === 'oversight').length} oversight bodies active`
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Shield;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const overallHealthScore = () => {
    const healthyCount = checksAndBalances.filter(c => c.status === 'healthy').length;
    return checksAndBalances.length > 0 ? Math.round((healthyCount / checksAndBalances.length) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Constitutional Health Score */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Constitutional Health</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{overallHealthScore()}%</div>
            <div className="text-sm text-gray-500">Overall Score</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(violationsBySeverity).map(([severity, count]) => (
            <div key={severity} className="text-center p-4 rounded-lg border">
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(severity)}`}>
                {severity.toUpperCase()}
              </div>
              <div className="text-xl font-bold text-gray-900 mt-2">{count}</div>
              <div className="text-sm text-gray-500">Violations</div>
            </div>
          ))}
          <div className="text-center p-4 rounded-lg border border-green-200 bg-green-50">
            <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              RESOLVED
            </div>
            <div className="text-xl font-bold text-green-900 mt-2">
              {state.constitutionalViolations.filter(v => v.resolved).length}
            </div>
            <div className="text-sm text-green-600">Fixed Issues</div>
          </div>
        </div>
      </div>

      {/* Checks and Balances */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Scale className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Checks and Balances</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checksAndBalances.map((check, index) => {
            const StatusIcon = getStatusIcon(check.status);
            return (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{check.title}</h4>
                  <StatusIcon className={`w-5 h-5 ${getStatusColor(check.status).split(' ')[0]}`} />
                </div>
                <p className="text-sm text-gray-600 mb-2">{check.description}</p>
                <p className="text-xs text-gray-500">{check.details}</p>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(check.status)}`}>
                  {check.status.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Violations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Active Constitutional Issues</h3>
        </div>

        {state.constitutionalViolations.filter(v => !v.resolved).length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Violations</h4>
            <p className="text-gray-600">The government is operating within constitutional bounds.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {state.constitutionalViolations
              .filter(v => !v.resolved)
              .map((violation) => {
                const violatingAgent = state.agents.find(a => a.id === violation.violatingAgentId);
                return (
                  <div key={violation.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(violation.severity)}`}>
                            {violation.severity.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(violation.detectedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{violation.description}</h4>
                        {violatingAgent && (
                          <p className="text-sm text-gray-600">
                            Involving: <span className="font-medium">{violatingAgent.name}</span>
                          </p>
                        )}
                      </div>
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Constitutional Powers Matrix */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Crown className="w-6 h-6 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">Power Distribution Analysis</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Executive Power */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Executive Branch</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Decision Authority</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Agency Creation</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Budget Control</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Legislative Power */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Legislative Branch</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Oversight Authority</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Committee Power</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Budget Approval</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Judicial Power */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Judicial Branch</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Constitutional Review</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Legal Precedent</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Enforcement Check</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monitoring Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Monitoring Recommendations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Strengthen Oversight</h4>
            <p className="text-sm text-blue-700 mb-2">
              Consider creating additional oversight committees for emerging agencies.
            </p>
            <div className="text-xs text-blue-600">
              Current oversight ratio: 1:{Math.round(state.agents.length / Math.max(1, state.agents.filter(a => a.type === 'oversight').length))}
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Maintain Balance</h4>
            <p className="text-sm text-green-700 mb-2">
              Current power distribution appears balanced across branches.
            </p>
            <div className="text-xs text-green-600">
              No immediate action required
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Monitor Growth</h4>
            <p className="text-sm text-yellow-700 mb-2">
              Rapid expansion may require additional constitutional review mechanisms.
            </p>
            <div className="text-xs text-yellow-600">
              Growth rate: {state.agents.length > 10 ? '+' : ''}{((state.agents.length - 10) / 10 * 100).toFixed(1)}% from baseline
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Judicial Capacity</h4>
            <p className="text-sm text-purple-700 mb-2">
              Ensure judicial branch can handle constitutional review workload.
            </p>
            <div className="text-xs text-purple-600">
              Cases per judge: {Math.round(state.constitutionalViolations.length / Math.max(1, state.agents.filter(a => a.type === 'judicial').length))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}