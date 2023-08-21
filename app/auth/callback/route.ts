import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const requestURL = new URL(request.url)
    const code = requestURL.searchParams.get('code')

    if (code) {
        const supabase = createRouteHandlerClient({cookies})
        await supabase.auth.exchangeCodeForSession(code)
    }

    return NextResponse.redirect(requestURL.origin)
}