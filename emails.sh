#!/bin/bash

LOCALHOST="http://localhost:8080/"

start chrome $LOCALHOST"emails.html"

# Start local server to provide JSON file
http-server -c-1
