#!/bin/bash

if [ ! -f ".env" ]; then
  cp .env.example .env
fi

npm install

npx prisma generate

npx prisma migrate deploy

npm run seed

npm run start:debug