#!/usr/bin/env bash
# Metro işləmədən RN "Could not connect to development server" verir.
# Əvvəl Metro (8081), sonra həmin platform üçün ilk bundle hazır olana qədər gözləyir.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${RCT_METRO_PORT:-8081}"
export RCT_METRO_PORT="$PORT"

PLATFORM="${1:-}"
shift || true

case "$PLATFORM" in
  ios|android) ;;
  *)
    echo "Usage: $0 ios|android [-- extra react-native args]" >&2
    exit 1
    ;;
esac

RN_PLATFORM="$PLATFORM"
if [ "$PLATFORM" = "ios" ]; then
  BUNDLE_PLAT="ios"
else
  BUNDLE_PLAT="android"
fi

metro_status_ok() {
  curl -sf "http://127.0.0.1:${PORT}/status" 2>/dev/null | grep -q "packager-status:running"
}

# Bu platform üçün bundle gerçəkdən gəlir (pipefail + curl|head SIGPIPE=23 uğursuzluq verməsin deyə fayla yazırıq)
metro_bundle_serves() {
  metro_status_ok || return 1
  local tmp
  tmp="$(mktemp)"
  if curl -sf --max-time 180 "http://127.0.0.1:${PORT}/index.bundle?platform=${BUNDLE_PLAT}&dev=true&minify=false" -o "$tmp" 2>/dev/null && [ -s "$tmp" ]; then
    rm -f "$tmp"
    return 0
  fi
  rm -f "$tmp"
  return 1
}

if metro_status_ok; then
  echo "[TikTak] Metro artıq işləyir (port ${PORT})."
else
  echo "[TikTak] Metro başladılır: --port ${PORT} --host 0.0.0.0"
  npx react-native start --port "$PORT" --host 0.0.0.0 &
  METRO_PID=$!
  for _ in $(seq 1 120); do
    if metro_status_ok; then
      echo "[TikTak] Metro status: OK."
      break
    fi
    if ! kill -0 "$METRO_PID" 2>/dev/null; then
      echo "[TikTak] Metro çıxdı. 'npx react-native start' çıxışını yoxlayın." >&2
      exit 1
    fi
    sleep 1
  done
  if ! metro_status_ok; then
    echo "[TikTak] Metro 2 dəqə ərzində status vermədi. Port: lsof -i :${PORT}" >&2
    exit 1
  fi
fi

if ! metro_bundle_serves; then
  echo "[TikTak] İlk JS bundle hazırlanır (${BUNDLE_PLAT}) — bir neçə saniyə çəkə bilər..."
  for _ in $(seq 1 180); do
    if metro_bundle_serves; then
      echo "[TikTak] Bundle hazırdır."
      break
    fi
    sleep 1
  done
fi
if ! metro_bundle_serves; then
  echo "[TikTak] Bundle 3 dəqə ərzində alınmadı. Metro terminalındakı xətanı yoxlayın." >&2
  exit 1
fi

case "$RN_PLATFORM" in
  ios)
    exec npx react-native run-ios --no-packager --port "$PORT" "$@"
    ;;
  android)
    if command -v adb >/dev/null 2>&1; then
      adb reverse "tcp:${PORT}" "tcp:${PORT}" 2>/dev/null || true
    fi
    exec npx react-native run-android --no-packager --port "$PORT" "$@"
    ;;
esac
