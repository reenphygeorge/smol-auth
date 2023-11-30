type SignUp = (email: string, password: string) => Promise<SmolResponse>;
type SignIn = (email: string, password: string) => Promise<SmolResponse>;
type SignOut = () => Promise<SmolResponse>;
type RoleUpgrade = (role: string) => Promise<SmolResponse>;
type SmolClient = (apiDomain: string) => void;
type SmolResponse = {
    success: boolean;
    message: string;
};

export const smolClient: SmolClient 
export const signUp: SignUp
export const signIn: SignIn;
export const signOut: SignOut;
export const roleUpgradeFunction: RoleUpgrade;