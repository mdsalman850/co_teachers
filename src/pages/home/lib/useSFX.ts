import { useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useReducedMotionSetting } from './useReducedMotionSetting';

export const useSFX = () => {
  const { settings } = useSettings();
  const reducedMotion = useReducedMotionSetting();

  const playSound = useCallback((frequency: number, duration: number = 100) => {
    if (reducedMotion || !settings.sfx) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      // Silently fail if Web Audio API is not supported
    }
  }, [reducedMotion, settings.sfx]);

  return {
    pop: () => playSound(800, 150),
    beep: () => playSound(600, 100),
    success: () => playSound(1000, 200),
  };
};