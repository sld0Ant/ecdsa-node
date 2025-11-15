import server from "./server";

function Wallet({ privateKey, address, setPrivateKey, balance, setBalance }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type an private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <label className={"address"}>{address}</label>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
