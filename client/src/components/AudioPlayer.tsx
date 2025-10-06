import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, DownloadCloud, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { audioCacheService } from "@/lib/audioCache";
import { useToast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  topicId: string;
  topicTitle: string;
  audioSrc?: string;
}

export function AudioPlayer({ topicId, topicTitle, audioSrc }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isCached, setIsCached] = useState(false);
  const [isCaching, setIsCaching] = useState(false);
  const [actualAudioSrc, setActualAudioSrc] = useState<string | undefined>(audioSrc);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadAudio() {
      if (!audioSrc) {
        setActualAudioSrc(undefined);
        return;
      }

      const cached = await audioCacheService.isCached(topicId);
      setIsCached(cached);

      if (cached) {
        const cachedUrl = await audioCacheService.getCachedAudio(topicId);
        if (cachedUrl) {
          setActualAudioSrc(cachedUrl);
          return;
        }
      }

      setActualAudioSrc(audioSrc);
    }

    loadAudio();
  }, [topicId, audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, [actualAudioSrc]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = value[0];
    setVolume(value[0]);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 15);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(duration, audio.currentTime + 15);
  };

  const cyclePlaybackRate = () => {
    const rates = [0.75, 1, 1.25, 1.5];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSaveForOffline = async () => {
    if (!audioSrc || isCaching) return;

    try {
      setIsCaching(true);
      await audioCacheService.saveAudio(topicId, audioSrc);
      setIsCached(true);
      
      const cachedUrl = await audioCacheService.getCachedAudio(topicId);
      if (cachedUrl) {
        setActualAudioSrc(cachedUrl);
      }

      toast({
        title: "Saved for offline",
        description: "Audio is now available without internet connection",
      });
    } catch (error) {
      console.error('Error saving audio:', error);
      toast({
        title: "Error",
        description: "Failed to save audio for offline use",
        variant: "destructive",
      });
    } finally {
      setIsCaching(false);
    }
  };

  const handleRemoveCached = async () => {
    if (!isCached) return;

    try {
      await audioCacheService.removeAudio(topicId);
      setIsCached(false);
      setActualAudioSrc(audioSrc);

      toast({
        title: "Removed from offline storage",
        description: "Audio will stream from the internet",
      });
    } catch (error) {
      console.error('Error removing cached audio:', error);
      toast({
        title: "Error",
        description: "Failed to remove cached audio",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card">
      <audio ref={audioRef} src={actualAudioSrc} />
      
      <div className="flex items-center gap-4 p-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" data-testid="text-playing-topic">
            {topicTitle}
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
            {isCached && <span className="ml-2 text-primary">• Offline</span>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={skipBackward}
            data-testid="button-skip-backward"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={togglePlayPause}
            disabled={!actualAudioSrc}
            data-testid="button-play-pause"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={skipForward}
            data-testid="button-skip-forward"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
            data-testid="slider-progress"
          />
        </div>

        <div className="flex items-center gap-2">
          {isCached ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveCached}
              disabled={!audioSrc}
              data-testid="button-remove-offline"
              title="Remove from offline storage"
            >
              <Check className="h-4 w-4 text-primary" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveForOffline}
              disabled={!audioSrc || isCaching}
              data-testid="button-save-offline"
              title="Save for offline"
            >
              {isCaching ? (
                <DownloadCloud className="h-4 w-4 animate-pulse" />
              ) : (
                <DownloadCloud className="h-4 w-4" />
              )}
            </Button>
          )}

          <Badge
            variant="outline"
            className="cursor-pointer hover-elevate"
            onClick={cyclePlaybackRate}
            data-testid="button-playback-rate"
          >
            {playbackRate}x
          </Badge>

          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="w-24"
            data-testid="slider-volume"
          />
        </div>
      </div>
    </div>
  );
}
