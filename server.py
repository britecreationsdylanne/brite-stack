"""
BriteStack Server
Flask backend for OAuth and serving the React app
"""

import os
import json
import secrets
from flask import Flask, request, jsonify, send_from_directory, Response, redirect, session, url_for
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
from werkzeug.middleware.proxy_fix import ProxyFix
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='dist')
CORS(app)

# Fix for running behind Cloud Run's proxy - ensures correct HTTPS URLs
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Session configuration for OAuth
app.secret_key = os.environ.get('FLASK_SECRET_KEY', secrets.token_hex(32))

# OAuth configuration
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.environ.get('GOOGLE_CLIENT_ID'),
    client_secret=os.environ.get('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

ALLOWED_DOMAIN = 'brite.co'

def get_current_user():
    """Get current authenticated user from session"""
    return session.get('user')


# ============================================================================
# OAUTH AUTHENTICATION ROUTES
# ============================================================================

@app.route('/auth/login')
def auth_login():
    """Redirect to Google OAuth"""
    if get_current_user():
        return redirect('/')
    redirect_uri = url_for('auth_callback', _external=True)
    return google.authorize_redirect(redirect_uri)


@app.route('/auth/callback')
def auth_callback():
    """Handle OAuth callback from Google"""
    try:
        token = google.authorize_access_token()
        user_info = token.get('userinfo')

        if not user_info:
            return 'Failed to get user info', 400

        email = user_info.get('email', '')

        # Enforce domain restriction
        if not email.endswith(f'@{ALLOWED_DOMAIN}'):
            return f'''
            <html>
            <head><title>Access Denied</title></head>
            <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #272D3F;">
                <div style="text-align: center; color: white; padding: 2rem;">
                    <h1 style="color: #FC883A;">Access Denied</h1>
                    <p>Only @{ALLOWED_DOMAIN} email addresses are allowed.</p>
                    <p style="color: #A9C1CB;">You tried to sign in with: {email}</p>
                    <a href="/auth/login" style="color: #31D7CA;">Try again with a different account</a>
                </div>
            </body>
            </html>
            ''', 403

        # Store user in session
        session['user'] = {
            'email': email,
            'name': user_info.get('name', ''),
            'picture': user_info.get('picture', '')
        }

        return redirect('/')

    except Exception as e:
        print(f"[AUTH ERROR] OAuth callback failed: {e}")
        return f'Authentication failed: {str(e)}', 500


@app.route('/auth/logout')
def auth_logout():
    """Clear session and redirect to login"""
    session.pop('user', None)
    return redirect('/auth/login')


@app.route('/api/user')
def get_user_api():
    """Return current authenticated user info"""
    user = get_current_user()
    if not user:
        return jsonify({'authenticated': False}), 401
    return jsonify({'authenticated': True, 'user': user})


# ============================================================================
# STATIC FILE SERVING
# ============================================================================

@app.route('/')
def serve_index():
    """Serve the main React app with auth check"""
    user = get_current_user()
    if not user:
        return redirect('/auth/login')

    # Serve the React app's index.html with user info injected
    index_path = os.path.join(app.static_folder, 'index.html')
    with open(index_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Inject user info for the React app
    user_script = f'''<script>
    window.AUTH_USER = {json.dumps(user)};
    </script>
</head>'''
    html = html.replace('</head>', user_script, 1)

    return Response(html, mimetype='text/html')


@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """Serve static assets"""
    return send_from_directory(os.path.join(app.static_folder, 'assets'), filename)


@app.route('/<path:path>')
def serve_static(path):
    """Serve other static files or return index for SPA routing"""
    file_path = os.path.join(app.static_folder, path)
    if os.path.isfile(file_path):
        return send_from_directory(app.static_folder, path)
    # For SPA routing, return index.html (but require auth)
    user = get_current_user()
    if not user:
        return redirect('/auth/login')
    return serve_index()


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    print(f"\n{'=' * 60}")
    print(f"BriteStack Server")
    print(f"{'=' * 60}")
    print(f"Port: {port}")
    print(f"OAuth: Google (server-side)")
    print(f"Domain restriction: @{ALLOWED_DOMAIN}")
    print(f"{'=' * 60}\n")

    app.run(debug=os.environ.get('FLASK_DEBUG', 'false').lower() == 'true', port=port, host='0.0.0.0')
