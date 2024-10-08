import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FastifyReply } from 'fastify';

@Catch(Prisma.PrismaClientKnownRequestError)
export class EntityNotFoundFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    if (exception.code !== 'P2025') {
      throw exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    response.status(404).send({
      statusCode: 404,
      message: exception.message,
    });
  }
}
