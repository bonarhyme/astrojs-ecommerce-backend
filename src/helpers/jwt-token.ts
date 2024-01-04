import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export const generateToken = (id: any) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '365d',
  });
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log({ decoded });

  return decoded;
};
