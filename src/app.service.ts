import { Injectable } from '@nestjs/common';
import { renderSitePage } from './ui/site-page';

@Injectable()
export class AppService {
  getLandingPage(): string {
    return renderSitePage({
      title: 'Rare Collectible Auction House',
      description:
        'A trusted platform for discovering rare collectibles, bidding with confidence, managing payments, and resolving disputes.',
      activePath: '/',
      body: `<main class="shell">
        <section class="hero">
          <div class="reveal delay-1">
            <span class="eyebrow">The collector's marketplace</span>
            <h1>Discover rare items. Bid with confidence. Collect with pride.</h1>
            <p>
              The most trusted platform for trading rare collectibles. Thousands of verified buyers and sellers discovering authentic items, placing transparent bids, and completing secure transactions every day.
            </p>
            <div class="hero-actions">
              <a class="button button-primary guest-only-cta" href="/register">Create account</a>
              <a class="button button-primary user-only-cta" href="/seller/auctions/new" style="display: none;">Create listing</a>
              <a class="button button-secondary" href="/marketplace">Browse auctions</a>
            </div>
          </div>
          <div class="hero-rail">
            <article class="panel hero-highlight reveal delay-2">
              <h2 style="margin-bottom: 12px;">Why collectors trust us</h2>
              <div class="highlight-list">
                <div class="highlight-item">✓ Real-time bidding with transparent pricing</div>
                <div class="highlight-item">✓ Verified seller profiles and detailed listings</div>
                <div class="highlight-item">✓ Secure payments and buyer protection</div>
                <div class="highlight-item">✓ Professional moderation & dispute resolution</div>
              </div>
            </article>
          </div>
        </section>

        <div class="stats-row reveal delay-2" style="margin-top: 32px;">
          <div class="stat-box">
            <div class="stat-number">8,427</div>
            <div class="stat-label">Active auctions</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">12,891</div>
            <div class="stat-label">Verified sellers</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">45,203</div>
            <div class="stat-label">Successful sales</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">98%</div>
            <div class="stat-label">Positive ratings</div>
          </div>
        </div>

        <div class="section-title reveal delay-1" style="margin-top: 36px;">
          <div>
            <h2>How it works</h2>
          </div>
        </div>

        <section class="grid grid-3">
          <article class="feature-card reveal delay-1">
            <div style="font-size: 2rem; margin-bottom: 10px;">🔍</div>
            <h3>Discover & Browse</h3>
            <p>Search through thousands of authentic rare items. View high-quality photos, detailed descriptions, seller ratings, and bid history.</p>
          </article>
          <article class="feature-card reveal delay-2">
            <div style="font-size: 2rem; margin-bottom: 10px;">🎯</div>
            <h3>Bid & Win</h3>
            <p>Place bids with confidence. Real-time updates keep you informed. Automatic outbid protection means you'll never miss a winning opportunity.</p>
          </article>
          <article class="feature-card reveal delay-3">
            <div style="font-size: 2rem; margin-bottom: 10px;">✓</div>
            <h3>Complete & Receive</h3>
            <p>Secure checkout with multiple payment options. Direct messaging with sellers. Professional dispute resolution when you need it.</p>
          </article>
        </section>

        <div class="section-title reveal delay-2" style="margin-top: 36px;">
          <div>
            <h2>Why sell with us</h2>
          </div>
        </div>

        <section class="grid grid-2">
          <article class="info-card reveal delay-1">
            <h3>For Buyers</h3>
            <ul style="color: var(--muted); margin-top: 12px; padding-left: 20px; line-height: 1.8;">
              <li>Access to rare items you won't find elsewhere</li>
              <li>Transparent auction mechanics and fair pricing</li>
              <li>Buyer protection and secure payments</li>
              <li>Real-time notifications keep you updated</li>
              <li>Message sellers directly with questions</li>
            </ul>
          </article>
          <article class="info-card reveal delay-2">
            <h3>For Sellers</h3>
            <ul style="color: var(--muted); margin-top: 12px; padding-left: 20px; line-height: 1.8;">
              <li>Reach serious collectors worldwide</li>
              <li>Simple listing creation with photo upload</li>
              <li>Competitive auction format drives better prices</li>
              <li>Professional verification boosts your credibility</li>
              <li>Built-in tools for order and payment management</li>
            </ul>
          </article>
        </section>

        <section class="panel reveal delay-4" style="margin-top: 36px;">
          <div style="text-align: center;">
            <div class="kicker">Ready?</div>
            <h2>Join thousands of collectors today</h2>
            <p style="color: var(--muted); margin-top: 12px; font-size: 1rem;">
              Whether you're buying your next treasure or selling items you've treasured, our marketplace makes it effortless.
            </p>
            <div class="hero-actions" style="margin-top: 20px; justify-content: center;">
              <a class="button button-primary guest-only-cta" href="/register">Create free account</a>
              <a class="button button-primary user-only-cta" href="/seller/auctions/new" style="display: none;">Create listing</a>
              <a class="button button-secondary guest-only-cta" href="/login">Already have an account?</a>
            </div>
          </div>
        </section>
      </main>
      <footer class="site-footer">
        <div class="shell">
          <div class="footer-content">
            <div class="footer-section">
              <h4>Browse</h4>
              <ul>
                <li><a href="/marketplace">Browse auctions</a></li>
                <li><a href="/marketplace">Search items</a></li>
                <li><a href="/seller/auctions">View all sellers</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Sell</h4>
              <ul>
                <li><a href="/seller/auctions/new">Create listing</a></li>
                <li><a href="/seller/auctions">Manage auctions</a></li>
                <li><a href="/messages">Message buyers</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Account</h4>
              <ul>
                <li><a href="/profile" class="user-only-footer" style="display: none;">Profile</a></li>
                <li><a href="/bids" class="user-only-footer" style="display: none;">My bids</a></li>
                <li><a href="/notifications/page" class="user-only-footer" style="display: none;">Notifications</a></li>
                <li><a href="/register" class="guest-only-footer">Sign up</a></li>
                <li><a href="/login" class="guest-only-footer">Sign in</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Help</h4>
              <ul>
                <li><a href="/api">API Documentation</a></li>
                <li><a href="/disputes" class="user-only-footer" style="display: none;">Disputes</a></li>
                <li><a href="/">About us</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2026 Rare Collectible Auction House. All rights reserved. | <a href="/">Home</a> | <a href="/marketplace">Marketplace</a></p>
          </div>
        </div>
      </footer>
      <script>
        const token = localStorage.getItem('auctionHouseToken');
        const guestOnlyCtas = document.querySelectorAll('.guest-only-cta');
        const userOnlyCtas = document.querySelectorAll('.user-only-cta');

        if (token) {
          guestOnlyCtas.forEach((element) => {
            element.style.display = 'none';
          });
          userOnlyCtas.forEach((element) => {
            element.style.display = '';
          });
        }
      </script>`,
    });
  }

