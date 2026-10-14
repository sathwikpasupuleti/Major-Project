const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sampleRate = 44100;

function createWavHeader(dataLength, sampleRate = 44100, numChannels = 2, bitsPerSample = 16) {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}

// Generate musical track
function generateTrack({ durationSeconds, bpm, scale, style }) {
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const left = new Float32Array(numSamples);
  const right = new Float32Array(numSamples);

  const beatSec = 60 / bpm;
  const sixteenthSec = beatSec / 4;

  // Render musical elements
  for (let s = 0; s < numSamples; s++) {
    const t = s / sampleRate;
    const currentBeat = t / beatSec;
    const sixteenth = Math.floor(t / sixteenthSec);

    let l = 0;
    let r = 0;

    // 1. Kick & Percussion
    const beatFraction = currentBeat % 1.0;
    if (style === 'dance' || style === 'workout') {
      // 4-on-the-floor kick
      const kickT = beatFraction * beatSec;
      if (kickT < 0.25) {
        const kickFreq = 140 * Math.exp(-kickT * 30) + 45;
        const kickEnv = Math.exp(-kickT * 18);
        const kick = Math.sin(2 * Math.PI * kickFreq * kickT) * kickEnv * 0.7;
        l += kick;
        r += kick;
      }
      // Hi-hat on offbeats
      const offbeatFraction = (currentBeat + 0.5) % 1.0;
      const hatT = offbeatFraction * beatSec;
      if (hatT < 0.08) {
        const noise = (Math.random() * 2 - 1) * Math.exp(-hatT * 60) * 0.15;
        l += noise * 0.7;
        r += noise * 0.9;
      }
    } else if (style === 'melody' || style === 'sufi' || style === 'chill') {
      // Gentle acoustic rhythm on beat 1 and 3
      const barFraction = (currentBeat % 4) / 4;
      const kickT = (currentBeat % 2) * beatSec;
      if (kickT < 0.3) {
        const kickEnv = Math.exp(-kickT * 12);
        const kick = Math.sin(2 * Math.PI * 65 * kickT) * kickEnv * 0.35;
        l += kick;
        r += kick;
      }
      // Shaker / finger click
      const clickT = (currentBeat % 1) * beatSec;
      if (clickT > beatSec * 0.48 && clickT < beatSec * 0.55) {
        const cT = clickT - beatSec * 0.5;
        const noise = (Math.random() * 2 - 1) * Math.exp(-Math.max(0, cT) * 80) * 0.12;
        l += noise;
        r += noise * 0.8;
      }
    }

    // 2. Chords & Harmonic Pad
    const chordIndex = Math.floor(currentBeat / 4) % scale.chords.length;
    const chordNotes = scale.chords[chordIndex];
    for (let c = 0; c < chordNotes.length; c++) {
      const f = chordNotes[c];
      const padEnv = 0.5 + 0.2 * Math.sin(2 * Math.PI * 0.2 * t);
      const tone = Math.sin(2 * Math.PI * f * t) * 0.08 * padEnv;
      // Warm overtone
      const tone2 = Math.sin(2 * Math.PI * f * 2 * t) * 0.03 * padEnv;
      l += tone + tone2;
      r += tone * 0.9 + tone2 * 1.1;
    }

    // 3. Bassline
    const bassNote = scale.bass[Math.floor(currentBeat / 2) % scale.bass.length];
    const bassT = (currentBeat % 0.5) * beatSec;
    const bassEnv = Math.exp(-bassT * 6);
    const bassWave = Math.sin(2 * Math.PI * bassNote * t) + 0.3 * Math.sin(2 * Math.PI * bassNote * 2 * t);
    const bass = bassWave * bassEnv * 0.3;
    l += bass;
    r += bass;

    // 4. Melodic Arpeggio / Lead
    const noteIdx = (sixteenth * 3 + Math.floor(t * 2)) % scale.lead.length;
    const leadFreq = scale.lead[noteIdx];
    const leadT = (t % sixteenthSec);
    const leadEnv = Math.exp(-leadT * 10);
    // Plucked string envelope
    const lead = (
      Math.sin(2 * Math.PI * leadFreq * t) +
      0.4 * Math.sin(2 * Math.PI * leadFreq * 2 * t) * Math.exp(-leadT * 18) +
      0.2 * Math.sin(2 * Math.PI * leadFreq * 3 * t) * Math.exp(-leadT * 25)
    ) * leadEnv * 0.25;

    // Stereo panning
    const pan = 0.5 + 0.3 * Math.sin(currentBeat * 0.5);
    l += lead * (1 - pan);
    r += lead * pan;

    // Soft master limiter
    left[s] = Math.max(-0.95, Math.min(0.95, l));
    right[s] = Math.max(-0.95, Math.min(0.95, r));
  }

  // Interleave 16-bit PCM
  const pcmBytes = Buffer.alloc(numSamples * 4);
  for (let i = 0; i < numSamples; i++) {
    const sL = Math.max(-1, Math.min(1, left[i]));
    const sR = Math.max(-1, Math.min(1, right[i]));
    pcmBytes.writeInt16LE(Math.floor(sL * 32767), i * 4);
    pcmBytes.writeInt16LE(Math.floor(sR * 32767), i * 4 + 2);
  }

  const header = createWavHeader(pcmBytes.length, sampleRate, 2, 16);
  return Buffer.concat([header, pcmBytes]);
}

