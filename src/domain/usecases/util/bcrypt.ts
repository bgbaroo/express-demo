import bcrypt from "bcrypt";

export function hashPassword(password: string): string {
  // Default rounds is 10.
  // Each 1 incremental gap will *double*
  // the cost/time required to hash and compare hashes.
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(password, salt);
}

export function compareHash(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}
