import { NextRequest, NextResponse } from 'next/server';
import {SettingSeeder} from "@/lib/prisma/admin/seed_settings";
import {getSetting} from '@/lib/settings'

export async function GET(NextRequest){
	const clientIdSetting = await getSetting('GOOGLE_CLIENT_ID') 
	console.log(clientIdSetting)
	return NextResponse.json({status:200,result:"Greetings, human. Everything is functioning as it should be. Please return to your work. ||  The answer to life, the universe, and everything is: This API test is working. || This is not the API you're looking for... probably."});
}