// auth.js - Site-wide authentication
const AUTH_TOKEN_KEY = 'sn_auth_token';
const USER_KEY = 'sn_user';
const SESSION_KEY = 'sn_session';

class Auth {
    constructor() {
        this.user = null;
        this.token = null;
    }

    async init() {
        // 1) Handle Supabase magic/reset links from URL hash
        try {
            const hash = window.location.hash ? window.location.hash.slice(1) : '';
            if (hash) {
                const params = new URLSearchParams(hash);
                const accessToken = params.get('access_token');
                const type = params.get('type');

                if (accessToken) {
                    if (type === 'recovery') {
                        // PASSWORD RESET FLOW
                        localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
                        history.replaceState(null, document.title, '/reset-password.html');
                        window.location.href = '/reset-password.html';
                        return;
                    }

                    // MAGIC LINK OR EMAIL CONFIRMATION
                    const resp = await fetch('/.netlify/functions/supabase-proxy', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({ action: 'useAccessToken', payload: {} })
                    });
                    const json = await resp.json();

                    if (resp.ok && json?.data?.user && json?.data?.session?.access_token) {
                        this.user = json.data.user;
                        this.token = json.data.session.access_token;

                        localStorage.setItem(USER_KEY, JSON.stringify(this.user));
                        localStorage.setItem(AUTH_TOKEN_KEY, this.token);

                        // Store refresh token for Supabase client authentication
                        if (json.data.session.refresh_token) {
                            localStorage.setItem('sn_refresh_token', json.data.session.refresh_token);
                        }

                        const role = json.data.role || 'USER';
                        localStorage.setItem('userRole', role);

                        history.replaceState(null, document.title, window.location.pathname + window.location.search);

                        await this.ensureDisplayName();
                        return;
                    } else {
                        console.warn('useAccessToken failed:', json?.error || json);
                    }
                }
            }
        } catch (e) {
            console.error('Access token bootstrap error:', e);
        }

        // 2) Normal boot from localStorage
        this.token = localStorage.getItem(AUTH_TOKEN_KEY);
        const userStr = localStorage.getItem(USER_KEY);

        if (userStr) {
            try { 
                this.user = JSON.parse(userStr); 
            } catch (_) { 
                this.user = null; 
            }
        }

        // 3) Validate session
        if (this.token) {
            const isValid = await this.validateSession();
            if (!isValid) {
                this.clearAuth();
            }
        }

        // 4) Ensure display name
        if (this.token) {
            await this.ensureDisplayName();
        }
    }

    async validateSession() {
        try {
            if (!this.token) return false;

            const parts = this.token.split('.');
            if (parts.length !== 3) return false;

            try {
                const payload = JSON.parse(atob(parts[1]));
                const now = Math.floor(Date.now() / 1000);

                if (payload.exp && payload.exp < now) {
                    console.log('Token expired');
                    return false;
                }

                return true;
            } catch (e) {
                console.error('Token decode error:', e);
                return false;
            }
        } catch (error) {
            console.error('Session validation error:', error);
            return false;
        }
    }

    async ensureDisplayName() {
        if (this.user && this.user.display_name && String(this.user.display_name).trim()) return;

        try {
            const resp = await fetch('/.netlify/functions/supabase-proxy', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${this.token}` 
                },
                body: JSON.stringify({ action: 'getProfile', payload: {} })
            });
            const json = await resp.json();
            const current = json?.data?.display_name;
            if (current && current.trim()) {
                this.user = this.user || {};
                this.user.display_name = current.trim();
                localStorage.setItem(USER_KEY, JSON.stringify(this.user));
                return;
            }
        } catch (_) {}

        while (true) {
            const input = window.prompt('Choose a public display name (3–24 letters/numbers, spaces, . _ -):', '');
            if (input === null) break;

            const name = String(input).trim();
            if (!/^[A-Za-z0-9 ._-]{3,24}$/.test(name)) {
                alert('Invalid name. Use 3–24 letters/numbers, spaces, dot, underscore or dash.');
                continue;
            }

            try {
                const setResp = await fetch('/.netlify/functions/supabase-proxy', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${this.token}` 
                    },
                    body: JSON.stringify({ 
                        action: 'setDisplayName', 
                        payload: { display_name: name } 
                    })
                });
                const setJson = await setResp.json();
                if (!setResp.ok) {
                    alert(setJson?.error || 'Could not set name, try another.');
                    continue;
                }
                const dn = setJson?.data?.display_name;
                if (dn) {
                    this.user = this.user || {};
                    this.user.display_name = dn;
                    localStorage.setItem(USER_KEY, JSON.stringify(this.user));
                }
                break;
            } catch (err) {
                alert('Network error. Please try again.');
            }
        }
    }

    async signIn(email, password) {
        const response = await fetch('/.netlify/functions/supabase-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'signIn',
                payload: { email, password }
            })
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error.message);
        }

        if (!result.data || !result.data.user) {
            console.error('Unexpected sign-in response:', result);
            throw new Error('Invalid response from server');
        }

        if (!result.data.user.email_confirmed_at) {
            throw new Error('Please verify your email before signing in. Check your inbox for the confirmation link.');
        }

        this.user = result.data.user;
        this.token = result.data.session.access_token;

        localStorage.setItem(USER_KEY, JSON.stringify(this.user));
        localStorage.setItem(AUTH_TOKEN_KEY, this.token);

        // Store refresh token for Supabase client authentication
        if (result.data.session.refresh_token) {
            localStorage.setItem('sn_refresh_token', result.data.session.refresh_token);
        }

        try {
            const roleResponse = await fetch('/.netlify/functions/supabase-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    action: 'getUserRole',
                    payload: {}
                })
            });

            const roleResult = await roleResponse.json();
            if (roleResult.data?.role) {
                localStorage.setItem('userRole', roleResult.data.role);
            } else {
                localStorage.setItem('userRole', 'USER');
            }
        } catch (error) {
            console.error('Error fetching role:', error);
            localStorage.setItem('userRole', 'USER');
        }

        await this.ensureDisplayName();
        return this.user;
    }

    async signUp(email, password) {
        const response = await fetch('/.netlify/functions/supabase-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'signUp',
                payload: { email, password }
            })
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error.message);
        }

        return result;
    }

    async requestPasswordReset(email) {
        const response = await fetch('/.netlify/functions/supabase-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'resetPassword',
                payload: { email }
            })
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error.message);
        }

        return result;
    }

    async updatePassword(newPassword) {
        const response = await fetch('/.netlify/functions/supabase-proxy', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify({
                action: 'updatePassword',
                payload: { password: newPassword }
            })
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error.message);
        }

        return result;
    }

    async signOut() {
        await fetch('/.netlify/functions/supabase-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'signOut' })
        });

        this.clearAuth();
        window.location.href = '/index.html';
    }

    clearAuth() {
        this.user = null;
        this.token = null;
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem('sn_refresh_token');
        localStorage.removeItem('userRole');
    }

    isAuthenticated() {
        return !!this.user && !!this.token;
    }

    getUser() {
        return this.user;
    }

    getToken() {
        return this.token;
    }

    async requireAuth() {
        await this.init();

        if (!this.isAuthenticated()) {
            const returnUrl = encodeURIComponent(window.location.pathname);
            window.location.href = `/index.html?redirect=${returnUrl}`;
            return false;
        }

        return true;
    }
}

// Global instance
window.auth = new Auth();