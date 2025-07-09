#!/bin/bash

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}Installing dependencies for all packages...${NC}"
npm install

echo -e "\n${BLUE}Installing server dependencies...${NC}"
cd server && npm install

echo -e "\n${BLUE}Installing client dependencies...${NC}"
cd ../client && npm install

echo -e "\n${BLUE}Installing shared dependencies...${NC}"
cd ../shared && npm install

echo -e "\n${YELLOW}Creating global symlink...${NC}"
cd ../shared && npm link

echo -e "\n${BLUE}Creating local symlink to server code...${NC}"
cd ../server && npm link @clubhive/shared

echo -e "\n${BLUE}Creating local symlink to client code...${NC}"
cd ../client && npm link @clubhive/shared

echo -e "\n${GREEN}Setup complete!${NC}"