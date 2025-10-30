import pool from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try{
        if(req.method === "POST") {
            const { id, title, description, dueDate, status, priority, tags} = req.body;

            await pool.query(`UPDATE "Task" SET title=($2) description=($3) dueDate=($4) status=($5) priority=($6) tags=($7) WHERE id=($1)`, [id, title, description, dueDate, status, priority, tags]);

            return res.status(200).json({ message: 'Successfully updated task'})    
        }
    } catch (err) {
        console.error(`Error in updating task: ${err}`)
    }
}