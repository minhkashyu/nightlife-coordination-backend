#!/usr/bin/env bash

./tests/config/createdata.sh nightlife-coordination-test
mocha ./tests/api/* --compilers js:babel-core/register --recursive --timeout 10000