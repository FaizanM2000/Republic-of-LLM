'use client';

import { useState } from 'react';
import { useGovernmentStore } from '@/lib/store';
import { Settings, Brain, Key, Zap } from 'lucide-react';

export function LLMConfig() {
  const { updateGeminiApiKey } = useGovernmentStore();
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleUpdateApiKey = () => {
    if (apiKey.trim()) {
      try {
        updateGeminiApiKey(apiKey.trim());
        setIsOpen(false);
        alert('Gemini API key updated successfully!');
      } catch (error) {
        alert('Failed to update API key: ' + error);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">AI Integration</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="mb-3">
        <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          🤖 Gemini AI Active
        </div>
      </div>

      {isOpen && (
        <div className="space-y-4 border-t border-gray-100 pt-4">
          <div className="bg-green-50 rounded-lg p-3">
            <h4 className="font-medium text-green-900 mb-2">🚀 Gemini AI Active</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Using Google Gemini 2.5 Flash for AI decisions</li>
              <li>• Fast & high-quality reasoning</li>
              <li>• Cost-effective AI decisions (~$0.01 per agent)</li>
              <li>• Update API key below if needed</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Key className="w-4 h-4 inline mr-1" />
              Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key to replace default"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 mb-2">How LLM Integration Works:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Agents use AI to make decisions about creating new entities</li>
              <li>• Each agent has a personality-driven prompt</li>
              <li>• Fallback to simulation if LLM calls fail</li>
              <li>• Constitutional constraints still apply</li>
            </ul>
          </div>

          <button
            onClick={handleUpdateApiKey}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
            disabled={!apiKey.trim()}
          >
            <Key className="w-4 h-4" />
            <span>Update API Key</span>
          </button>

          <div className="text-xs text-gray-500">
            <p className="mb-1">
              <strong>Cost Warning:</strong> LLM calls will be made for each agent decision.
            </p>
            <p>
              <strong>Privacy:</strong> Government simulation data will be sent to Google Gemini.
            </p>
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className="text-xs text-gray-500 mt-3">
        Agents are making AI-powered decisions using Google Gemini
      </div>
    </div>
  );
}