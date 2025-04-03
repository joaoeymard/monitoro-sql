const sql = require("mssql");
const config = require("../config");
const logger = require("../utils/logger");

const querySlowQueries = `
  SELECT 
      DB_NAME(r.database_id) AS nome_banco_dados,
      s.host_name,
      r.session_id,
      r.start_time,
      DATEDIFF(MINUTE, r.start_time, GETDATE()) AS minutos_em_execucao,
      r.status,
      t.text AS query_text
  FROM sys.dm_exec_requests r
  JOIN sys.dm_exec_sessions s ON r.session_id = s.session_id
  CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t
  WHERE r.status = 'running'
    AND DATEDIFF(MINUTE, r.start_time, GETDATE()) > @threshold;
`;

async function getSlowQueries() {
  let pool;

  try {
    const threshold = parseInt(config.monitor.queryThreshold, 10);
    pool = await sql.connect(config.db);

    const result = await pool
      .request()
      .input("threshold", sql.Int, threshold)
      .query(querySlowQueries);

    return result.recordset;
  } catch (error) {
    logger.error(`Erro ao buscar queries lentas: ${error.message}`);
    return [];
  } finally {
    await pool.close();
  }
}

module.exports = { getSlowQueries };
