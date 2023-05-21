import { IUser } from "../../entities/user";

export interface IUseCaseUserRegister {
  execute(user: IUser, password: string): Promise<IUser>;
}

export interface IUseCaseUserLogin {
  execute(user: IUser, password: string): Promise<IUser>;
}

export interface IUseCaseUserLogout {
  execute(user: IUser): Promise<void>;
}

export interface IUseCaseUserChangePassword {
  execute(user: IUser, newPassword: string): Promise<IUser>;
}

export interface IUseCaseUserDeleteUser {
  execute(user: IUser, password: string): Promise<IUser>;
}

export interface IUseCaseUserGetUser {
  execute(userId: string): Promise<IUser | null>;
}

export interface IUseCaseGetUserByEmail {
  execute(email: string): Promise<IUser | null>;
}
