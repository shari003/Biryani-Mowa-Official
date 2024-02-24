import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const users = await User.find().lean();
        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const {userId, actionType} = data;

        const noOfAdmins = await User.countDocuments({isAdmin: true});
        if(noOfAdmins === 1 && actionType === 'USER') throw new Error('Cannot delete the only ADMIN');

        const updateUser = await User.findByIdAndUpdate({_id: userId}, {$set: {isAdmin: actionType === 'USER' ? false : true}}, {new: true});

        return NextResponse.json(updateUser);

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}