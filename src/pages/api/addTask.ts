// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if(req.method === 'POST') {
      const { title, description, status, priority, dueDate, tags } = req.body;

      if (!title || !dueDate) {
        return res.status(400).json({ error: 'Title and due data are required' })
      }

      await pool.query(`INSERT INTO "Task" (title, description, status, priority, "dueDate", tags, "createdAt", "updatedAt") 
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`, 
        [
          title,
          description,
          status,
          priority,
          dueDate,
          tags,
        ]
      )
      return res.status(200).json({ message: 'Task added' })
      
    }
  } catch(err: any) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
