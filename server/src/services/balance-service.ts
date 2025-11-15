const balances: { [address: string]: number } = {
  "0x60e57740feb3c91861000fa5ea1eeddbb459e3de50d1eaefff5428fae8178b8d": 51,
  "0x97d1074458947268f0f36c5c43644b85028617133f2ea3cbe4ce2a85ae7df45d": 52,
  "0xa1aaa704c37e0368821cd6eb6214416d993907ed33c6d5f19cacc2cd237b4e2f": 53,
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
