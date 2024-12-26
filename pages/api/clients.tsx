import { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ventas_ficticias',
    })

    if (req.method === 'GET') {
        try {
            const [rows] = await connection.execute('SELECT * FROM clientes')
            res.status(200).json(rows)
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los clientes' })
        }
    } else if (req.method === 'POST') {
        const { nombre, ruc_dni, direccion } = req.body
        try {
            const [result] = await connection.execute(
                'INSERT INTO clientes (nombre, ruc_dni, direccion) VALUES (?, ?, ?)',
                [nombre, ruc_dni, direccion]
            )
            res.status(201).json(result)
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el cliente' })
        }
    }

    await connection.end()
}