const CACHE_NAME = 'frcpath-audio-cache';

export interface CachedAudio {
  topicId: string;
  url: string;
  size?: number;
  cachedAt: number;
}

export const audioCacheService = {
  async saveAudio(topicId: string, audioUrl: string): Promise<void> {
    try {
      const cache = await caches.open(CACHE_NAME);
      const response = await fetch(audioUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch audio for caching');
      }

      await cache.put(audioUrl, response);
      
      const metadata = {
        topicId,
        url: audioUrl,
        cachedAt: Date.now(),
      };
      
      localStorage.setItem(`audio-cache-${topicId}`, JSON.stringify(metadata));
    } catch (error) {
      console.error('Error caching audio:', error);
      throw error;
    }
  },

  async isCached(topicId: string): Promise<boolean> {
    try {
      const metadata = localStorage.getItem(`audio-cache-${topicId}`);
      if (!metadata) return false;

      const { url } = JSON.parse(metadata);
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(url);
      
      return !!response;
    } catch (error) {
      console.error('Error checking cache:', error);
      return false;
    }
  },

  async getCachedAudio(topicId: string): Promise<string | null> {
    try {
      const metadata = localStorage.getItem(`audio-cache-${topicId}`);
      if (!metadata) return null;

      const { url } = JSON.parse(metadata);
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(url);
      
      if (!response) return null;

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error getting cached audio:', error);
      return null;
    }
  },

  async removeAudio(topicId: string): Promise<void> {
    try {
      const metadata = localStorage.getItem(`audio-cache-${topicId}`);
      if (!metadata) return;

      const { url } = JSON.parse(metadata);
      const cache = await caches.open(CACHE_NAME);
      await cache.delete(url);
      
      localStorage.removeItem(`audio-cache-${topicId}`);
    } catch (error) {
      console.error('Error removing cached audio:', error);
      throw error;
    }
  },

  async getAllCached(): Promise<CachedAudio[]> {
    try {
      const cached: CachedAudio[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('audio-cache-')) {
          const metadata = localStorage.getItem(key);
          if (metadata) {
            cached.push(JSON.parse(metadata));
          }
        }
      }
      
      return cached;
    } catch (error) {
      console.error('Error getting cached items:', error);
      return [];
    }
  },

  async clearAll(): Promise<void> {
    try {
      await caches.delete(CACHE_NAME);
      
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('audio-cache-')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  },

  async getCacheSize(): Promise<number> {
    try {
      const cache = await caches.open(CACHE_NAME);
      const keys = await cache.keys();
      let totalSize = 0;

      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return 0;
    }
  },
};
