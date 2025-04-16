#!/bin/bash
# statshot.sh

LOG=~/docker.stats.log

# docker stats-heading + stats to new log
touch ${LOG}
date >> ${LOG}
docker stats --no-stream >> ${LOG}
