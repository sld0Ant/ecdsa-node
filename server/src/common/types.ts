export interface BalanceParams {
  address: string;
}

export interface BalanceReply {
  balance: number;
}

export interface SendRequestBody {
  sender: string;
  recipient: string;
  amount: number;
}

export interface SendReplyBody {
  balance: number;
}

// Добавляем тип для стандартного ответа Fastify при ошибке
export interface FastifyErrorReply {
  statusCode: number;
  error: string;
  message: string;
}
