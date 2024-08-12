import { connect } from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'


connect(); 


export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {email, password } = reqBody

        // validation
        console.log(reqBody);

        const user = await User.findOne({ email });

        if (!user) return NextResponse.json({ error: "User does not exists" }, { status: 400 });
        
        console.log("user exists"); 

        const validPassword = await bcryptjs.compare(password, user.password); 

        if(!validPassword) {
            return NextResponse.json({
                error: "Check your credentials"
            }, {
                status: 400
            })
        }

        const tokenPayLoad = {
            id : user._id,
            username : user.username,
            email : user.email
        }

        const token = jwt.sign(tokenPayLoad, process.env.TOKEN_SECERET!, {expiresIn : "1d"});
        
        const response = NextResponse.json({
            message : "Logged in succesfully", 
            success : true
        })

        response.cookies.set("token", token, {
            httpOnly : true
        });

        return response ; 



        

    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, {
            status: 500
        })
    }
}