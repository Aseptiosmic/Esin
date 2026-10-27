#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

command -v node >/dev/null || { echo 'Node.js is required.' >&2; exit 1; }
command -v java >/dev/null || { echo 'Java JDK 17+ (JAVA_HOME) is required to build the Android APK.' >&2; exit 2; }
command -v keytool >/dev/null || { echo 'keytool is required to create or inspect the signing key.' >&2; exit 2; }

npm install
npm run icons
npx expo prebuild --platform android --clean

KEYSTORE="$ROOT/android/app/esinfy-release.keystore"
PROPERTIES="$ROOT/android/keystore.properties"
if [[ ! -f "$KEYSTORE" ]]; then
  STORE_PASSWORD="${ESINFY_STORE_PASSWORD:-$(python3 -c 'import secrets; print(secrets.token_hex(20))')}"
  KEY_PASSWORD="${ESINFY_KEY_PASSWORD:-$STORE_PASSWORD}"
  keytool -genkeypair -v -keystore "$KEYSTORE" -storetype JKS -alias esinfy -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Esinfy, OU=Mobile, O=Esinfy, L=Istanbul, ST=Istanbul, C=TR" -storepass "$STORE_PASSWORD" -keypass "$KEY_PASSWORD"
  cat > "$PROPERTIES" <<PROPS
storeFile=app/esinfy-release.keystore
storePassword=$STORE_PASSWORD
keyAlias=esinfy
keyPassword=$KEY_PASSWORD
PROPS
  chmod 600 "$PROPERTIES"
  echo 'Created release signing key. Back up android/app/esinfy-release.keystore and android/keystore.properties securely; never lose them.'
fi
[[ -f "$PROPERTIES" ]] || { echo "Missing $PROPERTIES; restore signing properties for an existing keystore." >&2; exit 3; }

cd "$ROOT/android"
./gradlew --no-daemon assembleRelease
APK="$ROOT/android/app/build/outputs/apk/release/app-release.apk"
[[ -f "$APK" ]] || { echo "Build completed but APK not found at $APK" >&2; exit 4; }
DEST="$ROOT/web/public/app-release.apk"
cp "$APK" "$DEST"
SIZE_BYTES=$(wc -c < "$DEST" | tr -d ' ')
SIZE_MB=$(awk "BEGIN {printf \"%.2f\", $SIZE_BYTES/1024/1024}")
if (( SIZE_BYTES >= 50*1024*1024 )); then echo "APK is ${SIZE_MB} MB; exceeds the 50 MB limit." >&2; exit 5; fi
SHA=$(sha256sum "$DEST" | awk '{print $1}')
python3 - "$ROOT/web/public/version.json" "$SHA" <<'PY'
import json,sys
p,sha=sys.argv[1:]
with open(p,encoding='utf8') as f: data=json.load(f)
data['apk_sha256']=sha
with open(p,'w',encoding='utf8') as f: json.dump(data,f,ensure_ascii=False,indent=2); f.write('\n')
PY
echo "Release APK: $DEST"
echo "Size: ${SIZE_MB} MB (${SIZE_BYTES} bytes)"
echo "SHA-256: $SHA"
