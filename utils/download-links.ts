// Download link generation utility for purchased beats
// Maps beat IDs to Google Drive file IDs for full track downloads

interface BeatFileMapping {
  [beatId: string]: {
    mp3: string;
    wav: string;
    exclusive: string;
  };
}

// Google Drive file ID mappings for each beat and license type
// These would be the actual file IDs from Google Drive
const BEAT_FILE_MAPPINGS: BeatFileMapping = {
  '1': {
    mp3: '1ABC123DEF456_mp3',
    wav: '1ABC123DEF456_wav',
    exclusive: '1ABC123DEF456_exclusive'
  },
  '2': {
    mp3: '2DEF456GHI789_mp3',
    wav: '2DEF456GHI789_wav',
    exclusive: '2DEF456GHI789_exclusive'
  },
  '3': {
    mp3: '3GHI789JKL012_mp3',
    wav: '3GHI789JKL012_wav',
    exclusive: '3GHI789JKL012_exclusive'
  },
  '4': {
    mp3: '4JKL012MNO345_mp3',
    wav: '4JKL012MNO345_wav',
    exclusive: '4JKL012MNO345_exclusive'
  },
  '5': {
    mp3: '5MNO345PQR678_mp3',
    wav: '5MNO345PQR678_wav',
    exclusive: '5MNO345PQR678_exclusive'
  },
  '6': {
    mp3: '6PQR678STU901_mp3',
    wav: '6PQR678STU901_wav',
    exclusive: '6PQR678STU901_exclusive'
  },
  '7': {
    mp3: '7STU901VWX234_mp3',
    wav: '7STU901VWX234_wav',
    exclusive: '7STU901VWX234_exclusive'
  },
  '8': {
    mp3: '8VWX234YZA567_mp3',
    wav: '8VWX234YZA567_wav',
    exclusive: '8VWX234YZA567_exclusive'
  }
};

/**
 * Get the Google Drive file ID for a specific beat and license type
 */
export const getBeatFileId = (
  beatId: string, 
  licenseType: 'mp3' | 'wav' | 'exclusive'
): string => {
  const mapping = BEAT_FILE_MAPPINGS[beatId];
  if (!mapping) {
    throw new Error(`No file mapping found for beat ID: ${beatId}`);
  }
  
  const fileId = mapping[licenseType];
  if (!fileId) {
    throw new Error(`No file ID found for beat ${beatId} with license type: ${licenseType}`);
  }
  
  return fileId;
};

/**
 * Generate a Google Drive download link for a purchased beat
 */
export const generateDownloadLink = async (
  beatId: string, 
  licenseType: 'mp3' | 'wav' | 'exclusive'
): Promise<string> => {
  try {
    const fileId = getBeatFileId(beatId, licenseType);
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  } catch (error) {
    console.error('Error generating download link:', error);
    throw new Error(`Failed to generate download link for beat ${beatId}`);
  }
};

/**
 * Generate a temporary download link that expires in 24 hours
 * This would typically involve creating a temporary sharing link
 */
export const generateTemporaryDownloadLink = async (
  beatId: string, 
  licenseType: 'mp3' | 'wav' | 'exclusive',
  expiresIn: number = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
): Promise<{ url: string; expiresAt: Date }> => {
  const baseUrl = await generateDownloadLink(beatId, licenseType);
  const expiresAt = new Date(Date.now() + expiresIn);
  
  // In a real implementation, this would create a temporary sharing link
  // For now, we'll return the base URL with expiration info
  return {
    url: baseUrl,
    expiresAt
  };
};

/**
 * Validate if a download link is still valid
 */
export const isDownloadLinkValid = (expiresAt: Date): boolean => {
  return new Date() < expiresAt;
};

/**
 * Get all available license types for a beat
 */
export const getAvailableLicenses = (beatId: string): ('mp3' | 'wav' | 'exclusive')[] => {
  const mapping = BEAT_FILE_MAPPINGS[beatId];
  if (!mapping) {
    return [];
  }
  
  return Object.keys(mapping) as ('mp3' | 'wav' | 'exclusive')[];
}; 