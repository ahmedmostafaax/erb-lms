export default {
  apps: [
    {
      name: "lms-backend",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
    },
  ],
};