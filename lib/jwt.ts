import jwt from "jsonwebtoken";

export const generateResetToken = (email: string) => {
  return jwt.sign(
    { email },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );
};

export const verifyResetToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as {
    email: string;
  };
};