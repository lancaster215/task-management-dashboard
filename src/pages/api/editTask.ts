import pool from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try{
        if(req.method === "POST") {
            const { id, name } = req.body;

            await pool.query("UPDATE tasks SET name=($1) WHERE id=($2) ", [name, id]);

            return res.status(200).json({ message: 'Successfully updated task'})    
        }
        const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(`Error in updating task: ${err}`)
    }
}