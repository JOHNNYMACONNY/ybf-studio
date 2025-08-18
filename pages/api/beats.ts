import type { NextApiRequest, NextApiResponse } from 'next';
import type { Beat } from '../../types/beat';

// Mock data for beats with snippet system
const mockBeats: Beat[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'AudioService',
    genre: 'R&B',
    bpm: 140,
    price: 29.99,
    coverArt: '/assets/beat_cover_1.png',
    audioUrl: '/audio/midnight-dreams.mp3', // Legacy field
    previewUrl: 'https://soundcloud.com/audioservice/midnight-dreams-preview', // SoundCloud snippet
    fullTrackUrl: 'https://drive.google.com/uc?export=download&id=1ABC123DEF456', // Google Drive full track
    duration: '3:45',
    previewDuration: '0:30',
    licenseTypes: {
      mp3: 29.99,
      wav: 49.99,
      premium: 149.99,
      exclusive: 299.99
    }
  },
  {
    id: '2',
    title: 'Urban Flow',
    artist: 'AudioService',
    genre: 'Hip-Hop',
    bpm: 145,
    price: 24.99,
    coverArt: '/assets/beat_cover_2.png',
    audioUrl: '/audio/urban-flow.mp3',
    previewUrl: 'https://soundcloud.com/audioservice/urban-flow-preview',
    fullTrackUrl: 'https://drive.google.com/uc?export=download&id=2DEF456GHI789',
    duration: '3:30',
    previewDuration: '0:45',
    licenseTypes: {
      mp3: 24.99,
      wav: 44.99,
      premium: 124.99,
      exclusive: 249.99
    }
  },
  {
    id: '3',
    title: 'Electric Nights',
    artist: 'AudioService',
    genre: 'Synthwave',
    bpm: 120,
    price: 19.99,
    coverArt: '/assets/beat_cover_3.png',
    audioUrl: '/audio/electric-nights.mp3',
    previewUrl: 'https://soundcloud.com/audioservice/electric-nights-preview',
    fullTrackUrl: 'https://drive.google.com/uc?export=download&id=3GHI789JKL012',
    duration: '4:15',
    previewDuration: '0:60',
    licenseTypes: {
      mp3: 19.99,
      wav: 39.99,
      premium: 119.99,
      exclusive: 199.99
    }
  },
  {
    id: '4',
    title: 'Acoustic Soul',
    artist: 'AudioService',
    genre: 'Lo-fi',
    bpm: 85,
    price: 22.99,
    coverArt: '/assets/beat_cover_4.png',
    audioUrl: '/audio/acoustic-soul.mp3',
    previewUrl: 'https://soundcloud.com/audioservice/acoustic-soul-preview',
    fullTrackUrl: 'https://drive.google.com/uc?export=download&id=4JKL012MNO345',
    duration: '3:20',
    previewDuration: '0:30',
    licenseTypes: {
      mp3: 22.99,
      wav: 42.99,
      premium: 122.99,
      exclusive: 229.99
    }
  },
  {
    id: '5',
    title: 'Trap Anthem',
    artist: 'AudioService',
    genre: 'Trap',
    bpm: 150,
    price: 34.99,
    coverArt: '/assets/beat_cover_1.png',
    audioUrl: '/audio/trap-anthem.mp3',
    previewUrl: 'https://soundcloud.com/audioservice/trap-anthem-preview',
    fullTrackUrl: 'https://drive.google.com/uc?export=download&id=5MNO345PQR678',
    duration: '3:55',
    previewDuration: '0:45',
    licenseTypes: {
      mp3: 34.99,
      wav: 54.99,
      premium: 134.99,
      exclusive: 349.99
    }
  },
  {
    id: '6',
    title: 'Drill Beat',
    artist: 'AudioService',
    genre: 'Drill',
    bpm: 140,
    price: 27.99,
    coverArt: '/assets/beat_cover_2.png',
    audioUrl: '/audio/drill-beat.mp3',
    previewUrl: 'https://soundcloud.com/audioservice/drill-beat-preview',
    fullTrackUrl: 'https://drive.google.com/uc?export=download&id=6PQR678STU901',
    duration: '3:10',
    previewDuration: '0:30',
    licenseTypes: {
      mp3: 27.99,
      wav: 47.99,
      premium: 127.99,
      exclusive: 279.99
    }
  },
  {
    id: '7',
    title: 'Chill Vibes',
    artist: 'AudioService',
    genre: 'Lo-fi',
    bpm: 80,
    price: 18.99,
    coverArt: '/assets/beat_cover_3.png',
    audioUrl: '/audio/chill-vibes.mp3',
    previewUrl: 'https://soundcloud.com/audioservice/chill-vibes-preview',
    fullTrackUrl: 'https://drive.google.com/uc?export=download&id=7STU901VWX234',
    duration: '4:00',
    previewDuration: '0:60',
    licenseTypes: {
      mp3: 18.99,
      wav: 38.99,
      premium: 118.99,
      exclusive: 189.99
    }
  },
  {
    id: '8',
    title: 'Energetic Flow',
    artist: 'AudioService',
    genre: 'Hip-Hop',
    bpm: 155,
    price: 31.99,
    coverArt: '/assets/beat_cover_4.png',
    audioUrl: '/audio/energetic-flow.mp3',
    previewUrl: 'https://soundcloud.com/audioservice/energetic-flow-preview',
    fullTrackUrl: 'https://drive.google.com/uc?export=download&id=8VWX234YZA567',
    duration: '3:25',
    previewDuration: '0:45',
    licenseTypes: {
      mp3: 31.99,
      wav: 51.99,
      premium: 131.99,
      exclusive: 319.99
    }
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Beat[]>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  // Add a small delay to simulate API call
  setTimeout(() => {
    res.status(200).json(mockBeats);
  }, 100);
} 