const TRACK_CONFIGS = [
  {
    name: 'telugu_melody',
    durationSeconds: 45,
    bpm: 104,
    style: 'melody',
    scale: {
      lead: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25], // C Mohanam / Major Pentatonic
      chords: [
        [261.63, 329.63, 392.00],
        [220.00, 261.63, 329.63],
        [174.61, 261.63, 329.63],
        [196.00, 246.94, 293.66],
      ],
      bass: [65.41, 55.00, 43.65, 49.00]
    }
  },
  {
    name: 'hindi_sufi',
    durationSeconds: 45,
    bpm: 92,
    style: 'sufi',
    scale: {
      lead: [293.66, 349.23, 392.00, 440.00, 523.25, 587.33], // D Minor soulful
      chords: [
        [293.66, 349.23, 440.00], // Dm
        [261.63, 329.63, 392.00], // C
        [220.00, 261.63, 329.63], // Am
        [233.08, 293.66, 349.23], // Bb
      ],
      bass: [73.42, 65.41, 55.00, 58.27]
    }
  },
  {
    name: 'kollywood_beat',
    durationSeconds: 45,
    bpm: 128,
    style: 'dance',
    scale: {
      lead: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25],
      chords: [
        [220.00, 261.63, 329.63],
        [174.61, 220.00, 261.63],
        [196.00, 246.94, 293.66],
        [164.81, 196.00, 246.94],
      ],
      bass: [55.00, 43.65, 49.00, 41.20]
    }
  },
  {
    name: 'midnight_chill',
    durationSeconds: 45,
    bpm: 88,
    style: 'chill',
    scale: {
      lead: [261.63, 329.63, 392.00, 493.88, 523.25, 659.25], // Cmaj7 & Am7 dream
      chords: [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ],
      bass: [65.41, 55.00, 43.65, 49.00]
    }
  },
  {
    name: 'focus_ambient',
    durationSeconds: 45,
    bpm: 78,
    style: 'melody',
    scale: {
      lead: [329.63, 392.00, 440.00, 493.88, 587.33, 659.25], // E minor ambient
      chords: [
        [164.81, 246.94, 329.63, 392.00],
        [146.83, 220.00, 293.66, 369.99],
        [130.81, 196.00, 261.63, 329.63],
        [146.83, 220.00, 293.66, 369.99],
      ],
      bass: [41.20, 36.71, 32.70, 36.71]
    }
  },
  {
    name: 'workout_energy',
    durationSeconds: 45,
    bpm: 132,
    style: 'workout',
    scale: {
      lead: [293.66, 329.63, 349.23, 440.00, 523.25, 587.33],
      chords: [
        [293.66, 349.23, 440.00],
        [246.94, 311.13, 369.99],
        [220.00, 261.63, 329.63],
        [261.63, 329.63, 392.00],
      ],
      bass: [73.42, 61.74, 55.00, 65.41]
    }
  }
];

fs.mkdirSync('public/audio', { recursive: true });

for (const cfg of TRACK_CONFIGS) {
  const wavBuffer = generateTrack(cfg);
  const wavPath = path.join('public/audio', `${cfg.name}.wav`);
  const mp3Path = path.join('public/audio', `${cfg.name}.mp3`);

  fs.writeFileSync(wavPath, wavBuffer);
  console.log(`Generated WAV: ${wavPath} (${wavBuffer.length} bytes)`);

  // Convert to high-quality MP3 with ffmpeg
  try {
    execSync(`ffmpeg -y -i "${wavPath}" -codec:a libmp3lame -qscale:a 2 "${mp3Path}" 2>/dev/null`);
    console.log(`Converted to MP3: ${mp3Path}`);
  } catch (err) {
    console.warn(`Could not convert to MP3, keeping WAV:`, err.message);
  }
}
