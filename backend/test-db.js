const db = require("./models");

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Conexão com o banco OK");
    process.exit(0);
  } catch (error) {
    console.error("❌ Falha na conexão com o banco:", error);
    process.exit(1);
  }
})();
