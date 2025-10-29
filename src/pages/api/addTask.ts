// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if(req.method === 'POST') {
      const { name, time } = req.body;

      if (!name || !time) {
        return res.status(400).json({ error: 'Name and time are required' })
      }

      await pool.query('INSERT INTO "Task" (name, time) VALUES ($1, $2)', [
        name,
        time
      ])
      return res.status(200).json({ message: 'Task added' })
      
    }
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.status(200).json(result.rows)
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: `Failed to connect to database`})
  }
}
