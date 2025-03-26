import client from "@/db/config";
import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
    const { username, email, firstName, lastName, genre, password, userType, userPermissions } = req.body;

    if(!username || !email || !password || !userType || !userPermissions) {
        res.status(400).send({
            status: 400,
            message: 'Missing required fields!'
        });
    }

    try {
        const query = `SELECT create_user($1, $2, $3, $4, $5, $6, $7, $8)`;
        const values = [
            username,
            email,
            firstName || null,
            lastName || null,
            genre || null,
            password,
            userType,
            userPermissions
        ];

        const result = await client.query(query, values);
        const data = result.rows[0];

        res.status(201).send({
            status: 201,
            message: 'User Created Sucessfully!',
            data
        })
        
    } catch (err) {
        console.log(err);
        
        res.status(500).send({
            status: 500,
            message: 'Error creating user...'
        });
    }
}

export const getUsers = async (req: Request, res: Response) => {
    const { career, location } = req.query;

    const query = career || location ? `SELECT * FROM users WHERE u_location = ${location} OR u_career = ${career};` : 'SELECT * FROM users';
    const result = await client.query(query);
    const data = result.rows;

    if(!data)
        res.status(404).send({ 
            status: 404, 
            message: 'Users not found... :(',
        });

    res.status(200).send({ 
        status: 200, 
        message: 'Users Found!',
        data
    });
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const query = `SELECT * FROM users WHERE u_id = $1;`
    const result = await client.query(query, [id]);
    const data = result.rows[0];

    if(!data)
        res.status(404).send({ 
            status: 404, 
            message: 'User not found... :(',
        });

    res.status(200).send({ 
        status: 200, 
        message: 'User Found!',
        data
    });
}