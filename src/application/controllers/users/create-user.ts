import { HttpResponse, ok, badRequest, serverError } from '@/application/helpers'
import { RequiredFieldError } from '@/application/errors';
import { CreateUser } from '@/domain/use-cases/user/create-user';
import { Controller } from '@/application/controllers/controller';

type Input = { nome: string }
type Model = Error | { accessToken: string }

export class CreateUserController extends Controller {
  constructor (private readonly create: CreateUser) { 
    super()
  }

  async perform({ nome }: Input): Promise<HttpResponse<Model>> {
    const error = this.validate({ nome })
    if (error) return badRequest(error)
    try {
      const accessToken = await this.create({ nome })
      return ok(accessToken);
    } catch (e: any) {
      return badRequest(e)
    }
  }

  private validate({ nome }: Input): Error | undefined {
    if (nome === undefined || nome === '') {
      return new RequiredFieldError("nome")
    }
  }
}
