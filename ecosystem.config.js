module.exports = {
  apps: [
    {
      name: "Greatech_ERP.S",
      script: "src/index.ts",
      watch: true,
      ignore_watch: ["Example.xlsx"],
      restart_delay: 3000,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
