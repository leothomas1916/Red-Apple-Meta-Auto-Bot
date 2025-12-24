import React, { useState } from 'react';
import { BusinessConfig, BotTone, BotPlatform } from '../types';
import { Button } from './ui/Button';

interface ConfigPanelProps {
  config: BusinessConfig;
  onConfigChange: (newConfig: BusinessConfig) => void;
  onSimulate: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onConfigChange, onSimulate }) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onConfigChange({ ...config, [name]: value });
  };

  return (
    <div className="bg-white h-full flex flex-col border-r border-gray-200 shadow-sm overflow-y-auto w-full md:w-[450px]">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl">
            <i className="fa-brands fa-meta"></i>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Bot Architect</h1>
        </div>
        <p className="text-sm text-gray-500">Configure your automated business messaging assistant.</p>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Core Identity */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-id-card text-gray-400"></i> Identity
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              name="name"
              value={config.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-meta-blue focus:border-transparent outline-none transition-all"
              placeholder="e.g. Acme Roasters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input
              type="text"
              name="industry"
              value={config.industry}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-meta-blue focus:border-transparent outline-none"
              placeholder="e.g. Coffee Shop, Real Estate"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Platform Preview</label>
             <div className="grid grid-cols-3 gap-2">
                {Object.values(BotPlatform).map((platform) => (
                  <button
                    key={platform}
                    onClick={() => onConfigChange({...config, platform})}
                    className={`text-sm py-2 px-1 rounded-md border text-center transition-colors ${
                      config.platform === platform 
                        ? 'bg-blue-50 border-meta-blue text-meta-blue font-medium' 
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Personality */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-masks-theater text-gray-400"></i> Personality
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tone of Voice</label>
            <select
              name="tone"
              value={config.tone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-meta-blue focus:border-transparent outline-none"
            >
              {Object.values(BotTone).map((tone) => (
                <option key={tone} value={tone}>{tone}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Description & Context</label>
            <textarea
              name="description"
              value={config.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-meta-blue focus:border-transparent outline-none resize-none"
              placeholder="Briefly describe what your business does..."
            />
          </div>
        </div>

        {/* Knowledge Base */}
        <div className="space-y-4">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          >
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-brain text-gray-400"></i> Knowledge Base
            </h2>
            <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`}></i>
          </div>
          
          {isAdvancedOpen && (
            <div className="space-y-4 animate-fadeIn">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location / Maps Link</label>
                <input
                  type="text"
                  name="location"
                  value={config.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-meta-blue focus:border-transparent outline-none"
                  placeholder="e.g. 123 Main St or https://maps..."
                />
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
                <input
                  type="text"
                  name="openingHours"
                  value={config.openingHours}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-meta-blue focus:border-transparent outline-none"
                  placeholder="Mon-Fri 9-5, Sat 10-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input
                  type="text"
                  name="contactEmail"
                  value={config.contactEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-meta-blue focus:border-transparent outline-none"
                  placeholder="support@business.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={config.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-meta-blue focus:border-transparent outline-none"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FAQs & Facts</label>
                <textarea
                  name="faqs"
                  value={config.faqs}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-meta-blue focus:border-transparent outline-none"
                  placeholder="- Return policy: 30 days&#10;- Parking: Free in rear&#10;- Delivery: Orders over $50"
                />
                <p className="text-xs text-gray-500 mt-1">Add specific facts the bot should use to answer questions.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <Button 
          onClick={onSimulate} 
          fullWidth 
          icon={<i className="fa-solid fa-play"></i>}
        >
          Update & Simulate Bot
        </Button>
      </div>
    </div>
  );
};