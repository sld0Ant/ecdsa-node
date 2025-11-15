import { utils, getPublicKey } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { bytesToHex } from "ethereum-cryptography/utils";

const tableLog = (strArray: string[], labels: string[]) => {
  console.table(strArray.map((key, i) => labels[i] + key));
};
const getAddressFromPublicKey = (publicKey: Uint8Array) => {
  return keccak256(publicKey.slice(1).slice(-20));
};

const generatePKPair = () => {
  const privateKey = utils.randomPrivateKey();
  const publicKey = getPublicKey(privateKey);
  const address = getAddressFromPublicKey(publicKey);
  const labels = ["private key: ", "public key: ", "address: "];
  tableLog([privateKey, publicKey, address].map(bytesToHex), labels);
};

generatePKPair();
