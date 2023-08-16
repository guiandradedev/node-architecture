import { AuthToken } from '@/modules/user/domain'

export interface IAuthTokenRepository {
    create(data: AuthToken): Promise<void>
}