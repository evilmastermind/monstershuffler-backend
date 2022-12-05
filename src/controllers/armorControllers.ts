import { RouteHandlerMethod } from "fastify";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/helpers/prisma";

// export const getArmor: RouteHandlerMethod = async (req, res) => {
//   res.status(200).send({ monster: "shuffler" });
// };

export type getArmorRequest = {
  userid?: number;
  name: string;
};

export async function getArmorHandler(
  request: FastifyRequest<{
    Body: getArmorRequest
  }>,
  reply: FastifyReply
) {
  const { userid = 0, name } = request.body;
  try {
    const armor = await prisma.armor.findUnique({
      where: {
        userid_name: {
          userid,
          name
        }
      }
    });
    return reply.code(200).send({ data: armor?.object });
  } catch (error) {
    console.log(error);
    return reply.code(500).send(error);
  }
}