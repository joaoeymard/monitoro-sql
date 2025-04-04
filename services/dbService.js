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

const queryOpenTransactions = `
  SELECT
      S.session_id AS 'SSID',
      S.login_name AS 'LoginDB',
      S.host_name AS 'HostName',
      S.program_name AS 'ExecutandoEm',
      T.transaction_id AS 'IDTransac',
      AT.transaction_status AS 'StatusTransc',
      AT.name AS 'NomeTransação',
      AT.transaction_begin_time AS 'AbertaEm',
      T.open_transaction_count AS 'QntTransacAbertas',
      S.lock_timeout AS 'LockTimeout',
      S.cpu_time AS 'TempoCPUMilliSec',
      S.deadlock_priority AS 'DeadLockPriority'
  FROM sys.dm_tran_session_transactions T
  INNER JOIN sys.dm_exec_sessions S ON T.session_id = S.session_id
  LEFT JOIN sys.dm_tran_active_transactions AT ON T.transaction_id = AT.transaction_id
  WHERE DATEDIFF(MINUTE, AT.transaction_begin_time, GETDATE()) > @threshold;
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

async function getOpenTransactions() {
  let pool;

  try {
    const threshold = parseInt(config.monitor.queryThreshold, 10);
    pool = await sql.connect(config.db);

    const result = await pool
      .request()
      .input("threshold", sql.Int, threshold)
      .query(queryOpenTransactions);

    return result.recordset;
  } catch (error) {
    logger.error(`Erro ao buscar transações abertas: ${error.message}`);
    return [];
  } finally {
    await pool.close();
  }
}

module.exports = { getSlowQueries, getOpenTransactions };
