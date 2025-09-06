const fetch = require('node-fetch');

async function testBeatUpdate() {
  const testData = {
    title: "Test Beat with Preview",
    artist: "Test Artist", 
    genre: "Hip-Hop",
    bpm: 140,
    previewUrl: "https://soundcloud.com/test/test-beat",
    audioUrl: "/audio/test.mp3",
    description: "Test beat for preview functionality",
    mp3Price: 19,
    wavPrice: 29,
    premiumPrice: 49,
    exclusivePrice: 199,
    status: "published"
  };

  try {
    console.log('Testing beat creation with preview URL...');
    console.log('Request data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/admin/beats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: This won't work without proper auth, but shows the structure
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log('Response:', result);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testBeatUpdate();
