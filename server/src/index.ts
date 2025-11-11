import Fastify from "fastify";
import cors from "@fastify/cors";
import { balanceRoutes } from "@/routes/balance-routes";
import sensible from "@fastify/sensible";
const fastify = Fastify({
  logger: true,
});

fastify.register(cors);
fastify.register(sensible);
fastify.register(balanceRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3042 });
    console.log(`Server listening on http://localhost:3042`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
