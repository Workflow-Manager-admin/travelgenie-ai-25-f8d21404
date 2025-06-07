#!/bin/bash
cd /home/kavia/workspace/code-generation/travelgenie-ai-25-f8d21404/travelgenie_ai
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

