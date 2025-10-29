import pool from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    try {
        if(req.method === 'POST') {
            const { id } = req.body;

            await pool.query("DELETE FROM tasks WHERE id=($1)", [id])

            return res.status(200).json({ message: 'Successfully removed task'})    
        }
        const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(`Error in deleteing task: ${err}`)
    }
}