type TokenData = {
    access_token: string;
    refresh_token: string;
    expires_at: number;
};

const tokenStore: Record<string, TokenData> = {};

export function saveToken(athlete_id: number, data: TokenData) {
    tokenStore[athlete_id] = data;
}

export function getToken(athlete_id: number): TokenData | null {
    return tokenStore[athlete_id] || null;
}

export function isTokenExpired(athlete_id: number): boolean {
    const token = getToken(athlete_id);
    if (!token) return true;

    // Add 5 minute buffer before expiration
    return Date.now() / 1000 >= (token.expires_at - 300);
}
