const balances: { [address: string]: number } = {
  "0x2040b56f087664fd806407586e7b59c14b6a932817dbb5ef6b876147329d6481": 51,
  "0x564c1491845d12e823faed000567ea44d6e3fc1d945dbdcd2bb6f73eb3983858": 52,
  "0x22c21375290f638f31b11cdb0ffcbb545ca3857a8eaa3e58af706dcc8914a541": 53,
};

function setInitialBalance(address: string): void {
  if (balances[address] === undefined) {
    balances[address] = 0;
  }
}

export function getBalance(address: string): number | undefined {
  setInitialBalance(address); // Убедимся, что адрес инициализирован перед получением
  return balances[address];
}

export function updateBalances(
  sender: string,
  recipient: string,
  amount: number,
): boolean {
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    return false;
  }

  balances[sender] -= amount;
  balances[recipient] += amount;
  return true;
}

export function getSenderBalance(sender: string): number {
  return balances[sender];
}
