import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'
import {z} from 'zod'
import { authenticate } from '../plugins/authenticate'



export async function authRoutes (fastify: FastifyInstance){
    fastify.get('/me',{
        onRequest:[authenticate]
    }, async(request)=>{
        return  { user: request.user}
    })
    fastify.post('/users', async (request) =>{
        const createUserBody = z.object({
            access_token: z.string(),
        })

        const {access_token} = createUserBody.parse(request.body)

        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo',{
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })
        //ya29.a0Aa4xrXMufTcP8suG-wB8M2J7lFsoDwOuJQOiXUduVlVSvufO6Dk-c0XahzaPF1AjWGM4-LFimsX83kSwZCCt1Y-HzRrWRjdRg2HNNck2kJl507qOJ0Le8HY0qLd1aDZtqhpTLAPCia-_MEM96-5h6hbdn5GjmAaCgYKARwSARASFQEjDvL9W7nD1PgHmW8A2bCoX-Fvyg0165

        const userData = await userResponse.json()

        const userInfoSchema = z.object({
            id: z.string(),
            name: z.string(),
            email: z.string().email(),
            picture: z.string().url(),
        })
        const userInfo = userInfoSchema.parse(userData)

        let user = await prisma.user.findUnique({
            where:{
                googleId: userInfo.id,
            }
        })

        if (!user) {
            user = await prisma.user.create({
                data:{
                    googleId: userInfo.id,
                    name:userInfo.name,
                    email: userInfo.email,
                    avatarUrl: userInfo.picture,
                }
            })
        }

        const token = fastify.jwt.sign({
            name:user.name,
            avatarUrl: user.avatarUrl,
        },{
            sub: user.id,
            expiresIn: '2 days'
        })
        return {token}
    })
}