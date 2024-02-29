import Order from "@/app/models/Orders";
import { NextRequest, NextResponse } from "next/server";

type ParamType = {
    params: {
        _id: string
    }
}

export async function GET(req: NextRequest, {params: {_id}}: ParamType) {
    try {
        const order = await Order.findOne({_id});
        if(!order) throw new Error('No order found!!');
        return NextResponse.json(order);
    } catch (err: any) {
        return NextResponse.json({error: err.message}, {status: 500});
    }
}

export async function PUT(req: NextRequest, {params: {_id}}: ParamType) {
    try {
        const data = await req.json();

        const order = await Order.findByIdAndUpdate(_id, data, {new: true});
        if(!order) throw new Error('Something went wrong')               ;
        
        return NextResponse.json(order);
    } catch (err: any) {
        return NextResponse.json({error: err.message}, {status: 500});
    }
}