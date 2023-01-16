#!/bin/bash
PROJECT_DIR="$PWD"
BACKEND_DIR=$PROJECT_DIR/backend/node
FRONTEND_DIR=$PROJECT_DIR/frontend
GO_DIR=$PROJECT_DIR/backend/go/cmd/micros


#npm install -g pm2
cd $BACKEND_DIR && npm install
cd $FRONTEND_DIR && yarn install

cd $GO_DIR
pm2p start go -- run .

cd $BACKEND_DIR
pm2 start index.js

cd $FRONTEND_DIR
pm2 start yarn -- start
