#!/bin/bash -ex

kill -SIGINT `cat .pid`
killall node