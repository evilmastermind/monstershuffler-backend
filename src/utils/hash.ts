const bcrypt = require('bcrypt');
const saltRounds = 10;


export async function hashPassword(password: string):Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(plainTextPassword: string, hash: string):Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hash);
}
