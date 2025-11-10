import { useState } from "react";
import server from "./server";
import { sign, verify, getPublicKey } from "ethereum-cryptography/secp256k1";
import { sha256 } from "ethereum-cryptography/sha256.js";
import {
  bytesToHex as toHex,
  hexToBytes as toBytes,
} from "ethereum-cryptography/utils.js";
import { utf8ToBytes } from "ethereum-cryptography/utils.js";
function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const singTransaction = async (transaction, privateKey) => {
    const txHash = sha256(utf8ToBytes(JSON.stringify(transaction)));
    const txHashHex = toHex(txHash);
    const txHashBytes = toBytes(txHashHex);

    const signature = await sign(txHashBytes, toBytes(privateKey));
    console.log(
      verify(signature, txHashBytes, getPublicKey(privateKey)),
      signature,
      txHashBytes,
      getPublicKey(privateKey)
    );
    return { signature: toHex(signature), txHash: toHex(txHash) };
  };

  const buildTransaction = async (data, privateKey) => {
    const sign = await singTransaction(data, privateKey);
    return { ...data, ...sign };
  };
  async function transfer(evt) {
    evt.preventDefault();
    console.log(
      await buildTransaction(
        {
          sender: address,
          amount: parseInt(sendAmount),
          recipient,
        },
        privateKey
      )
    );
    try {
      const transaction = await buildTransaction(
        {
          sender: address,
          amount: parseInt(sendAmount),
          recipient,
        },
        privateKey
      );
      console.log(transaction);
      const {
        data: { balance },
      } = await server.post(`send`, transaction);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Private key
        <input
          placeholder="Type private key"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
