type TokenDbInit = () => void;
type UserDbInit = (connectionUrl: string) => void;
type RbacInit = (rbacRules: RbacRules, { defaultRole }: DefaultRole) => void;

type Methods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

type RouteSpec = {
    route: string;
    method: '*' | Methods[]
}

type RbacRules = {
    [key: string]: RouteSpec[] | '*';
}

type DefaultRole = {
    defaultRole: string;
}

type SmolConfig = {
    connectionUrl: string;
    accessTokenSecret: string;
    refreshTokenSecret: string;
};

type TokenStore = {
    id: number;
    tokenId: string;
    token: string;
}

type TokenData = {
    authId: string;
    role: string;
}

type GetTokenById = (tokenId: string) => Promise<TokenStore>

type RefreshTokenCookie = {
    success: boolean;
    cookieValue: string;
    authId: string;
    role: string;
}

type GenerateAccessToken = (tokenData: TokenData, accessTokenSecret: string) => string;

type User = {
    id: number;
    authId: string;
    email: string;
    password: string;
    role: string;
    refreshTokenId: string;
    createdAt?: Date | string;
}

type GetUser = (authId: string) => Promise<User>

type UpdateRefreshTokenId = (authId: string, refreshTokenId: string) => Promise<string>;

type UpdateUserData = {
    id?: number;
    authId?: string;
    email?: string;
    password?: string;
    role?: string;
    refreshTokenId?: string;
}

type NewUserData = {
    id?: string;
    authId?: string;
    email?: string;
    password?: string;
    role?: string;
    refreshTokenId?: string;
    createdAt?: string;
}

type UpdateUser = (authId: string, user: UpdateUserData) => Promise<void>;

type GenerateRefreshToken = (tokenData: TokenData, refreshTokenSecret: string) => string;

type CreateNewToken = (token: string) => Promise<string>;

type GetUserByEmail = (email: string) => Promise<User>;

type RemoveToken = (tokenId: string) => Promise<TokenStore>;

type CreateUser = (user: NewUserData) => Promise<void>;

export const tokenDbInit: TokenDbInit;
export const userDbInit: UserDbInit;
export const rbacInit: RbacInit;
export const getTokenById: GetTokenById;
export const generateAccessToken: GenerateAccessToken;
export const generateRefreshToken: GenerateRefreshToken;
export const getUser: GetUser;
export const updateRefreshTokenId: UpdateRefreshTokenId;
export const updateUser: UpdateUser;
export const createNewToken: CreateNewToken;
export const getUserByEmail: GetUserByEmail;
export const removeToken: RemoveToken;
export const createUser: CreateUser
export let __rbacRules: RbacRules;
export let __defaultRole: string;