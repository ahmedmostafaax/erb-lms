#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="$HOME/lms/backups"
mkdir -p "$BACKUP_DIR"
docker exec lms_mongo mongodump --db lms --archive > "$BACKUP_DIR/lms-$DATE.archive" 2>/dev/null || true
gzip -f "$BACKUP_DIR/lms-$DATE.archive" 2>/dev/null || true
find "$BACKUP_DIR" -name "lms-*.archive.gz" -mtime +7 -delete 2>/dev/null || true
if [ "$(date +%u)" = "7" ]; then
  docker system prune -f
fi
df -h / | tail -1 >> "$BACKUP_DIR/disk.log"
