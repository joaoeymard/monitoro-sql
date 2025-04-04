const dbService = require("./services/dbService");
const sendService = require("./services/sendService");
const logger = require("./utils/logger");

async function monitorQueries() {
  try {
    // Verifica querys lentas
    const slowQueries = await dbService.getSlowQueries();
    if (slowQueries || slowQueries.length > 0) {
      for (const query of slowQueries) await sendService.sendContent(query);

      logger.info(`Total de querys lentas enviadas: ${slowQueries.length}`);
    }

    // Verifica se há transações abertas
    const openTransactions = await dbService.getOpenTransactions();
    if (openTransactions || openTransactions.length > 0) {
      for (const transaction of openTransactions)
        await sendService.sendContent(transaction);

      logger.info(
        `Total de transações abertas enviadas: ${openTransactions.length}`
      );
    }
  } catch (error) {
    logger.error(`Erro no monitoramento: ${error.message}`);
  }
}

// Inicia o monitoramento
setInterval(monitorQueries, 1000 * 60); // Executa a cada 60 segundos