  /**
   * Returns a short health string for the root route.
   * @returns { string }
   */
  getHealth(): string {
    return 'Rare Collectible Auction House API';
  }

  getLoginPage(): string {
    return renderSitePage({
      title: 'Login | Rare Collectible Auction House',
      description: 'Sign in to access auctions, bids, messages, and notifications.',
      activePath: '/login',
      body: `<main class="form-shell">
        <section class="form-card reveal delay-1">
          <span class="eyebrow">Welcome back</span>
          <h1>Log in to continue bidding and managing your activity.</h1>
          <p class="form-intro">
            Use your registered email and password to access your profile, auctions, notifications,
            and messages.
          </p>
          <form id="login-form" novalidate>
            <label>
              Email address
              <input type="email" name="email" placeholder="collector@example.com" autocomplete="email" required />
            </label>
            <label>
              Password
              <input type="password" name="password" placeholder="Enter your password" autocomplete="current-password" required />
            </label>
            <button class="button button-primary" type="submit">Log in</button>
          </form>
          <div id="status" class="status" aria-live="polite"></div>
          <p class="footer">Need an account? <a href="/register" style="color: var(--brand-dark); font-weight: 700;">Create one here</a>.</p>
        </section>
      </main>
      <script>
        const existingToken = localStorage.getItem('auctionHouseToken');
        const redirectForRole = async (token) => {
          try {
            const response = await fetch('/users/me', {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            });
            const profile = await response.json().catch(() => null);
            if (response.ok && profile?.role === 'ADMIN') {
              window.location.replace('/admin/dashboard');
              return;
            }
          } catch {
            // Fall back to default redirect.
          }
          window.location.replace('/seller/auctions');
        };

        if (existingToken) {
          redirectForRole(existingToken);
        }

        const form = document.getElementById('login-form');
        const status = document.getElementById('status');

        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          status.className = 'status';
          status.textContent = '';

          const payload = Object.fromEntries(new FormData(form).entries());

          try {
            const response = await fetch('/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
              const message = Array.isArray(data?.message)
                ? data.message.join(', ')
                : data?.message || 'Unable to log in with those credentials.';
              throw new Error(message);
            }

            status.className = 'status success visible';
            if (data?.access_token) {
              localStorage.setItem('auctionHouseToken', data.access_token);
            }
            status.textContent = 'Login successful. Redirecting...';
            window.setTimeout(() => {
              redirectForRole(data?.access_token || localStorage.getItem('auctionHouseToken'));
            }, 700);
          } catch (error) {
            status.className = 'status error visible';
            status.textContent = error instanceof Error ? error.message : 'Something went wrong.';
          }
        });
      </script>`,
    });
  }

