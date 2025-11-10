import { auth, clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const PublicRoutes = ['/auth(.*)', '/', '/competitions(.*)', '/about-us', '/faq', '/text', '/admin(.*)'];
const AdminRoutes = ['/admin(.*)'];
const SuperAdminRoutes = [
  '/admin/admins(.*)',
  '/admin/settings(.*)',
  '/admin/platform-analytics(.*)'
];
const UserRoutes = ['/platform(.*)'];

const isPublicRoute = createRouteMatcher(PublicRoutes);
const isAdminRoute = createRouteMatcher(AdminRoutes);
const isSuperAdminRoute = createRouteMatcher(SuperAdminRoutes);
const isUserRoute = createRouteMatcher(UserRoutes);

export default clerkMiddleware(async (auth, req) => {
  // 1️⃣ Allow public routes immediately
  if (isPublicRoute(req)) return;

  // 2️⃣ Authenticate user
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }

  // 3️⃣ Fetch user role safely
  let userRole = 'NONE';
  try {
    // You can use sessionClaims to avoid API call if it has the role
    console.log('sessionClaims', sessionClaims);
    userRole = (sessionClaims?.publicMetadata as { role?: string })?.role || 'NONE';

    // If not present, fallback to fetching user
    if (userRole === 'NONE') {
      console.log("we Performing the hard way")
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      userRole = (user?.publicMetadata as { role?: string })?.role || 'NONE';
    }
  } catch (err) {
    console.error('Error fetching user role:', err);
    userRole = 'NONE';
  }

  // 4️⃣ Handle user routes
  if (isUserRoute(req)) {
    if (userRole === 'ADMIN' || userRole === 'SUPERADMIN') {
      return NextResponse.redirect(new URL('/admin/', req.url));
    } else if (userRole !== 'USER') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // 5️⃣ Handle admin routes
  if (isAdminRoute(req)) {
    console.log('userRole', userRole);

    if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      return NextResponse.redirect(new URL('/platform/', req.url));
    }

    if (isSuperAdminRoute(req) && userRole !== 'SUPERADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  // 6️⃣ Default protection for any other routes
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
