import { useState, useEffect } from "react";
import { HardDrive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { audioCacheService } from "@/lib/audioCache";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CacheManagementProps {
  cachedCount: number;
  onCacheChange: () => void;
}

export function CacheManagement({ cachedCount, onCacheChange }: CacheManagementProps) {
  const [storageSize, setStorageSize] = useState<string>("0 MB");

  useEffect(() => {
    async function calculateStorage() {
      const sizeInBytes = await audioCacheService.getCacheSize();
      const sizeInMB = sizeInBytes / (1024 * 1024);
      
      if (sizeInMB < 0.1) {
        const sizeInKB = sizeInBytes / 1024;
        setStorageSize(`${sizeInKB.toFixed(1)} KB`);
      } else {
        setStorageSize(`${sizeInMB.toFixed(1)} MB`);
      }
    }
    calculateStorage();
  }, [cachedCount]);

  const handleClearAll = async () => {
    await audioCacheService.clearAll();
    onCacheChange();
  };

  if (cachedCount === 0) {
    return null;
  }

  return (
    <div className="p-3 border rounded-md space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Offline Storage</span>
        </div>
        <span className="font-medium" data-testid="text-storage-size">{storageSize}</span>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span data-testid="text-cached-count">{cachedCount} topic{cachedCount !== 1 ? 's' : ''} cached</span>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2"
              data-testid="button-clear-cache"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Offline Storage?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove all cached audio files ({storageSize}). You'll need to re-download topics to use them offline.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-clear">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleClearAll}
                data-testid="button-confirm-clear"
              >
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
