import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../../../db';
import { verifyPassword } from '../../../utils/auth';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'passowrd' },
      },
      async authorize(credentials, req) {
        if (!credentials?.username) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            name: credentials?.username,
          },
        });

        if (!user) {
          throw new Error('No user found!');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return { name: user.name };
      },
    }),
  ],
});