  getRegisterPage(): string {
    return renderSitePage({
      title: 'Register | Rare Collectible Auction House',
      description:
        'Create an account to buy, sell, and participate in collectible auctions.',
      activePath: '/register',
      body: `<main class="form-shell">
        <section class="form-card reveal delay-1">
          <span class="eyebrow">Create an account</span>
          <h1>Start buying, selling, and tracking rare collectibles.</h1>
          <p class="form-intro">
            Register to participate in auctions, manage your profile, track bids, receive updates,
            and message other participants securely.
          </p>
          <form id="register-form" novalidate>
            <div class="field-grid">
              <label>
                Display name
                <input type="text" name="displayName" placeholder="Rare Finds Studio" autocomplete="nickname" />
              </label>
              <label>
                Contact phone
                <input type="tel" name="contactPhone" placeholder="+44 7700 900123" autocomplete="tel" />
              </label>
            </div>
            <label>
              Email address
              <input type="email" name="email" placeholder="collector@example.com" autocomplete="email" required />
            </label>
            <label>
              Password
              <span class="hint">Use at least 6 characters.</span>
              <input type="password" name="password" placeholder="Create a secure password" autocomplete="new-password" minlength="6" required />
            </label>
            <button class="button button-primary" type="submit">Register</button>
          </form>
          <div id="status" class="status" aria-live="polite"></div>
          <p class="footer">Already registered? <a href="/login" style="color: var(--brand-dark); font-weight: 700;">Log in here</a>.</p>
        </section>
      </main>
      <script>
        const existingToken = localStorage.getItem('auctionHouseToken');
        if (existingToken) {
          window.location.replace('/seller/auctions');
        }

        const form = document.getElementById('register-form');
        const status = document.getElementById('status');

        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          status.className = 'status';
          status.textContent = '';

          const rawPayload = Object.fromEntries(new FormData(form).entries());
          const payload = Object.fromEntries(
            Object.entries(rawPayload).filter(([, value]) => String(value).trim() !== ''),
          );

          try {
            const response = await fetch('/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
              const message = Array.isArray(data?.message)
                ? data.message.join(', ')
                : data?.message || 'Unable to create your account right now.';
              throw new Error(message);
            }

            status.className = 'status success visible';
            status.textContent = 'Registration successful. Redirecting you to login...';
            form.reset();
            window.setTimeout(() => {
              window.location.href = '/login';
            }, 850);
          } catch (error) {
            status.className = 'status error visible';
            status.textContent = error instanceof Error ? error.message : 'Something went wrong.';
          }
        });
      </script>`,
    });
  }
}
