import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { UserService } from 'src/user/application/user.service';

export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;
export interface AuthSocket extends Socket {
  // user: Player;
}

@Injectable()
export class SocketService {
  constructor(private userService: UserService) {}

  socketMiddleware(): SocketMiddleware {
    return async (socket: AuthSocket, next) => {
      try {
        const { user_id, email } = socket.handshake.query;

        const user = await this.userService.getUserByParams(
          +user_id,
          email as string,
        );

        console.log(user);

        if (user) {
          next();
        } else {
          next({
            name: 'Unauthorizaed',
            message: 'Unauthorizaed',
          });
        }
      } catch (error) {
        next({
          name: 'Unauthorizaed',
          message: 'Unauthorizaed',
        });
      }
    };
  }
}
