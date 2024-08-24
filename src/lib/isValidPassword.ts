export function isValidPassword(password: string, hashedPassword: string) {
  return password === hashedPassword
}
