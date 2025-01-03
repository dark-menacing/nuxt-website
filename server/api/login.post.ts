import { users } from "../database/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  //does the user exist?
  const user = await useDrizzle().select().from(users).where(eq(users.email, String(body.email)))

  if (!user) {
    return {
      status: 400,
      message: "Invalid credentials."
    }
  }

  //validate pass
  const hashed = await hashPassword(body.password);
  if (!await verifyPassword(hashed, body.password)) {
    return {
      status: 400,
      message: "Invalid credentials "
    }
  }

  await setUserSession(event, {
    users: {
      name: body.Name
    }
  })

  return {
    status: 200,
    message: "User logged in successfully"
  }
})
