import { AudioPlayer } from "../AudioPlayer";

export default function AudioPlayerExample() {
  return (
    <div className="h-screen relative">
      <AudioPlayer 
        topicTitle="Bacterial Infections - Gram Positive Cocci"
        audioSrc="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      />
    </div>
  );
}
