const isProd = process.env.NODE_ENV === 'production';

const accessTokenCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax',
    maxAge: 10 * 60 * 60 * 1000, // 10 hours
};

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

module.exports = { accessTokenCookieOptions, refreshTokenCookieOptions };
