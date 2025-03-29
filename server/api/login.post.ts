import { z } from 'zod';

const loginSchema = z.object({
  password: z.string({message: "Password is required"}).min(6),
  name: z.string({message: "Name is required"}).min(5, "Name must be 5 letters")
});

export default defineEventHandler(async (event) => {
  try {
    // i swear to god this code is o(n^2) to the sky
    const result = await readValidatedBody(event, loginSchema.parse);
    
    const userDB = await useDrizzle().select({
      name: tables.users.name,
      password: tables.users.password,
    }).from(tables.users);

    // i didn't want to but i think it has to be this way
    function findUser(name: string) {
      for (let i = 0; i < userDB.length; i++) {
        for (const user = userDB[i];;) {
          if (user.name === name) {
            return user;
          };
          break;
        }
      }
    };

    const user = findUser(result.name);

    if (!user) {
      return {
        status: 400,
        message: "This user doens't exist!"
      }
    }

    if (await verifyPassword(user.name, result.password)) {
      await setUserSession(event, {
        user: {
          name: result.name
        }
      });
      return {
        status: 200,
        message: 'Welcome'
      }
    } else {
      return {
        status: 400,
        message: 'Invalid password'
      }
    }
 } catch (error) {
   throw createError({
    statusCode: 400,
    statusMessage: "Something went wrong"
   }) 
  }
})