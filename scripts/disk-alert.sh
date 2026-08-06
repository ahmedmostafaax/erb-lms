#!/bin/bash
USE=$(df -P / | awk 'NR==2 {gsub(/%/,"",$5); print $5}')
LOG="$HOME/lms/backups/disk.log"
mkdir -p "$(dirname "$LOG")"
echo "$(date -Is) disk=${USE}%" >> "$LOG"
if [ "$USE" -ge 85 ]; then
  echo "$(date -Is) ALERT disk ${USE}%" >> "$LOG"
  docker system prune -f >> "$LOG" 2>&1 || true
fi
