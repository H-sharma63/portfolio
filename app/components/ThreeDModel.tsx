'use client';

// This component is responsible for rendering a 3D model using React Three Fiber.
// It fetches model settings (like URL, rotation speed, scale, lighting) dynamically
// from an API and applies them to the rendered 3D scene.

import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'; // Core components for React Three Fiber
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei'; // Helper components for 3D models and controls
import { LoopOnce } from 'three'; // Three.js constant for animation looping

// Define the structure for the 3D model settings.
interface ModelSettings {
  modelUrl: string; // URL to the GLTF model file.
  rotationSpeed: number; // Speed at which the model rotates.
  scale: number; // Scale factor for the model.
  lightIntensity: number; // Intensity of the scene lights.
  lightColor: string; // Color of the scene lights.
  animationDelay: number; // Delay before playing the model's animation.
  animationPlaybackSpeed: number; // Speed of the model's animation playback.
}

// Define the structure for the content data containing model settings.
interface ContentData {
  modelSettings: ModelSettings;
}

export default function ThreeDModel() {
  // State to store the fetched 3D model settings.
  const [modelSettings, setModelSettings] = useState<ModelSettings | null>(null);

  // Effect hook to fetch model settings when the component mounts.
  useEffect(() => {
    const fetchModelSettings = async () => {
      try {
        // Fetch data from the local API route for content.
        const res = await fetch('/api/content');
        if (!res.ok) {
          throw new Error(`Failed to fetch content: ${res.statusText}`);
        }
        const data: ContentData = await res.json();
        // Assuming the API response has a 'modelSettings' object.
        setModelSettings(data.modelSettings);
      } catch (error) {
        console.error('Error fetching model settings:', error);
      }
    };

    fetchModelSettings();
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  // Render nothing until model settings are loaded
  if (!modelSettings) {
    return null;
  }

  return (
    // Canvas component from React Three Fiber, where the 3D scene is rendered.
    <Canvas className="w-full h-full top-3 left-10" gl={{ alpha: true }}>
      {/* Ambient light: illuminates all objects in the scene equally. */}
      <ambientLight intensity={modelSettings.lightIntensity * 0.5} color={modelSettings.lightColor} />
      {/* Directional lights: simulate light from a distant source (like the sun). */}
      <directionalLight position={[10, 10, 5]} intensity={modelSettings.lightIntensity} color={modelSettings.lightColor} /> {/* Key Light */}
      <directionalLight position={[-10, 10, 5]} intensity={modelSettings.lightIntensity * 0.5} color={modelSettings.lightColor} /> {/* Fill Light */}
      <directionalLight position={[0, -10, -5]} intensity={modelSettings.lightIntensity * 0.7} color={modelSettings.lightColor} /> {/* Rim Light */}
      {/* The 3D model component, passing down the fetched settings. */}
      <Model settings={modelSettings} />
      {/* OrbitControls: allows users to rotate, pan, and zoom the camera around the scene. */}
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}

// Define the props for the Model component.
interface ModelProps {
  settings: ModelSettings;
}

/**
 * Model component.
 * Loads a GLTF 3D model, applies its animations, and handles its rotation.
 * @param {ModelProps} { settings } - Props containing model URL, rotation speed, and animation settings.
 */
function Model({ settings }: ModelProps) {
  // useGLTF hook to load the 3D model from the specified URL.
  const { scene, animations } = useGLTF('/model-optimized.glb');
  // useAnimations hook to manage animations associated with the model.
  const { actions } = useAnimations(animations, scene);

  // Effect hook to play the model's animation after a a delay.
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      // Get the name of the first animation found.
      const animationName = Object.keys(actions)[0];
      // Set a timeout to play the animation after a specified delay.
      setTimeout(() => {
        // Set the animation to loop once.
        actions[animationName]?.setLoop(LoopOnce, 1);
        // Apply the specified animation playback speed.
        actions[animationName]?.setEffectiveTimeScale(settings.animationPlaybackSpeed);
        // Play the animation.
        actions[animationName]?.play();
      }, settings.animationDelay);
    }
  }, [actions, settings.animationDelay, settings.animationPlaybackSpeed]); // Dependencies for the effect. // Dependencies for the effect.

  // useFrame hook: executes code on each frame of the 3D rendering loop.
  useFrame(() => {
    // Rotate the scene around the Y-axis based on the rotation speed.
    if (scene) {
      scene.rotation.y += settings.rotationSpeed;
    }
  });

  // Render the 3D model primitive, applying its scale.
  return <primitive object={scene} scale={settings.scale} />;
}
