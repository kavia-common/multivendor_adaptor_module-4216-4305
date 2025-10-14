#!/bin/bash
cd /home/kavia/workspace/code-generation/multivendor_adaptor_module-4216-4305/FrontendUI
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

