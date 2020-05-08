import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { PrismaClient, UserGetPayload } from '@prisma/client';

export interface Context {
    request: ExpressContext['req'];
    response: ExpressContext['res'];
    connection?: ExpressContext['connection'];
    prisma: PrismaClient;
}

export function tokenSigner(userId: string): string {
    return jwt.sign({ userId }, process.env.APP_SECRET, {
        expiresIn: '2 days',
    });
}

export function tokenRetriever(bearerToken: string, ignoreExpiration = false): { userId: string } {
    const token = bearerToken.split('Bearer ').pop();
    const { userId } = jwt.verify(token as string, process.env.APP_SECRET, {
        ignoreExpiration,
    }) as any;

    return {
        userId,
    };
}

export async function checkPasswordMatch(
    user: UserGetPayload<{ select: { password: true } }>,
    password: string
): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
}

export function checkUserTeam(
    user: UserGetPayload<{ include: { teams: { select: { id: true } } } }>
): boolean {
    return !!user.teams.length;
}
