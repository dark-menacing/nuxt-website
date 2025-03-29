import { z } from "zod";

const loginSchema = z.object({
  email: z.string({message: "Email is required"}).email(),
  password: z.string({message: "Password is required"}).min(6),
  name: z.string({message: "Name is required"}).min(5, "Name must be 5 letters")
});

export default defineEventHandler(async (event) => {
  try {
    const result = await readValidatedBody(event, loginSchema.parse);

    const hashedPassword = await hashPassword(result.password);

    const DBuser = await useDrizzle().select({
      name: tables.users.name,
    }).from(tables.users);

    for (let i = 0; i < DBuser.length; i++) {
      for (const user = DBuser[i];;) {
        if (user.name === result.name) {
          return {
            status: 400,
            message: 'This user already exists!'
          };
        };
        break;
      };
    };

    if (await verifyPassword(hashedPassword, result.password)) {
      await useDrizzle().insert(tables.users).values({
        createdAt: new Date(),
        name: result.name,
        password: hashedPassword,
        email: result.email,
      })  

      await setUserSession(event, {
        user: {
          name: result.name,
        },
        loggedIn: new Date(),
      });

      return {
        status: 200,
        message: 'Welcome'
      }
    } else {
      return {
        status: 400,
        message: 'Wrong password'
      }
    }
  } catch (error) {
   throw createError({
    statusCode: 400,
    statusMessage: "Something went wrong"
   }) 
  }
})
