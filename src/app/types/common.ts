import { UserRole } from "../../generated/enums";

export type IJWTPayload = {
    email: string;
    role: UserRole
}