export default function verificationCodeExpirationTime() {
  return Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds
}
