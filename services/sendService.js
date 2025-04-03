const axios = require("axios");
const config = require("../config");
const logger = require("../utils/logger");

const headers = {
  "Content-Type": "application/json",
  Authorization:
    config?.externalService?.token && `Bearer ${config.externalService.token}`,
};

async function sendContent(payload) {
  try {
    const response = await axios.post(config.externalService.url, payload, {
      headers,
    });

    logger.info(`Conteudo enviado com sucesso`);
    return response.data;
  } catch (error) {
    logger.error(`Erro ao enviar log: ${error.message}`);
    throw error;
  }
}

module.exports = { sendContent };
