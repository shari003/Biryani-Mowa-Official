import Order from "@/app/models/Orders";
import { NextRequest, NextResponse } from "next/server";
import { authOptions, isAdmin } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

type ParamType = {
    params: {
        _id: string
    }
}

export async function GET(req: NextRequest, {params: {_id}}: ParamType) {
    try {
        const session = await getServerSession(authOptions);
        if(session?.user){
            const order = await Order.findOne({_id});
            if(!order) throw new Error('No order found!!');
            return NextResponse.json(order);
        } else {
            return NextResponse.json({error: 'Cannot see the requested page.'}, {status: 401});
        }
    } catch (err: any) {
        return NextResponse.json({error: err.message}, {status: 500});
    }
}

export async function PUT(req: NextRequest, {params: {_id}}: ParamType) {
    try {
        if(await isAdmin()){
            const data = await req.json();
            const order = await Order.findByIdAndUpdate(_id, data, {new: true});
            if(!order) throw new Error('Something went wrong')               ;
            return NextResponse.json(order);
        } else {
            return NextResponse.json({error: 'Cannot see the requested page.'}, {status: 401});
        }
        
    } catch (err: any) {
        return NextResponse.json({error: err.message}, {status: 500});
    }
}