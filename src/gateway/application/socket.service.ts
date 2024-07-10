import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { KromLogger } from 'src/helpers/logger/logger.service';
import { UserService } from 'src/user/application/user.service';

export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;

@Injectable()
export class SocketService {
  constructor(
    private userService: UserService,
    private kromLogger: KromLogger,
  ) {}

  socketMiddleware(): SocketMiddleware {
    return async (socket, next) => {
      try {
        const { user_id, email } = socket.handshake.query;

        // const user = await this.userService.getUserByParams(
        //   +user_id,
        //   email as string,
        // );

        // if (user) {
        next();
        // } else {
        //   this.kromLogger.socket(
        //     'error',
        //     `User Unauthorizaed - user_id: ${user_id}, email: ${email}`,
        //   );
        //   next({
        //     name: 'Unauthorizaed',
        //     message: 'Unauthorizaed',
        //   });
        // }
      } catch (error) {
        this.kromLogger.socket('error', `error userService getUserByParams`);
        next({
          name: 'Unauthorizaed',
          message: 'Unauthorizaed',
        });
      }
    };
  }
}
