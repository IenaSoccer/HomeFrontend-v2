const path = require('node:path');

const staging = process.env.DEPLOY_ENVIRONMENT === 'staging';
const appName = process.env.PM2_APP_NAME ||
  (staging ? 'iena-homefrontend-staging' : 'iena-homefrontend');
const deployRoot = process.env.DEPLOY_ROOT_PATH || process.cwd();
const port = process.env.SSR_PORT || (staging ? '3001' : '3000');
const instances = Number(process.env.PM2_INSTANCES || 2);

module.exports = {
  apps: [
    {
      name: appName,
      cwd: deployRoot,
      script: path.join(deployRoot, 'current', 'index.js'),
      interpreter: 'node',
      exec_mode: 'cluster',
      instances,
      autorestart: true,
      watch: false,
      time: true,
      kill_timeout: 5000,
      listen_timeout: 10000,
      max_memory_restart: '512M',
      merge_logs: true,
      out_file: path.join(deployRoot, 'logs', 'pm2-out.log'),
      error_file: path.join(deployRoot, 'logs', 'pm2-error.log'),
      env: {
        NODE_ENV: 'production',
        PORT: port,
        SSR_PORT: port,
        DEPLOY_ROOT_PATH: deployRoot,
      },
    },
  ],
};
