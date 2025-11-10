const express = require("express");
const app = express();
const cors = require("cors");
const { generateKeys, verify } = require("./generate-keys.ts");
const { utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");

const port = 3042;

app.use(cors());
app.use(express.json());

const users = Array(2)
  .fill(0)
  .map(() => ({
    ...generateKeys(),
    balance: Math.floor(Math.random() * 100),
  }));

const getUser = (address) => users.find((user) => user.id === address);

const isUserExist = (address) => getUser(address);

const hasEnoughBalance = (address, amount) =>
  getUser(address)?.balance > amount;

const withdraw = (from, to, sum) => {
  getUser(from).balance -= sum;
  getUser(to).balance += sum;
};

app.get("/users", (req, res) => {
  res.send(users.map(({ id, balance }) => ({ id, balance })));
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;

  res.send({ balance: getUser(address)?.balance || "Wallet not found" });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, txHash, signature } = req.body;

  console.log(
    verify(
      hexToBytes(signature),
      hexToBytes(txHash),
      getUser(sender).publicKey
    ),
    hexToBytes(signature),
    hexToBytes(txHash),
    getUser(sender).publicKey
  );
  if (
    !verify(
      hexToBytes(signature),
      hexToBytes(txHash),
      getUser(sender).publicKey
    )
  ) {
    return res.status(400).send({ message: "Malicious signature" });
  }
  if (!isUserExist(recipient)) {
    return res.status(400).send({ message: "Invalid wallet" });
  }
  if (!hasEnoughBalance(sender, amount)) {
    return res.status(400).send({ message: "Not enough funds!" });
  }

  withdraw(sender, recipient, amount);
  res.send({ balance: getUser(sender).balance });

  console.log(getUser(sender).balance, getUser(recipient).balance);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
