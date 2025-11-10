const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

module.exports = {
  verify: secp.verify,
  generateKeys: () => {
    const privateKey = secp.utils.randomPrivateKey();
    console.log("private key: ", toHex(privateKey));

    const publicKey = secp.getPublicKey(privateKey);

    console.log("public key", toHex(publicKey));
    const hashedPKLength = publicKey.length;
    const id =
      "0x" + publicKey.slice(hashedPKLength - 20, hashedPKLength).toHex();
    console.log("id: ", id);
    return {
      id,
      publicKey,
      privateKey,
    };
  },
};
