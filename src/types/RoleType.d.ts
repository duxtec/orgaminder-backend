import Roles from "@app/constants/Roles";

type RoleType = typeof Roles[keyof typeof Roles];

export default RoleType
