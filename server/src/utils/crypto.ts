import { keccak256 } from "ethereum-cryptography/keccak";
import { sign } from "ethereum-cryptography/secp256k1";
import { bytesToHex, utf8ToBytes } from "ethereum-cryptography/utils";

export const getAddressFromPublicKey = (publicKey: Uint8Array) =>
  `0x${keccak256(publicKey.slice(1).slice(-20))}`;

export const hashMessage = (message: string) => keccak256(utf8ToBytes(message));

export const signMessage = (message: string, pk: Uint8Array) =>
  sign(hashMessage(message), pk);

export const checkMessageHash = (message: string, hash: string) =>
  bytesToHex(hashMessage(message)) === hash;
