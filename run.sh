#!/bin/bash
PROJECT_DIR=$PWD
BACKEND_DIR=$PROJECT_DIR/backend/node
FRONTEND_DIR=$PROJECT_DIR/frontend
GO_DIR=$PROJECT_DIR/go/cmd/micros

npm install -g pm2
cd $BACKEND_DIR && npm install
cd $FRONTEND_DIR && yarn install

cd $BACKEND_DIR
pm2 start index.js

cd $GO_DIR
echo $PWD
pm2 start go -- run .

cd $FRONTEND_DIR
pm2 start yarn -- start
