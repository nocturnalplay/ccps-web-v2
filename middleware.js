// <root>/middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/ccps")) {
    let userid = request.nextUrl.pathname.split("/");
    
    if (true) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(`${process.env.URL}/auth/signin`);
    }
  }
}
