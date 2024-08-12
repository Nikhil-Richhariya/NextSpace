import { connect } from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDataFromToken } from '@/helpers/getDataFromToken'


connect();

export async function POST(request: NextRequest) {
    // extracting data from token
    const userId = await getDataFromToken(request); 

    const user = await User.findOne({_id : userId}).select("-password"); // password field will not be selected 

    //check if no user
    return NextResponse.json({
        message : "User found", 
        data : user
    })

}