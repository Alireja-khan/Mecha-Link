import { randomBytes, pbkdf2Sync } from "crypto";

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hashed = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { salt, hashed };
}

export function verifyPassword(password, salt, hashedPassword) {
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === hashedPassword;
}
