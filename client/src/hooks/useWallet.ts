import { useEffect, useMemo, useReducer } from "react";
import server from "../utils/server";
import { getPublicKey } from "ethereum-cryptography/secp256k1";

interface User {
  id: string;
  [key: string]: any;
}

interface State {
  balance: number;
  privateKey: string;
  users: User[];
  isFetching: boolean;
}

const initialState: State = {
  balance: 0,
  privateKey: "",
  users: [],
  isFetching: false,
};

type Action =
  | { type: "SET_BALANCE"; payload: number }
  | { type: "SET_PRIVATE_KEY"; payload: string }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "SET_IS_FETCHING"; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_BALANCE":
      return { ...state, balance: action.payload };
    case "SET_PRIVATE_KEY":
      return { ...state, privateKey: action.payload };
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_IS_FETCHING":
      return { ...state, isFetching: action.payload };
    default:
      return state;
  }
}

interface UseWalletReturn {
  handleSubmit: () => Promise<void> | void;
  users: User[];
  setUsers: (u: User[]) => void;
  address?: string;
  balance: number;
  setBalance: (b: number) => void;
  privateKey: string;
  setPrivateKey: (pk: string) => void;
  isFetching: boolean;
}

function useWallet(): UseWalletReturn {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { balance, privateKey, users, isFetching } = state;

  const address = useMemo<string | undefined>(() => {
    if (privateKey) {
      const publicKey = getPublicKey(privateKey);
      const hashedPKLength = publicKey.length;
      return (
        "0x" + publicKey.slice(hashedPKLength - 20, hashedPKLength).toHex()
      );
    }
    return undefined;
  }, [privateKey]);

  const fetchUsers = async (): Promise<void> => {
    try {
      const { data } = await server.get<User[]>("/users");
      dispatch({ type: "SET_USERS", payload: data });
    } finally {
      dispatch({ type: "SET_IS_FETCHING", payload: false });
    }
  };

  useEffect(() => {
    if (isFetching) fetchUsers();
  }, [isFetching]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const updateBalance = async () => {
      if (address) {
        try {
          const {
            data: { balance: newBalance },
          } = await server.get<{ balance: number }>(`balance/${address}`);
          dispatch({ type: "SET_BALANCE", payload: newBalance });
        } catch {
          dispatch({ type: "SET_BALANCE", payload: 0 });
        }
      } else {
        dispatch({ type: "SET_BALANCE", payload: 0 });
      }
    };
    updateBalance();
  }, [address]);

  const handleSubmit = async (): Promise<void> => {
    dispatch({ type: "SET_IS_FETCHING", payload: true });
  };

  return {
    handleSubmit,
    users,
    setUsers: (u: User[]) => dispatch({ type: "SET_USERS", payload: u }),
    address,
    balance,
    setBalance: (b: number) => dispatch({ type: "SET_BALANCE", payload: b }),
    privateKey,
    setPrivateKey: (pk: string) =>
      dispatch({ type: "SET_PRIVATE_KEY", payload: pk }),
    isFetching,
  };
}

export default useWallet;
