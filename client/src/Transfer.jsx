import { useState } from "react";
import {
  bytesToHex as toHex,
  hexToBytes as toBytes,
} from "ethereum-cryptography/utils";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { sign, getPublicKey } from "ethereum-cryptography/secp256k1";
import { sha256 } from "ethereum-cryptography/sha256";

import server from "./server.js";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
  const singTransaction = async (transaction, privateKey) => {
    const txHash = sha256(utf8ToBytes(JSON.stringify(transaction)));
    const txHashHex = toHex(txHash);
    const txHashBytes = toBytes(txHashHex);

    const signature = await sign(txHashBytes, toBytes(privateKey));
    console.log(txHashHex);
    return { signature: toHex(signature), txHash: toHex(txHashBytes) };
  };

  const buildTransaction = async (data, privateKey) => {
    const sign = await singTransaction(data, privateKey);

    return { ...data, ...sign, publicKey: toHex(getPublicKey(privateKey)) };
  };
  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(
        `send`,
        await buildTransaction(
          {
            sender: address,
            amount: parseInt(sendAmount),
            recipient,
          },
          privateKey,
        ),
      );
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

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
