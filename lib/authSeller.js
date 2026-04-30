import { clerkClient } from '@clerk/nextjs/server';

const authSeller = async (userId) => {
    try {
        const client = await clerkClient()
        const user = await client.users.getUser(userId)

        if (user.publicMetadata?.role === 'admin') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Auth error:", error);
        return false;
    }
}

export default authSeller;