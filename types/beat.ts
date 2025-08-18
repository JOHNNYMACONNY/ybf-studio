export interface Beat {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  price: number;
  coverArt: string;
  audioUrl: string;           // Legacy field - will be replaced by previewUrl
  previewUrl: string;         // SoundCloud snippet URL (30-60 seconds)
  fullTrackUrl: string;       // Google Drive full track URL
  duration: string;           // Full track duration (e.g., "3:45")
  previewDuration: string;    // Preview duration (e.g., "0:30")
  description?: string;        // Optional description of the beat
  licenseTypes: {
    mp3: number;
    wav: number;
    premium: number;
    exclusive: number;
  };
}

// Updated to use consistent license IDs
export type LicenseType = 'mp3' | 'wav' | 'premium' | 'exclusive';
