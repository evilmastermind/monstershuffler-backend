var bcrypt = require("node-php-password");
// const saltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password);
}

export async function comparePassword(
  plainTextPassword: string,
  hash: string
): Promise<boolean> {
  return bcrypt.verify(plainTextPassword, hash);
}

export async function generateToken(length: number) {
  var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.apply(null, Array(length))
    .map(function () {
      return s.charAt(Math.floor(Math.random() * s.length));
    })
    .join("");
}
