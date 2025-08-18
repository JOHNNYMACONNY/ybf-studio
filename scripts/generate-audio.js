const fs = require('fs');
const path = require('path');

// Create a simple audio file with proper MP3 headers
const createAudioFile = (filename, duration = 30) => {
  const audioDir = path.join(__dirname, '../public/audio');
  
  // Create a simple MP3 file with minimal valid structure
  // This is a basic approach - in production you'd want real audio content
  const audioData = Buffer.from([
    // MP3 header (simplified)
    0xFF, 0xFB, 0x90, 0x44, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    // Add some dummy audio data
    ...Array(1000).fill(0x00)
  ]);
  
  fs.writeFileSync(path.join(audioDir, filename), audioData);
  console.log(`Created ${filename}`);
};

// Generate all required audio files
const audioFiles = [
  'acoustic-soul.mp3',
  'after-demo.mp3', 
  'before-demo.mp3',
  'electric-nights.mp3',
  'midnight-dreams.mp3',
  'urban-flow.mp3'
];

audioFiles.forEach(file => createAudioFile(file));
console.log('All audio files generated successfully!'); 