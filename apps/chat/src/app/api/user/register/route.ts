import { NextRequest, NextResponse } from "next/server";
import {
  UserDAL,
  UserLogic,
  RegisterCodeLogic,
  InvitationCodeLogic,
  AccessControlLogic,
} from "database";
import { ReturnStatus, ResponseStatus } from "@/app/api/typing.d";
import { Redis } from '@upstash/redis'

const ifVerifyCode = !!process.env.NEXT_PUBLIC_EMAIL_SERVICE;

/**
 * Registered user
 * @param req
 * @constructor
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {

    const { email, password, code, code_type, phone, invitation_code } =
      await req.json();
    const userDal = new UserDAL();
    if (await userDal.exists(email)) {
      // User already exists.
      console.log("email  exist");
      return NextResponse.json({ status: ResponseStatus.alreadyExisted });
    }
    console.log("email not exist");
    
    // After registration, directly generate a JWT Token and return it.
    const accessControl = new AccessControlLogic();
    const token = await accessControl.newJWT(email);
    return NextResponse.json({
      status: ResponseStatus.Success,
      sessionToken: token,
    });
  } catch (error) {
    console.error("[REGISTER]", error);
    return new Response("[INTERNAL ERROR]", { status: 500 });
  }
}
