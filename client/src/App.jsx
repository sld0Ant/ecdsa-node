import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useEffect, useMemo, useState } from "react";
import { getAddressFromPublicKey } from "./crypto";
import { getPublicKey } from "ethereum-cryptography/secp256k1";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import server from "./server.js";

function App() {
  const [balance, setBalance] = useState(0);
  const [privateKey, setPrivateKey] = useState("");
  const address = useMemo(() => {
    return !!privateKey
      ? getAddressFromPublicKey(getPublicKey(privateKey))
      : "";
  }, [privateKey]);
  useEffect(() => {
    const setupBalance = async (address) => {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    };
    setupBalance(address);
  }, [address]);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        privateKey={privateKey}
        address={address}
        setPrivateKey={setPrivateKey}
      />
      <Transfer
        address={address}
        privateKey={privateKey}
        setBalance={setBalance}
      />
    </div>
  );
}

export default App;
