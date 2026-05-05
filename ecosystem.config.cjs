module.exports = {
  apps: [
    {
      name: "feed-inventory",
      cwd: "./backend",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
