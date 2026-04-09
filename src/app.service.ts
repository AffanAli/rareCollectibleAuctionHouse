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
            <span class="eyebrow">Transparent collectible auctions</span>
            <h1>Discover, bid, and trade rare items with confidence.</h1>
            <p>
              A single, purpose-built space for collectors, sellers, and administrators to manage
              the full auction lifecycle with clear activity, structured payments, secure access,
              and built-in dispute resolution.
            </p>
            <div class="hero-actions">
              <a class="button button-primary" href="/register">Create your account</a>
              <a class="button button-secondary" href="/marketplace">Explore the marketplace</a>
            </div>
            <div class="hero-foot">
              <span class="chip">Browse live auctions</span>
              <span class="chip">Track bids and history</span>
              <span class="chip">Messages and notifications</span>
              <span class="chip">Admin oversight and moderation</span>
            </div>
          </div>
          <div class="hero-rail">
            <article class="panel hero-highlight reveal delay-2">
              <h2>Built for trust from listing to payment</h2>
              <p>
                Clear auction mechanics, visible activity, and structured escalation paths reduce
                uncertainty for every participant.
              </p>
              <div class="highlight-list">
                <div class="highlight-item">
                  <strong>For buyers:</strong> find rare items, review auction details, place bids,
                  and stay updated when you are outbid or win.
                </div>
                <div class="highlight-item">
                  <strong>For sellers:</strong> reach a broader audience, manage auctions, and keep
                  buyer communication in one place.
                </div>
                <div class="highlight-item">
                  <strong>For admins:</strong> monitor users, payments, disputes, messages, and
                  moderation from a central dashboard.
                </div>
              </div>
            </article>
          </div>
        </section>

        <div class="section-title reveal delay-2">
          <div>
            <div class="kicker">Platform pillars</div>
            <h2>Designed around the real auction journey</h2>
          </div>
          <p>
            The experience brings discovery, competition, communication, and resolution into one
            coherent flow so users are not forced to jump between fragmented tools.
          </p>
        </div>

        <section class="grid grid-3">
          <article class="feature-card reveal delay-1">
            <h3>Explore auctions clearly</h3>
            <p>
              Visitors can inspect auction details before signing in, while registered users browse
              active listings, view timing, seller context, and bid histories in one place.
            </p>
          </article>
          <article class="feature-card reveal delay-2">
            <h3>Bid with visibility</h3>
            <p>
              Users can place and track bids, review past outcomes, and receive auction-related
              notifications that support informed and timely decisions.
            </p>
          </article>
          <article class="feature-card reveal delay-3">
            <h3>Resolve issues responsibly</h3>
            <p>
              Messaging, payment oversight, moderation, and disputes are built in so the platform
              can stay predictable, fair, and easier to trust.
            </p>
          </article>
        </section>

        <div class="section-title reveal delay-3">
          <div>
            <div class="kicker">Core use cases</div>
            <h2>Everything stakeholders expect in one ecosystem</h2>
          </div>
          <p>
            The homepage reflects the documented goals: accessible discovery for guests, account
            creation for new users, and dependable oversight for administrators.
          </p>
        </div>

        <section class="grid grid-2">
          <article class="info-card reveal delay-1">
            <h3>Collector experience</h3>
            <p>
              Register, log in, browse auctions, inspect details, place bids, review your bidding
              history, check notifications, message participants, and raise concerns when a
              transaction does not go as expected.
            </p>
          </article>
          <article class="info-card reveal delay-2">
            <h3>Operational oversight</h3>
            <p>
              Administrators gain visibility across users, auctions, bids, messages, notifications,
              disputes, and payments so moderation and resolution can be handled consistently.
            </p>
          </article>
        </section>

        <section class="grid grid-3">
          <article class="metric-card reveal delay-2">
            <span class="metric">15</span>
            <h3>Documented use cases</h3>
            <p>
              From registration and login through bidding, messaging, disputes, moderation, and
              payment visibility.
            </p>
          </article>
          <article class="metric-card reveal delay-3">
            <span class="metric">1</span>
            <h3>Unified marketplace</h3>
            <p>
              Listings, bids, updates, and issue handling are designed to live together instead of
              being split across disconnected services.
            </p>
          </article>
          <article class="metric-card reveal delay-4">
            <span class="metric">24/7</span>
            <h3>Always accessible</h3>
            <p>
              The public landing page stays visible without authentication, giving new visitors a
              clear path into the platform immediately.
            </p>
          </article>
        </section>

        <section class="panel reveal delay-4" style="margin-top: 24px;">
          <div class="section-title" style="margin-top: 0; margin-bottom: 0;">
            <div>
              <div class="kicker">Start here</div>
              <h2>Join the marketplace or continue your account journey</h2>
            </div>
            <p>
              New users can create an account in a minute. Returning users can sign in and continue
              bidding, messaging, or managing auction activity.
            </p>
          </div>
          <div class="hero-actions" style="margin-top: 22px;">
            <a class="button button-primary" href="/register">Register now</a>
            <a class="button button-secondary" href="/seller/auctions">Manage auctions</a>
          </div>
        </section>

        <p class="footer reveal delay-4">Public homepage for the Rare Collectible Auction House platform.</p>
      </main>`,
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
            status.textContent = 'Login successful. Redirecting to your auction dashboard...';
            window.setTimeout(() => {
              window.location.href = '/seller/auctions';
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
