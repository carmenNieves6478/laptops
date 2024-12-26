import { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ventas_ficticias',
    })

    try {
        const [rows] = await connection.execute('SELECT * FROM productos')
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' })
    } finally {
        await connection.end()
    }
}