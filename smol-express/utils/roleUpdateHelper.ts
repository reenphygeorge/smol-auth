import { Request, Response } from "express";
import { getUser, updateUser } from "../../smol-core/db";
import { __rbacRules } from "../../smol-core/rbac";

export const roleUpdateHelper = async (req: Request, res: Response) => {
    // Check if given role is already configured
    const { role } = req.body
    if (!__rbacRules.hasOwnProperty(role))
        return res.status(403).json({
            success: false,
            message: 'Illegal Role'
        })

    // Get authId from headers and handle errors
    const authHeader = req.headers['authorization']
    const authId = authHeader && authHeader.split(' ')[1]
    if (!authId) return res.status(403).json({
        success: false,
        message: 'Auth Token Missing'
    })
    const data = await getUser(authId)
    if (!data) {
        return res.status(403).json({
            success: false,
            message: 'Auth Token Error'
        })
    }

    // Update user with new role
    data.role = role
    await updateUser(authId, data)
    return res.json({ success: true, message: `Role updated to ${data.role}` })

}