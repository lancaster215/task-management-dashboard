import { Pool } from "pg";

declare global {
  // allow attaching pgPool to globalThis in Node and browsers during dev
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

let pool: Pool;

if (!globalThis.pgPool) {
  globalThis.pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

pool = globalThis.pgPool!;

export default pool;
