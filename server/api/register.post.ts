import {z} from 'zod';
import { users } from '../database/schema';

export default defineEventHandler(async (event) => {
  const {email, password, name} = await readBody(event) as {email: string; password: string; name: string;};

  //does he exist?
  const user = await getUserSession(event);
  if (user) {
    throw createError({
      statusCode: 400,
      statusMessage: `User already exists!`
    })
  }

  // validate user
  const registerUserSchema = z.object({
    email: z.string({message: "Email is required"}).email(),
    password: z.string({ message: "Password is required"})
               .min(6, "Password must be at least 6 characters"),
    name: z.string({message: "Name is required"})
           .min(2, "Name cannot be less than 2 characters."),
   })
   const result = await registerUserSchema.safeParseAsync((await readBody(event)));
   if( result.error ){ // 3
    throw createError({
     statusCode: 400,
     statusMessage: result.error.message
    })
   }
  const hashed = await hashPassword(password);

  if (await verifyPassword(hashed, password)) {
    // actually insert the user in the database and cookie
    const userlog = await useDrizzle().insert(users).values({
      createdAt: new Date(),
      email: email,
      name: name,
      password: hashed
    }).returning().get();
    await setUserSession(event, {
      user: {
        name: name,
      }
    });
    console.log(userlog);
  }
})
