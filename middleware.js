// <root>/middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // This logic is only applied to /dashboard
    console.log("happened");
    if (true) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(`${process.env.URL}/auth/signin`);
    }
  }
} 
