#! /bin/bash
cd /source/revea-backend
source .env
echo "change directory"
git pull origin $TARGET_BRANCH
echo "git pulled"
/home/ubuntu/.nvm/versions/node/v15.11.0/bin/yarn && /home/ubuntu/.nvm/versions/node/v15.11.0/bin/yarn build && /home/ubuntu/.nvm/versions/node/v15.11.0/bin/pm2 start ecosystem.config.js --only $PM2_APP_NAME --env $ENVIRONMENT
echo "restart"
