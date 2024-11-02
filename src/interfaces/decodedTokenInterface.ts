import RoleType from "@app/types/RoleType";

export default interface DecodedTokenInterface {
    uid: string;
    role: RoleType;
    iat: number;
    exp: number;
}
