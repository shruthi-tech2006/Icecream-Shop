/**
 * Audio Synthesizer and Web Push Notification helper
 * Uses Web Audio API for zero-external-dependency cheerful chimes,
 * and Web Notification API for native desktop/mobile alerts.
 */

class NotificationManager {
  private audioCtx: AudioContext | null = null;
  private hasNotificationSupport = typeof window !== 'undefined' && 'Notification' in window;

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play a gentle two-tone sweet gelato chime
  playScoopChime() {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.18, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now + 0.12);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Request browser push notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.hasNotificationSupport) {
      return 'denied';
    }
    try {
      return await Notification.requestPermission();
    } catch {
      return 'denied';
    }
  }

  getPermissionState(): NotificationPermission {
    if (!this.hasNotificationSupport) return 'denied';
    return Notification.permission;
  }

  // Send native notification if permitted
  sendPush(title: string, options?: NotificationOptions) {
    this.playScoopChime();
    if (!this.hasNotificationSupport) return;
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
        });
      } catch (err) {
        console.warn('Could not launch desktop notification:', err);
      }
    }
  }
}

export const notificationManager = new NotificationManager();
