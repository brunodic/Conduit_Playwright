import mysql from 'mysql2/promise';

export async function deleteUser(email: string) {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'conduit',
    password: '3523',
    database: 'database_development',
  });





  await conn.execute('DELETE FROM users WHERE email = ?',[email]);

  await conn.end();
}