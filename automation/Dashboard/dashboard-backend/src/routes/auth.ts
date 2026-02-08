import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import userService from '../services/userService';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { errorHandler, AppError } from '../middleware/errorHandler';
import logger from '../config/logger';

const router = Router();

// GitHub OAuth URLs
const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

// Start OAuth flow
router.get('/github', (req, res) => {
  const state = Math.random().toString(36).substring(7);
  req.session = req.session || {};
  (req.session as any).oauthState = state;

  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${env.BACKEND_URL}/auth/github/callback`,
    scope: 'repo read:user user:email',
    state,
  });

  res.redirect(`${GITHUB_AUTH_URL}?${params.toString()}`);
});

// OAuth callback
router.get('/github/callback', async (req, res, next) => {
  try {
    const { code, state } = req.query;

    if (!code || typeof code !== 'string') {
      throw new AppError(400, 'Authorization code missing');
    }

    // Verify state
    const sessionState = (req.session as any)?.oauthState;
    if (state !== sessionState) {
      throw new AppError(400, 'Invalid state parameter');
    }

    // Exchange code for token
    const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new AppError(500, 'Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new AppError(500, 'Access token not received');
    }

    // Get user info from GitHub
    const userResponse = await fetch(GITHUB_USER_URL, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new AppError(500, 'Failed to fetch user info from GitHub');
    }

    const githubUser = await userResponse.json();

    // Find or create user
    let user = await userService.findByGitHubId(githubUser.id.toString());
    if (!user) {
      user = await userService.findByEmail(githubUser.email || githubUser.login);
      if (user) {
        // Update existing user with GitHub ID
        user = await userService.update(user.id, {
          githubId: githubUser.id.toString(),
        });
      } else {
        // Create new user
        user = await userService.create({
          email: githubUser.email || `${githubUser.login}@github.local`,
          name: githubUser.name || githubUser.login,
          githubId: githubUser.id.toString(),
        });
      }
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${env.APP_URL}/auth/callback?token=${jwtToken}`);
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'User not authenticated');
    }

    const user = await userService.findById(req.user.id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // But we can add token blacklisting here if needed
  res.json({ message: 'Logged out successfully' });
});

export default router;

