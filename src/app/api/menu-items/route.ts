import { connect } from "@/app/dbConfig/dbConfig";
import MenuItem from "@/app/models/MenuItems";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();        
        const newMenuItem = new MenuItem(data);
        const saveMenuItem = await newMenuItem.save();
        return NextResponse.json(saveMenuItem.itemName);

    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 500});
    }
}

export async function GET(req: NextRequest) {
    connect();
    try {
        let menuItems = await MenuItem.find(); 
        const noPriorityItems = menuItems.filter(item => item.priority.isPriority === false);
        const priorityItems = menuItems.filter(item => item.priority.isPriority === true);
        menuItems = [...noPriorityItems, ...priorityItems];
        return NextResponse.json(menuItems);
    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 500});
    }
}

export async function PUT(req: NextRequest) {
    try {
        const {_id, ...data} = await req.json();
        const doc = await MenuItem.findByIdAndUpdate(_id, data, {new: true});
        return NextResponse.json(doc.itemName);
    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 500});
    }
}