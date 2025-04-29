import { User } from "@/modules/user/domain"
import { UserAuthenticateResponse } from "@/modules/user/protocols/authenticateUserDTO"

export interface ResponseAdapter {
    id: string,
    attributes: any,
    links: {
        self: string
    },
    token?: {
        access_token: string,
        refresh_token: string
    }
}

export const userResponse = (user: User): ResponseAdapter => {
    return {
        id: user.id,
        attributes: {
            name: user.props.name,
            email: user.props.email,
            role: user.props.role,
            createdAt: user.props.createdAt,
            updatedAt: user.props.updatedAt,
            account_activate_at: user.props.account_activate_at,
        },
        links: {
            self: "/api/user/"+user.id
        }
    }
}

export const userTokenResponse = (user: UserAuthenticateResponse): ResponseAdapter => {
    return {
        id: user.id,
        attributes: {
            name: user.props.name,
            email: user.props.email,
            role: user.props.role,
            createdAt: user.props.createdAt,
            updatedAt: user.props.updatedAt,
            account_activate_at: user.props.account_activate_at,
        },
        links: {
            self: "/api/user/"+user.id
        },
        token: {
            access_token: user.token.accessToken,
            refresh_token: user.token.refreshToken
        }
    }
}