'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ToastNotification from '../../components/ToastNotification';
import ThreeDModel from '../../components/ThreeDModel';

interface ModelSettings {
  modelUrl: string;
  rotationSpeed: number;
  scale: number;
  lightIntensity: number;
  lightColor: string;
  animationDelay: number; // Added animationDelay
  animationPlaybackSpeed: number; // Added animationPlaybackSpeed
}

interface ContentData {
  modelSettings: ModelSettings;
  // Other content sections would also be here if fetched together
}

export default function AdminModelPage() {
  const { status } = useSession();
  const router = useRouter();
  const [modelSettings, setModelSettings] = useState<ModelSettings | null>(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
    } else if (status === 'authenticated') {
      fetchModelSettings();
    }
  }, [status, router]);

  const fetchModelSettings = async () => {
    try {
      setLoadingContent(true);
      const res = await fetch('/api/content'); // Fetch all content, then extract modelSettings
      if (!res.ok) {
        throw new Error(`Failed to fetch content: ${res.statusText}`);
      }
      const data: ContentData = await res.json();
      setModelSettings(data.modelSettings);
    } catch (error: unknown) {
      console.error('Error fetching model settings:', error);
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Failed to load model settings.' });
    } finally {
      setLoadingContent(false);
    }
  };

  const handleSettingChange = (field: keyof ModelSettings, value: string | number) => {
    setModelSettings(prevSettings => {
      if (!prevSettings) return null;
      return { ...prevSettings, [field]: value };
    });
  };

  const handleSave = async () => {
    if (!modelSettings) return;
    setSaving(true);
    setToast(null); // Clear any existing toast
    try {
      // Send only modelSettings to the API, or merge with existing content if API expects full content
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelSettings }), // Sending only modelSettings for now
      });

      if (!res.ok) {
        throw new Error(`Failed to save model settings: ${res.statusText}`);
      }
      setToast({ type: 'success', message: 'Model settings saved successfully!' });
    } catch (error: unknown) {
      console.error('Error saving model settings:', error);
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Failed to save model settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loadingContent) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3a3a3a] text-white text-4xl font-black overflow-hidden">Loading 3D Model Controls...</div>;
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-[#3a3a3a] text-white p-8">
        <div className="flex items-center justify-start mb-6">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-[#CFCFCF] font-bold text-2xl py-2 px-4 rounded"
          >
            ←
          </button>
          <h1 className="text-4xl font-black text-center flex-grow">3D Model Controls</h1>
        </div>
        <p className="text-gray-300 text-center mb-8">Adjust the properties of your 3D model.</p>

        {toast && (
          <ToastNotification
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {modelSettings && (
          <div className="space-y-6 bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
            <div>
              <label htmlFor="modelUrl" className="block text-gray-400 mb-2">Model URL:</label>
              <input
                type="text"
                id="modelUrl"
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                value={modelSettings.modelUrl}
                onChange={(e) => handleSettingChange('modelUrl', e.target.value)}
              />
            </div>

            {modelSettings.modelUrl && (
              <div className="w-full h-96 bg-gray-900 rounded-lg mt-4">
                <ThreeDModel />
              </div>
            )}

            <div>
              <label htmlFor="rotationSpeed" className="block text-gray-400 mb-2">Rotation Speed:</label>
              <input
                type="range"
                id="rotationSpeed"
                min="0" max="0.1" step="0.001"
                className="w-full"
                value={modelSettings.rotationSpeed}
                onChange={(e) => handleSettingChange('rotationSpeed', parseFloat(e.target.value))}
              />
              <span className="text-sm text-gray-500">{modelSettings.rotationSpeed.toFixed(3)}</span>
            </div>

            <div>
              <label htmlFor="scale" className="block text-gray-400 mb-2">Scale:</label>
              <input
                type="range"
                id="scale"
                min="0.1" max="6" step="0.1"
                className="w-full"
                value={modelSettings.scale}
                onChange={(e) => handleSettingChange('scale', parseFloat(e.target.value))}
              />
              <span className="text-sm text-gray-500">{modelSettings.scale.toFixed(1)}</span>
            </div>

            <div>
              <label htmlFor="lightIntensity" className="block text-gray-400 mb-2">Light Intensity:</label>
              <input
                type="range"
                id="lightIntensity"
                min="0" max="5" step="0.1"
                className="w-full"
                value={modelSettings.lightIntensity}
                onChange={(e) => handleSettingChange('lightIntensity', parseFloat(e.target.value))}
              />
              <span className="text-sm text-gray-500">{modelSettings.lightIntensity.toFixed(1)}</span>
            </div>

            <div>
              <label htmlFor="animationDelay" className="block text-gray-400 mb-2">Animation Delay (ms):</label>
              <input
                type="range"
                id="animationDelay"
                min="0" max="10000" step="100"
                className="w-full"
                value={modelSettings.animationDelay ?? 0}
                onChange={(e) => handleSettingChange('animationDelay', parseFloat(e.target.value))}
              />
              <span className="text-sm text-gray-500">{modelSettings.animationDelay} ms</span>
            </div>

            <div>
              <label htmlFor="animationPlaybackSpeed" className="block text-gray-400 mb-2">Animation Playback Speed:</label>
              <input
                type="range"
                id="animationPlaybackSpeed"
                min="0.1" max="5" step="0.1"
                className="w-full"
                value={modelSettings.animationPlaybackSpeed ?? 1.0}
                onChange={(e) => handleSettingChange('animationPlaybackSpeed', parseFloat(e.target.value))}
              />
              <span className="text-sm text-gray-500">{(modelSettings.animationPlaybackSpeed ?? 1.0).toFixed(1)}x</span>
            </div>
            
            <div>
              <label htmlFor="lightColor" className="block text-gray-400 mb-2">Light Color:</label>
              <input
                type="color"
                id="lightColor"
                className="w-full h-10 rounded"
                value={modelSettings.lightColor}
                onChange={(e) => handleSettingChange('lightColor', e.target.value)}
              />
            </div>

            <div className="text-center mt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}