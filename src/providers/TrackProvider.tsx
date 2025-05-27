import { useRef, useState, useEffect } from 'react';

// contexts
import TrackContext from '../contexts/TrackContext';

// types
import type { IAlbum, ITrack } from '../types/types';

// interfaces
interface IProps {
  children: React.ReactNode;
  albums: IAlbum[];
}

const TrackProvider: React.FC<IProps> = ({ children, albums }) => {
  const audioRef = useRef<HTMLAudioElement>(null!);

  const [volume, setVolume] = useState<number>(0.5);
  const [muted, setMuted] = useState<boolean>(false);
  const [lastVolume, setLastVolume] = useState<number>(0.5);
  const [trackDuration, setTrackDuration] = useState<number>(0);
  const [prevTrack, setPrevTrack] = useState<ITrack | null>(null);
  const [nextTrack, setNextTrack] = useState<ITrack | null>(null);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [currentState, setCurrentState] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<ITrack | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<IAlbum | null>(null);
  const [queuedAlbum, setQueuedAlbum] = useState<IAlbum | null>(null);
  const [albumTrackIndices, setAlbumTrackIndices] = useState<Record<string, number>>({}); // Store last played index for each album

  // Initialize albumTrackIndices for all albums
  useEffect(() => {
    const initialIndices: Record<string, number> = {};
    albums.forEach((album) => {
      initialIndices[album.id] = -1; // Start at -1 (no track played yet)
    });
    setAlbumTrackIndices(initialIndices);
  }, [albums]);

  // Update prev/next tracks when currentTrack or currentAlbum changes
  useEffect(() => {
    if (currentAlbum?.tracks) {
      const currentIndex = currentAlbum.tracks.findIndex((track) => track.id === currentTrack?.id);

      const prevIndex = currentIndex - 1;
      const nextIndex = currentIndex + 1;

      setPrevTrack(currentAlbum.tracks[prevIndex]);
      setNextTrack(currentAlbum.tracks[nextIndex]);

      setTrackDuration(0);
      setCurrentProgress(0);
    }
  }, [currentAlbum, currentTrack?.id]);

  // Keyboard event listener for Q, W, E, R during the second half
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (trackDuration && currentProgress >= trackDuration/2 ) {
        let selectedAlbum: IAlbum | undefined;

        switch (e.key.toUpperCase()) {
          case 'Q':
            selectedAlbum = albums.find((album) => album.name === 'Relaxation');
            break;
          case 'W':
            selectedAlbum = albums.find((album) => album.name === 'Focus');
            break;
          case 'E':
            selectedAlbum = albums.find((album) => album.name === 'Stress');
            break;
          case 'R':
            selectedAlbum = albums.find((album) => album.name === 'Memory');
            break;
          default:
            return;
        }

        if (selectedAlbum) {
          setQueuedAlbum(selectedAlbum);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentProgress, trackDuration, albums]);

  
  const addItem = (track: ITrack, album: IAlbum): void => {
    setCurrentTrack(track);
    setCurrentAlbum(album);

    // Check if tracks exists before accessing findIndex
    if (album.tracks) {
      const currentIndex = album.tracks.findIndex((t) => t.id === track.id);
      setAlbumTrackIndices((prev) => ({
        ...prev,
        [album.id]: currentIndex,
      }));
    } else {
      setAlbumTrackIndices((prev) => ({
        ...prev,
        [album.id]: -1, // Default to -1 if no tracks
      }));
    }
};

  const changeState = (state: string): void => {
    setCurrentState(state);
  };

  const handlePlay = (): void => {
    const audioElement = audioRef?.current;

    const audioPromise = audioElement?.play();

    audioPromise?.then(null).catch(() => {
      // log error
    });
  };

  useEffect(() => {
    const audioElement = audioRef?.current;

    audioElement?.addEventListener('loadeddata', handlePlay);

    return () => {
      audioElement?.removeEventListener('loadeddata', handlePlay);
    };
  }, [currentTrack]);

  const handlePlayPause = (track: ITrack, album: IAlbum): void => {
    const audioElement = audioRef?.current;

    if (currentTrack?.id !== track.id) {
      addItem(track, album);
      audioElement?.load();
    } else if (currentState === 'playing') {
      audioElement?.pause();
    } else {
      handlePlay();
    }
  };


  


  const handleOnEnded = (): void => {
    if (queuedAlbum && queuedAlbum.tracks && queuedAlbum.tracks.length > 0) {
      const lastPlayedIndex = albumTrackIndices[queuedAlbum.id] ?? -1;
      const nextIndex = (lastPlayedIndex + 1) % queuedAlbum.tracks.length;
      const nextTrackFromQueuedAlbum = queuedAlbum.tracks[nextIndex];
      handlePlayPause(nextTrackFromQueuedAlbum, queuedAlbum);
      setQueuedAlbum(null);
    } else if (nextTrack && currentAlbum && currentAlbum.tracks && currentAlbum.tracks.length > 0) {
      handlePlayPause(nextTrack, currentAlbum);
    } else {
      setCurrentProgress(0);
    }
  };

  const handleOnLoadedMetaData = (): void => {
    if (audioRef?.current) {
      setTrackDuration(audioRef.current.duration);
    }
  };

  const handleOnCanPlay = (e: React.SyntheticEvent<HTMLAudioElement>): void => {
    e.currentTarget.volume = volume;
  };

  const handleVolumeChange = (volumeValue: number): void => {
    if (audioRef?.current) {
      setVolume(volumeValue);

      const audioElement = audioRef.current;

      audioElement.volume = volumeValue;

      if (volumeValue === 0) {
        setMuted(true);

        setLastVolume(0.1);
      }
    }
  };

  const handleMuteChange = (): void => {
    if (audioRef?.current) {
      const audioElement = audioRef.current;

      if (muted) {
        setMuted(false);

        setVolume(lastVolume);

        audioElement.volume = lastVolume;
      } else {
        setLastVolume(audioElement.volume);

        setVolume(0);

        setMuted(true);

        audioElement.volume = 0;
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (audioRef?.current) {
      const audioElement = audioRef.current;

      setCurrentProgress(e.currentTarget.valueAsNumber);

      audioElement.currentTime = e.currentTarget.valueAsNumber;
    }
  };

  const providerValue = {
    muted,
    volume,
    audioRef,
    prevTrack,
    nextTrack,
    currentState,
    currentTrack,
    currentAlbum,
    trackDuration,
    currentProgress,
    addItem,
    changeState,
    handlePlayPause,
    handleMuteChange,
    handleVolumeChange,
    handleProgressChange,
  };

  return (
    <TrackContext value={providerValue}>
      <audio
        ref={audioRef}
        preload='auto'
        onEnded={handleOnEnded}
        onCanPlay={handleOnCanPlay}
        onPause={() => changeState('paused')}
        onPlaying={() => changeState('playing')}
        onLoadedMetadata={handleOnLoadedMetaData}
        onDurationChange={(e) => setTrackDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentProgress(e.currentTarget.currentTime)}
      >
        <track kind='captions' />
        <source type='audio/mpeg' src={currentTrack?.mediaurl} />
        Your browser does not support the audio tag.
      </audio>
      {children}
    </TrackContext>
  );
};

export default TrackProvider;