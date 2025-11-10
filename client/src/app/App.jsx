import { Wallet, Transfer, Stats } from "../components";
import "../styles/App.scss";
import { useWallet } from "../hooks";

function App() {
  const wallet = useWallet();

  return (
    <div className="app">
      <Wallet
        balance={wallet.balance}
        address={wallet.address}
        privateKey={wallet.privateKey}
        setPrivateKey={wallet.setPrivateKey}
      />
      <Transfer
        privateKey={wallet.privateKey}
        handleSubmit={wallet.handleSubmit}
        setBalance={wallet.setBalance}
        address={wallet.address}
      />
      {wallet.users?.length ? <Stats users={wallet.users} /> : ""}
    </div>
  );
}

export default App;
