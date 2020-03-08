import * as jwt from 'jsonwebtoken';

import { ContextParameters } from 'graphql-yoga/dist/types';

export function authorization() {
    return function(
        request: ContextParameters['request'],
        response: ContextParameters['response'],
        next: Function
    ) {
        const bearer = request.get('Bearer');

        if (!bearer) {
            return next();
        }

        try {
            const { userId } = jwt.verify(bearer as string, process.env.APP_SECRET) as any;
            request.headers.userId = userId;
        } catch (error) {
            response.removeHeader('Bearer');
            response.removeHeader('userId');
        }

        return next();
    };
}