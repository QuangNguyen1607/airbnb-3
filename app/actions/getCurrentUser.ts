import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getSession() {
	return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
	try {
		const session = await getSession();
		if (!session?.user?.email) {
			return null;
		}
		const currentUser = await prisma?.user.findUnique({
			where: {
				email: session.user.email as string, // above to check conditional for user email
			},
		});
		if (!currentUser) return null;
		return {
			...currentUser,
			createdAt: currentUser.createAt.toISOString(),
			updatedAt: currentUser.updatedAt.toISOString(),
			emailVerified: currentUser.emailVerified?.toISOString() || null
		};
	} catch (error: any) {}
}
