import { connect } from "@/app/dbConfig/dbConfig";
import User from "@/app/models/User";
import bcryptjs from 'bcryptjs';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/app/libs/mongoConnect";

// type Creds = {email: string, password: string} ;

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: "credentials",
      id: 'credentials',
      // credentials: {
      //   username: { label: "Email", type: "email", placeholder: "test@example.com" },
      //   password: { label: "Password", type: "password" },
      // },
      async authorize(credentials, req) {
        const {email, password} = credentials;
        connect();

        try {
          const user = await User.findOne({email});

          if(user){
            const isMatch = await bcryptjs.compare(password, user.password);
            if(isMatch) {
              return user;
            }
          }
        return null;
        } catch(err){
          console.log("Error: ", err);
        }
        
      },
    }),
  ],
  session: {
    strategy: 'jwt'
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
