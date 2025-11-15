import { FastifyInstance } from "fastify";
import {
  BalanceParams,
  BalanceReply,
  SendRequestBody,
  SendReplyBody,
  FastifyErrorReply, // Импортируем новый тип ошибки
} from "@/common/types";
import {
  getBalance,
  updateBalances,
  getSenderBalance,
} from "@/services/balance-service";
import { verify } from "ethereum-cryptography/secp256k1";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256";

const balanceSchema = {
  params: {
    type: "object",
    properties: {
      address: { type: "string", description: "Адрес кошелька" },
    },
    required: ["address"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        balance: { type: "number", description: "Баланс кошелька" },
      },
      required: ["balance"],
    },
    404: {
      type: "object",
      properties: {
        statusCode: { type: "number" },
        error: { type: "string" },
        message: { type: "string" },
      },
      required: ["statusCode", "error", "message"],
    },
  },
};

const sendSchema = {
  body: {
    type: "object",
    required: ["sender", "recipient", "amount"],
    properties: {
      sender: { type: "string", description: "Адрес отправителя" },
      recipient: { type: "string", description: "Адрес получателя" },
      amount: {
        type: "number",
        minimum: 0.01,
        description: "Сумма перевода (должна быть положительной)",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        balance: {
          type: "number",
          description: "Оставшийся баланс отправителя",
        },
      },
      required: ["balance"],
    },
    400: {
      type: "object",
      properties: {
        statusCode: { type: "number" },
        error: { type: "string" },
        message: { type: "string" },
      },
      required: ["statusCode", "error", "message"],
    },
    500: {
      type: "object",
      properties: {
        statusCode: { type: "number" },
        error: { type: "string" },
        message: { type: "string" },
      },
      required: ["statusCode", "error", "message"],
    },
  },
};

export async function balanceRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Params: BalanceParams;
    Reply: BalanceReply | FastifyErrorReply;
  }>("/balance/:address", { schema: balanceSchema }, async (request, reply) => {
    const { address } = request.params;

    try {
      const balance = getBalance(address);

      if (balance === undefined) {
        return reply.notFound("Wallet not found");
      }

      reply.send({ balance });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        statusCode: 500,
        error: "Internal Server Error",
        message: "An unexpected error occurred while fetching balance.",
      });
    }
  });

  const verifyTrx = (
    tx: SendRequestBody,
    signature: string,
    txHash: string,
    publicKey: string,
  ) => {
    const txOriginalHash = sha256(utf8ToBytes(JSON.stringify(tx)));
    const txOriginalHashHex = toHex(txOriginalHash);

    const isChecksumValid = txOriginalHashHex === txHash;

    return isChecksumValid && verify(signature, txHash, publicKey);
  };

  fastify.post<{
    Body: SendRequestBody;
    Reply: SendReplyBody | FastifyErrorReply;
  }>("/send", { schema: sendSchema }, async (request, reply) => {
    const { sender, recipient, amount, signature, txHash, publicKey } =
      request.body;

    console.log(publicKey);
    try {
      const success = verifyTrx(
        { sender, amount, recipient },
        signature,
        txHash,
        publicKey,
      )
        ? updateBalances(sender, recipient, amount)
        : false;

      if (!success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Not enough funds!",
        });
      }

      reply.send({ balance: getSenderBalance(sender) });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        statusCode: 500,
        error: "Internal Server Error",
        message: "An unexpected error occurred during transaction.",
      });
    }
  });
}
