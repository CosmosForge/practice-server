import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CheckUserGuard implements CanActivate {
  constructor(private auth:AuthService){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookies = request.cookies; // Получаем доступ к кукам

    try {
      // Ждем завершения асинхронного вызова verifyToken
      const isValid = await this.auth.verifyToken(cookies["refresh-token"])[0];
      return isValid; // Возвращаем результат проверки токена
    } catch (error) {
      console.error('Ошибка при проверке токена:', error);
      return false; // В случае ошибки возвращаем false
    }
  }
}
