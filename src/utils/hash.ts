import sha256 from "crypto-js/sha256";

export const hash = (text: string) => {
  return sha256(text).toString();
};
