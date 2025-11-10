function Wallet({ balance, privateKey, setPrivateKey, address }) {
  const setValue = (setter) => (evt) => setter(evt.target.value);

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        <input
          placeholder="Type private key"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>
      <label>
        Wallet Address
        <p>{address}</p>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
