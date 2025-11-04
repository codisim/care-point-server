import config from "../../../config";
import { UserStatus } from "../../../generated/enums"
import { jwtHelperes } from "../../helper/jwtHelper";
import { prisma } from "../../shared/prisma"
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const login = async( payload: {email: string, password: string} ) => {

    const user = await prisma.user.findFirstOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })
    
    console.log("auth", payload.password, user.password)
    const checkPassword = await bcrypt.compare(payload.password, user.password)
    console.log("auth", checkPassword)

    if(!checkPassword) {
        throw new Error("Password not matched")
    }

    const accessToken = jwtHelperes.generateToken({email: user.email, role: user.role}, config.access_token_secret as string, "1h")

    const refreshToken = jwtHelperes.generateToken({email: user.email, role: user.role}, config.refresh_token_secret as string, "90d")

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange
    }
}

export const AuthService = {
    login
}