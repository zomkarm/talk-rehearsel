import { NextResponse } from "next/server";
import prisma from '@/lib/prisma/client';

import {SuperAdminSeeder} from "@/lib/prisma/admin/seed_superadmin";
import {PricingSeeder} from "@/lib/prisma/admin/seed_pricings";
import {SettingSeeder} from "@/lib/prisma/admin/seed_settings";
import {TalkRehearselSeeder} from "@/lib/prisma/admin/seed_talkrehearsel";
import {UnscriptedQuestionSeeder} from "@/lib/prisma/admin/seed_unscripted_questions";

export async function POST(req) {
  try {

      await SuperAdminSeeder();
      
      await PricingSeeder();

      await SettingSeeder();

      await TalkRehearselSeeder();

      await UnscriptedQuestionSeeder();
    
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Seeding error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}