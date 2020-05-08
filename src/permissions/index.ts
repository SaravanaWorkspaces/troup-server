import { shield, allow, chain } from 'graphql-shield';

import { isAuthenticated } from './is-authenticated';
import { isOwnResource } from './is-own-resource';

export const permissions = shield(
    {
        Query: {
            teamIdFromName: allow,
            '*': chain(isAuthenticated, isOwnResource),
        },
        Mutation: {
            signupUser: allow,
            signupTeam: allow,
            signinUser: allow,
            signinTeam: allow,
            refreshAuthToken: allow,
            '*': chain(isAuthenticated, isOwnResource),
        },
    },
    {
        allowExternalErrors: true,
        debug: process.env.NODE_ENV === 'development',
    }
);
