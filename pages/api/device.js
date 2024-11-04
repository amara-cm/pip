// pages/api/device.js
export default async function handler(req, res) {
    const userAgent = req.headers['user-agent'];

    // Check if the user is on a mobile device
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(userAgent);

    if (!isMobile) {
        // Redirect desktop users to a mobile-only notice page or display a message
        return res.redirect(307, '/mobile-only'); // Replace with your actual mobile-only page
    }

    // If the user is on mobile, allow them to proceed
    return res.redirect(307, '/'); // Redirect to the main game page
}
