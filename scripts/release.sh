#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
force=false
min_code=""
changelog="Hata düzeltmeleri"
while (($#)); do
  case "$1" in
    --force) force=true; shift ;;
    --optional) force=false; shift ;;
    --min-version-code) min_code="${2:?Sürüm kodu gerekli}"; shift 2 ;;
    --changelog) changelog="${2:?Değişiklik açıklaması gerekli}"; shift 2 ;;
    -h|--help) echo "Kullanım: scripts/release.sh [--force|--optional] [--min-version-code N] [--changelog METİN]"; exit 0 ;;
    *) echo "Bilinmeyen seçenek: $1" >&2; exit 2 ;;
  esac
done
[[ -f keystore.properties ]] || { echo 'keystore.properties bulunamadı; README dosyasını izleyin.' >&2; exit 1; }
read -r code name < <(python3 - <<'PY'
import re
s=open('app/build.gradle.kts', encoding='utf8').read()
a=re.search(r'\bversionCode\s*=\s*(\d+)',s)
b=re.search(r'\bversionName\s*=\s*"([^"]+)"',s)
if not a or not b: raise SystemExit('Android sürümü okunamadı')
print(a.group(1),b.group(1))
PY
)
old_latest="$(python3 -c 'import json; print(json.load(open("web/public/version.json"))["latest_version_code"])')"
old_sha="$(python3 -c 'import json; print(json.load(open("web/public/version.json")).get("apk_sha256", ""))')"
if ((code < old_latest)) || { [[ -n "$old_sha" ]] && ((code == old_latest)); }; then
  echo 'Yayımlanmış sürümden daha büyük bir versionCode gerekli.' >&2; exit 1
fi
if [[ -z "$min_code" ]]; then min_code="$(python3 -c 'import json; print(json.load(open("web/public/version.json"))["min_version_code"])')"; fi
[[ "$min_code" =~ ^[0-9]+$ ]] && (( min_code > 0 && min_code <= code )) || { echo 'Geçersiz min_version_code.' >&2; exit 1; }

./gradlew :app:assembleRelease
apk="app/build/outputs/apk/release/app-release.apk"
[[ -s "$apk" ]] || { echo 'İmzalı APK bulunamadı.' >&2; exit 1; }

# Use the actual Android SDK signing tool; do not publish an unsigned or differently signed APK.
sdk="${ANDROID_SDK_ROOT:-${ANDROID_HOME:-}}"
if [[ -z "$sdk" && -f local.properties ]]; then
  sdk="$(python3 - <<'PY'
from pathlib import Path
for line in Path('local.properties').read_text().splitlines():
    if line.startswith('sdk.dir='):
        print(line.split('=',1)[1].replace('\\:', ':').replace('\\\\','\\'))
        break
PY
)"
fi
signer="$(find "${sdk:-/nonexistent}/build-tools" -name apksigner -type f 2>/dev/null | sort -V | tail -1 || true)"
[[ -x "$signer" ]] || { echo 'Android SDK build-tools/apksigner bulunamadı.' >&2; exit 1; }
signature="$($signer verify --verbose --print-certs "$apk")"
printf '%s\n' "$signature"
cert="$(printf '%s\n' "$signature" | sed -n 's/.*Signer #1 certificate SHA-256 digest: //p' | tr '[:upper:]' '[:lower:]' | head -1)"
[[ "$cert" =~ ^[0-9a-f]{64}$ ]] || { echo 'İmza sertifikası doğrulanamadı.' >&2; exit 1; }
cert_file="scripts/release-certificate.sha256"
if [[ -f "$cert_file" ]]; then
  expected="$(tr -d '[:space:]' < "$cert_file" | tr '[:upper:]' '[:lower:]')"
  [[ "$cert" == "$expected" ]] || { echo 'HATA: APK önceki sürümden farklı bir sertifika ile imzalanmış!' >&2; exit 1; }
else
  printf '%s\n' "$cert" > "$cert_file"
  echo 'İlk yayın sertifikası kaydedildi; scripts/release-certificate.sha256 dosyasını sürüm kontrolüne ekleyin.'
fi
sha="$(sha256sum "$apk" | awk '{print $1}')"
cp "$apk" web/public/app-release.apk.tmp
mv web/public/app-release.apk.tmp web/public/app-release.apk
python3 - "$code" "$name" "$min_code" "$force" "$sha" "$changelog" <<'PY'
import json, os, sys
code, name, minimum, force, sha, changes = sys.argv[1:]
manifest = dict(latest_version_code=int(code), latest_version_name=name,
    min_version_code=int(minimum), force_update=(force == 'true'),
    apk_url='https://esin.vercel.app/app-release.apk', apk_sha256=sha, changelog=changes)
path = 'web/public/version.json'
with open(path + '.tmp', 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2); f.write('\n')
os.replace(path + '.tmp', path)
PY
printf '\nYayına hazır: %s (%s), SHA-256 %s\n' "$name" "$code" "$sha"
echo 'web/ klasöründen Vercel CLI ile dağıtın; APK Git tarafından izlenmez.'
