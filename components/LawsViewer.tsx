'use client';

import { useGovernmentStore } from '@/lib/store';
import { FileText, Gavel, CheckCircle, XCircle, Clock, AlertCircle, User, DollarSign } from 'lucide-react';

export function LawsViewer() {
  const { state, selectAgent } = useGovernmentStore();

  const laws = state.laws || [];
  const lawsByStatus = {
    enacted: laws.filter(l => l.status === 'enacted'),
    passed: laws.filter(l => l.status === 'passed'),
    'floor-vote': laws.filter(l => l.status === 'floor-vote'),
    committee: laws.filter(l => l.status === 'committee'),
    drafted: laws.filter(l => l.status === 'drafted'),
    vetoed: laws.filter(l => l.status === 'vetoed')
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      economic: 'bg-green-100 text-green-800 border-green-300',
      social: 'bg-blue-100 text-blue-800 border-blue-300',
      environmental: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      security: 'bg-red-100 text-red-800 border-red-300',
      technology: 'bg-purple-100 text-purple-800 border-purple-300',
      healthcare: 'bg-pink-100 text-pink-800 border-pink-300',
      education: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      infrastructure: 'bg-orange-100 text-orange-800 border-orange-300',
      other: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      enacted: { color: 'bg-green-500 text-white', icon: CheckCircle, label: 'ENACTED' },
      passed: { color: 'bg-blue-500 text-white', icon: CheckCircle, label: 'PASSED' },
      'floor-vote': { color: 'bg-yellow-500 text-white', icon: Clock, label: 'FLOOR VOTE' },
      committee: { color: 'bg-orange-500 text-white', icon: Clock, label: 'COMMITTEE' },
      drafted: { color: 'bg-gray-500 text-white', icon: FileText, label: 'DRAFTED' },
      vetoed: { color: 'bg-red-500 text-white', icon: XCircle, label: 'VETOED' }
    };
    return badges[status as keyof typeof badges] || badges.drafted;
  };

  const getSponsorName = (sponsorId: string) => {
    const agent = state.agents.find(a => a.id === sponsorId);
    return agent?.name || 'Unknown';
  };

  const formatBudget = (amount: number) => {
    if (amount >= 1e12) return `$${(amount / 1e12).toFixed(1)}T`;
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    return `$${amount.toLocaleString()}`;
  };

  const getVoteSummary = (law: any) => {
    if (!law.votes || law.votes.length === 0) return null;
    const yes = law.votes.filter((v: any) => v.vote === 'yes').length;
    const no = law.votes.filter((v: any) => v.vote === 'no').length;
    const abstain = law.votes.filter((v: any) => v.vote === 'abstain').length;
    return { yes, no, abstain, total: law.votes.length };
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gavel className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Laws & Policies</h1>
                <p className="text-sm text-gray-600">Legislative activity and policy creation</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">{laws.length}</div>
              <div className="text-sm text-gray-600">Total Laws</div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {Object.entries(lawsByStatus).map(([status, statusLaws]) => {
            const badge = getStatusBadge(status);
            const Icon = badge.icon;
            return (
              <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600 uppercase">{badge.label}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{statusLaws.length}</div>
              </div>
            );
          })}
        </div>

        {/* Laws List */}
        {laws.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Laws Created Yet</h3>
            <p className="text-gray-600">Agents will create laws as the simulation progresses</p>
          </div>
        ) : (
          <div className="space-y-4">
            {laws.map((law) => {
              const badge = getStatusBadge(law.status);
              const Icon = badge.icon;
              const votes = getVoteSummary(law);
              const sponsorAgent = state.agents.find(a => a.id === law.sponsor);

              return (
                <div
                  key={law.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{law.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color} flex items-center space-x-1`}>
                          <Icon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{law.description}</p>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(law.category)}`}>
                          {law.category}
                        </span>
                        {law.effectiveDate && (
                          <span className="text-xs text-gray-500">
                            Effective: {new Date(law.effectiveDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sponsor & Cosponsors */}
                  <div className="border-t pt-4 mb-4">
                    <div className="flex items-start space-x-6">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sponsored by</div>
                        <button
                          onClick={() => sponsorAgent && selectAgent(sponsorAgent)}
                          className="flex items-center space-x-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>{getSponsorName(law.sponsor)}</span>
                        </button>
                      </div>
                      {law.cosponsors && law.cosponsors.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Cosponsors</div>
                          <div className="flex flex-wrap gap-2">
                            {law.cosponsors.map((cosponsorId: string) => (
                              <span key={cosponsorId} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                {getSponsorName(cosponsorId)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Votes */}
                  {votes && votes.total > 0 && (
                    <div className="border-t pt-4 mb-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Voting Results</div>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                              <div className="h-full flex">
                                {votes.yes > 0 && (
                                  <div
                                    className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${(votes.yes / votes.total) * 100}%` }}
                                  >
                                    {votes.yes > 2 && votes.yes}
                                  </div>
                                )}
                                {votes.no > 0 && (
                                  <div
                                    className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${(votes.no / votes.total) * 100}%` }}
                                  >
                                    {votes.no > 2 && votes.no}
                                  </div>
                                )}
                                {votes.abstain > 0 && (
                                  <div
                                    className="bg-gray-400 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${(votes.abstain / votes.total) * 100}%` }}
                                  >
                                    {votes.abstain > 2 && votes.abstain}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span className="flex items-center space-x-1">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span>Yes: {votes.yes}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              <span>No: {votes.no}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                              <span>Abstain: {votes.abstain}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Impact */}
                  <div className="border-t pt-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Projected Impact</div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="text-gray-600">Budget Change</div>
                          <div className={`font-semibold ${law.impact.budgetChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {law.impact.budgetChange >= 0 ? '+' : ''}{formatBudget(law.impact.budgetChange)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="text-gray-600">Affected Population</div>
                          <div className="font-semibold text-blue-600">
                            {law.impact.affectedPopulation > 0
                              ? `${(law.impact.affectedPopulation / 1e6).toFixed(1)}M`
                              : 'TBD'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <div>
                          <div className="text-gray-600">Implementation Cost</div>
                          <div className="font-semibold text-orange-600">
                            {law.impact.implementationCost > 0
                              ? formatBudget(law.impact.implementationCost)
                              : 'Minimal'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
