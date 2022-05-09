module.exports = {
  apps: [
    {
      name: "Greatech_ERP.S",
      script: "src/index.ts",
      watch: true,
      ignore_watch: ["Mech.xlsx", "Vision.xlsx", "Electrical.xlsx", "Software.xlsx", "DomainStandardPart.xlsx", "ElectricalDomain_Generated.xlsx", "./logs"],
      restart_delay: 3000,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
