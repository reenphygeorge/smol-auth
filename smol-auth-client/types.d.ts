type SignUp = (email: string, password: string) => Promise<SmolResponseWithId>;
type SignIn = (email: string, password: string) => Promise<SmolResponseWithId>;
type SignOut = () => Promise<SmolResponse>;
type RoleUpgrade = (role: string) => Promise<SmolResponse>;
type SmolClient = (apiDomain: string) => void;
type GetAuthId = () => string;

type SmolResponse = {
    success: boolean;
    message: string;
};

type SmolResponseWithId = {
    success: boolean;
    message: string;
    authId: string;
};

export const smolClient: SmolClient;
export const signup: SignUp;
export const signin: SignIn;
export const signout: SignOut;
export const roleUpgrade: RoleUpgrade;
export const getAuthId: GetAuthId;