import MenuItem from "@/app/models/MenuItems";
import { NextRequest, NextResponse } from "next/server";

type ParamType = {
    params: {
        _id: string
    }
}

export async function GET(req: NextRequest, {params: {_id}}: ParamType) {
    try {
        const menuItem = await MenuItem.findOne({_id});
        return NextResponse.json(menuItem)
    } catch (err: any) {
        return NextResponse.json({error: err.message}, {status: 500});
    }
}

export async function DELETE(req: NextRequest, {params: {_id}}: ParamType) {
    try {
        const menuItem = await MenuItem.findByIdAndDelete({_id});
        return NextResponse.json(menuItem)
    } catch (err: any) {
        return NextResponse.json({error: err.message}, {status: 500});
    }
}