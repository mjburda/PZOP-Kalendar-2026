/**
 * SQL helper module.
 *
 * Provides a utility function for executing SQL queries
 * via a backend gateway. Used by loaders to fetch data
 * from the database.
 *
 * @param {string} sqlQuery SQL query string to be executed.
 * @returns {Promise<Array>} Array of result rows returned from the database.
 */


const database = "3it_burdam23";
const username = "burdam23";
const password = "8JWXcAxtGj";
const server = "localhost";

export async function sql(sqlQuery) {
  const url = "http://marcincin.epsilon.spstrutnov.cz/gate.php";

  const postJson = JSON.stringify({
    database,
    username,
    password,
    server,
    sql: sqlQuery,
  });

  const response = await fetch(url, {
    method: "POST",
    body: postJson,
  });

  if (!response.ok) {
    throw new Error("SQL gateway error");
  }

  return await response.json();
}
