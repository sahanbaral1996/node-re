module.exports = {
  apps: [
    {
      name: 'dev-api-revea',
      script: './build/app.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
        NODE_PATH: 'build/',
      },
    },
    {
      name: 'api-revea',
      script: './build/app.js',
      watch: true,
      env_production: {
        NODE_ENV: 'production',
        NODE_PATH: 'build/',
      },
    },
    {
      name: 'stage-api-revea',
      script: './build/app.js',
      watch: true,
      env_production: {
        NODE_ENV: 'production',
        NODE_PATH: 'build/',
      },
    },
  ],
};
