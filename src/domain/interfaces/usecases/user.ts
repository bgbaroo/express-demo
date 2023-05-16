import { IUser } from "../../entities/user";

export interface IUsecaseUserRegister {
  execute(user: IUser, password: string): Promise<IUser>;
}

export interface IUsecaseUserLogin {
  execute(user: IUser, password: string): Promise<IUser>;
}

export interface IUsecaseUserLogout {
  execute(user: IUser): Promise<void>;
}

export interface IUsecaseUserChangePassword {
  execute(user: IUser, newPassword: string): Promise<IUser>;
}

export interface IUsecaseUserDeleteUser {
  execute(user: IUser, password: string): Promise<IUser>;
}
