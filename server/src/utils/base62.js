const ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function encodeBase62(value) {
  let number = BigInt(value);

  if (number < 0n) {
    throw new Error("Base62 value cannot be negative");
  }

  if (number === 0n) {
    return "0";
  }

  let result = "";

  while (number > 0n) {
    result = ALPHABET[Number(number % 62n)] + result;
    number /= 62n;
  }

  return result;
}

export function encodeBase62WithLength(value, minLength = 5, maxLength = 7) {
  const code = encodeBase62(value);

  if (code.length < minLength) {
    return code.padStart(minLength, "0");
  }

  if (code.length > maxLength) {
    throw new Error("7-character Base62 capacity exceeded");
  }

  return code;
}
