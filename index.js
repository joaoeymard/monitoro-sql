const dbService = require("./services/dbService");
const sendService = require("./services/sendService");
const logger = require("./utils/logger");

async function monitorQueries() {
  try {
    const slowQueries = await dbService.getSlowQueries();
    if (!slowQueries || slowQueries.length === 0) {
      logger.info("Nenhuma query lenta encontrada.");
      return;
    }

    for (const query of slowQueries) await sendService.sendContent(query);
  } catch (error) {
    logger.error(`Erro no monitoramento: ${error.message}`);
  }
}

// Inicia o monitoramento
setInterval(monitorQueries, 1000 * 10); // Executa a cada 60 segundos
