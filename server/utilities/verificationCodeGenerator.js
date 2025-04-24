import crypto from "crypto";

export default function verificationCodeGenerator() {
  return crypto.randomInt(100000, 999999).toString();
}
