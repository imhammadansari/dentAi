const isProd = process.env.NODE_ENV === 'production';

<<<<<<< HEAD
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
=======
const base = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax',
};

const accessTokenCookieOptions = { ...base, maxAge: 10 * 60 * 60 * 1000 };
const refreshTokenCookieOptions = { ...base, maxAge: 7 * 24 * 60 * 60 * 1000 };

const COOKIE_NAMES = {
    patient: { access: 'patient_accessToken', refresh: 'patient_refreshToken' },
    dentist: { access: 'dentist_accessToken', refresh: 'dentist_refreshToken' },
    admin: { access: 'admin_accessToken', refresh: 'admin_refreshToken' },
};

module.exports = { accessTokenCookieOptions, refreshTokenCookieOptions, COOKIE_NAMES };
>>>>>>> final-fixes
