#!/bin/bash -ex

kill -SIGINT `cat .pid`
PRODUCTION=1 nohup node -max-old-space-size=8192 index.js &
echo $! > .pid