import { IClipboard } from "../entities/clipboard";
import { IRepositoryClipboard } from "../interfaces/repositories/clipboard";
import {
  IUseCaseCreateClipboard,
  IUseCaseDeleteUserClipboard,
  IUseCaseDeleteUserClipboards,
  IUseCaseGetUserClipboard,
  IUseCaseGetUserClipboards,
} from "../interfaces/usecases/clipboard";

// Current use cases here only needs repo for clipboards
class baseUseCaseClipboard {
  protected repository: IRepositoryClipboard;

  constructor(repo: IRepositoryClipboard) {
    this.repository = repo;
  }
}

export class UseCaseCreateClipboard
  extends baseUseCaseClipboard
  implements IUseCaseCreateClipboard
{
  constructor(repo: IRepositoryClipboard) {
    super(repo);
  }

  async execute(clipboard: IClipboard): Promise<IClipboard> {
    return this.repository.createClipboard(clipboard);
  }
}

export class UseCaseGetUserClipboard
  extends baseUseCaseClipboard
  implements IUseCaseGetUserClipboard
{
  constructor(repo: IRepositoryClipboard) {
    super(repo);
  }

  async execute(userId: string, id: string): Promise<IClipboard | null> {
    return this.repository.getUserClipboard(userId, id);
  }
}

export class UseCaseGetUserClipboards
  extends baseUseCaseClipboard
  implements IUseCaseGetUserClipboards
{
  constructor(repo: IRepositoryClipboard) {
    super(repo);
  }

  async execute(userId: string): Promise<IClipboard[] | null> {
    return this.repository.getUserClipboards(userId);
  }
}

export class UseCaseDeleteUserClipboard
  extends baseUseCaseClipboard
  implements IUseCaseDeleteUserClipboard
{
  constructor(repo: IRepositoryClipboard) {
    super(repo);
  }

  async execute(userId: string, id: string): Promise<IClipboard> {
    return this.repository.deleteUserClipboard(userId, id);
  }
}

export class UseCaseDeleteUserClipboards
  extends baseUseCaseClipboard
  implements IUseCaseDeleteUserClipboards
{
  constructor(repo: IRepositoryClipboard) {
    super(repo);
  }

  async execute(userId: string): Promise<number> {
    return this.repository.deleteUserClipboards(userId);
  }
}
