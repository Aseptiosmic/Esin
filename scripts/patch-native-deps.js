const fs = require('node:fs');
const path = require('node:path');

const packagePath = require.resolve('react-native-track-player/package.json');
const playerPackage = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
if (playerPackage.version !== '4.1.2') {
  throw new Error(`Expected react-native-track-player 4.1.2; found ${playerPackage.version}`);
}

const sourcePath = path.join(
  path.dirname(packagePath),
  'android/src/main/java/com/doublesymmetry/trackplayer/module/MusicModule.kt',
);
let source = fs.readFileSync(sourcePath, 'utf8');
const fixes = [
  [
    'Arguments.fromBundle(musicService.tracks[index].originalItem)',
    'Arguments.fromBundle(musicService.tracks[index].originalItem ?: Bundle())',
  ],
  [
    'musicService.tracks[musicService.getCurrentTrackIndex()].originalItem\n            )',
    'musicService.tracks[musicService.getCurrentTrackIndex()].originalItem ?: Bundle()\n            )',
  ],
];

for (const [before, after] of fixes) {
  if (source.includes(after)) continue;
  const count = source.split(before).length - 1;
  if (count !== 1) {
    throw new Error(`Could not safely patch react-native-track-player source (expected one match, got ${count}).`);
  }
  source = source.replace(before, after);
}

fs.writeFileSync(sourcePath, source);
console.log('Applied Android/Kotlin nullability compatibility fix for react-native-track-player 4.1.2.');
