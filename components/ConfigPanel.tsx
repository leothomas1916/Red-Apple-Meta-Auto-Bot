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
  const [deployState, setDeployState] = useState<'idle' | 'loading' | 'active'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onConfigChange({ ...config, [name]: value });
    // If user changes config while active, revert to idle to prompt update
    if (deployState === 'active') {
        setDeployState('idle'); 
    }
  };

  const handleDeploy = () => {
    if (!config.phoneNumber) {
      alert("Please enter a valid WhatsApp number first.");
      return;
    }
    
    // Simulate the API connection process
    setDeployState('loading');
    setTimeout(() => {
      setDeployState('active');
      // Trigger a simulation refresh to ensure latest config is used
      onSimulate();
    }, 2000);
  };

  return (
    <div className="bg-white h-full flex flex-col border-r border-gray-200 shadow-sm overflow-y-auto w-full md:w-[450px]">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl shrink-0">
            <i className="fa-brands fa-meta"></i>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800 leading-none">Bot Architect</h1>
            <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${deployState === 'active' ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`}></span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {deployState === 'active' ? 'Live on WhatsApp' : 'Draft Mode'}
                </span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500">Configure & Deploy your business AI.</p>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Status Card (Visible when Deployed) */}
        {deployState === 'active' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
            <div className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                <i className="fa-solid fa-check"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-green-900">Bot Successfully Linked</h3>
              <p className="text-xs text-green-800 mt-1 leading-relaxed">
                Automation is now active for <strong>{config.phoneNumber}</strong>. 
                Inquiries will be handled by the "{config.tone}" AI model.
              </p>
            </div>
          </div>
        )}

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
             <label className="block text-sm font-medium text-gray-700 mb-1">Target Platform</label>
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
            <i className="fa-solid fa-masks-theater text-gray-400"></i> Personality & Engagement
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
            <textarea
              name="description"
              value={config.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-meta-blue focus:border-transparent outline-none resize-none"
              placeholder="Briefly describe what your business does..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up / Conversion Goal</label>
            <textarea
              name="followUpGoal"
              value={config.followUpGoal}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-meta-blue focus:border-transparent outline-none resize-none bg-blue-50"
              placeholder="e.g. Ask for the device model and offer to book a repair slot."
            />
            <p className="text-xs text-gray-500 mt-1">What should the bot ask to keep the conversation moving?</p>
          </div>
        </div>

        {/* Knowledge Base */}
        <div className="space-y-4">
          <div 
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          >
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2 group-hover:text-meta-blue transition-colors">
              <i className="fa-solid fa-brain text-gray-400"></i> Knowledge Base
            </h2>
            <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`}></i>
          </div>
          
          {isAdvancedOpen && (
            <div className="space-y-4 animate-fadeIn pl-2 border-l-2 border-gray-100">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location / Maps Link</label>
                <input
                  type="text"
                  name="location"
                  value={config.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-meta-blue focus:border-transparent outline-none"
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={config.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-meta-blue focus:border-transparent outline-none font-mono"
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
                  placeholder="- Return policy...&#10;- Parking..."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-3">
        <Button 
          onClick={onSimulate} 
          variant="secondary"
          fullWidth 
          icon={<i className="fa-solid fa-rotate"></i>}
        >
          {deployState === 'active' ? 'Test Live Bot' : 'Update Preview'}
        </Button>
        
        <Button 
          onClick={handleDeploy} 
          fullWidth 
          variant="primary"
          disabled={deployState === 'loading'}
          className={`${deployState === 'active' ? 'bg-green-600 hover:bg-green-700 border-green-600' : 'bg-black hover:bg-gray-800'}`}
          icon={deployState === 'loading' ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-brands fa-whatsapp"></i>}
        >
          {deployState === 'loading' 
            ? 'Connecting...' 
            : deployState === 'active' 
              ? 'Update Linked Bot' 
              : `Connect to ${config.phoneNumber || 'WhatsApp'}`
          }
        </Button>
      </div>
    </div>
  );
};