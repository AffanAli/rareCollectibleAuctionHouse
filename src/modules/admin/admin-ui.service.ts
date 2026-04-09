import { Injectable } from '@nestjs/common';
import { renderSitePage } from 'src/ui/site-page';

@Injectable()
export class AdminUiService {
  getDashboardPage(): string {
    return renderSitePage({
      title: 'Admin Dashboard | Rare Collectible Auction House',
      description:
        'Administrative overview of users, auctions, bids, messages, disputes, notifications, and payments.',
      activePath: '/admin/dashboard',
      body: `<main class="shell">
        <section class="hero">
          <div class="reveal delay-1">
            <span class="eyebrow">Admin control center</span>
            <h1>Monitor the marketplace and resolve issues from one dashboard.</h1>
            <p>
              Review users, auctions, bids, messages, disputes, notifications, and payment history in a single administrative view.
            </p>
          </div>
          <div class="hero-rail">
            <article class="panel hero-highlight reveal delay-2">
              <h2>Admin workflow</h2>
              <div class="highlight-list" style="margin-top: 18px;">
                <div class="highlight-item">Moderate user and marketplace activity.</div>
                <div class="highlight-item">Resolve disputes with structured outcomes.</div>
                <div class="highlight-item">Review payment history for ended auctions.</div>
              </div>
            </article>
          </div>
        </section>

        <section id="admin-auth-warning" class="empty-state" style="display: none; margin-top: 24px;">
          <h3>Admin login required</h3>
          <p class="muted" style="margin-top: 10px;">Sign in with the seeded administrator account to view this dashboard.</p>
          <div class="hero-actions" style="margin-top: 18px;">
            <a class="button button-primary" href="/login">Go to login</a>
          </div>
        </section>

        <section id="admin-content" style="display: none; margin-top: 24px;">
          <div class="grid grid-3">
            <article class="metric-card"><span id="metric-users" class="metric">0</span><h3>Users</h3></article>
            <article class="metric-card"><span id="metric-auctions" class="metric">0</span><h3>Auctions</h3></article>
            <article class="metric-card"><span id="metric-disputes" class="metric">0</span><h3>Disputes</h3></article>
          </div>

          <section class="table-card" style="margin-top: 24px;">
            <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
              <div><div class="kicker">Dashboard data</div><h2>Platform overview</h2></div>
              <p id="admin-summary">Loading platform data...</p>
            </div>
            <div id="admin-status" class="status" aria-live="polite"></div>
            <div class="stack" id="admin-sections"></div>
          </section>
        </section>
      </main>
      <script>
        const token = localStorage.getItem('auctionHouseToken');
        const authWarning = document.getElementById('admin-auth-warning');
        const content = document.getElementById('admin-content');
        const summary = document.getElementById('admin-summary');
        const statusBox = document.getElementById('admin-status');
        const sections = document.getElementById('admin-sections');

        const api = async (path, options = {}) => {
          console.log('API call to:', path, 'with token:', token);
          const response = await fetch(path, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
              ...(options.headers || {}),
            },
          });
          console.log('Response status:', response.status);
          const data = await response.json().catch(() => null);
          if (!response.ok) {
            console.log('API error:', data);
            throw new Error(data?.message || 'Request failed.');
          }
          return data;
        };

        const formatMoney = (value) =>
          new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(value || 0));

        function renderSection(title, items, renderItem) {
          return \`
            <section class="info-card">
              <h3>\${title}</h3>
              <div class="stack" style="margin-top: 14px;">
                \${items.length ? items.map(renderItem).join('') : '<p class="muted">No data available.</p>'}
              </div>
            </section>
          \`;
        }

        async function loadDashboard() {
          const dashboard = await api('/admin/api/dashboard');
          document.getElementById('metric-users').textContent = String(dashboard.summary.users);
          document.getElementById('metric-auctions').textContent = String(dashboard.summary.auctions);
          document.getElementById('metric-disputes').textContent = String(dashboard.summary.disputes);
          summary.textContent = 'Live administrative overview';

          sections.innerHTML = [
            renderSection('Users', dashboard.users.slice(0, 6), (user) => \`
              <div>
                <strong>\${user.displayName || user.email}</strong>
                <div class="muted">\${user.email} | \${user.role} | \${user.isActive ? 'Active' : 'Suspended'}</div>
                <div class="toolbar" style="margin-top: 10px;">
                  <button class="button button-secondary" type="button" data-user-id="\${user.id}" data-user-active="\${user.isActive ? 'false' : 'true'}">\${user.isActive ? 'Suspend user' : 'Reactivate user'}</button>
                </div>
              </div>
            \`),
            renderSection('Auctions', dashboard.auctions.slice(0, 6), (auction) => \`
              <div>
                <strong>\${auction.title}</strong>
                <div class="muted">\${auction.status} | Seller: \${auction.seller.displayName || auction.seller.email}</div>
                <div class="toolbar" style="margin-top: 10px;">
                  <button class="button button-secondary" type="button" data-auction-id="\${auction.id}" data-auction-status="CANCELLED">Cancel auction</button>
                  <button class="button button-ghost" type="button" data-auction-id="\${auction.id}" data-auction-status="ACTIVE">Set active</button>
                </div>
              </div>
            \`),
            renderSection('Disputes', dashboard.disputes.slice(0, 6), (dispute) => \`
              <div>
                <strong>Auction #\${dispute.auction.id}: \${dispute.auction.title}</strong>
                <div class="muted">\${dispute.status} | Raised by \${dispute.raisedBy.displayName || dispute.raisedBy.email}</div>
                <div class="toolbar" style="margin-top: 10px;">
                  <button class="button button-secondary" type="button" data-dispute-id="\${dispute.id}" data-status="UNDER_REVIEW">Under review</button>
                  <button class="button button-ghost" type="button" data-dispute-id="\${dispute.id}" data-status="RESOLVED" data-resolution="FAVOUR_BUYER">Favor buyer</button>
                  <button class="button button-ghost" type="button" data-dispute-id="\${dispute.id}" data-status="RESOLVED" data-resolution="FAVOUR_SELLER">Favor seller</button>
                  <button class="button button-ghost" type="button" data-dispute-id="\${dispute.id}" data-status="CLOSED" data-resolution="NO_ACTION">Close</button>
                </div>
              </div>
            \`),
            renderSection('Payments', dashboard.payments.slice(0, 6), (payment) => \`<div><strong>\${payment.auction?.title || 'Auction payment'}</strong><div class="muted">\${formatMoney(payment.amount)} | \${payment.status} | Payer: \${payment.payer.displayName || payment.payer.email}</div></div>\`),
          ].join('');

          sections.querySelectorAll('button[data-dispute-id]').forEach((button) => {
            button.addEventListener('click', async () => {
              try {
                await api(\`/admin/disputes/\${button.dataset.disputeId}/resolve\`, {
                  method: 'PATCH',
                  body: JSON.stringify({
                    status: button.dataset.status,
                    resolution: button.dataset.resolution || undefined,
                    resolutionNotes: 'Updated via admin dashboard',
                  }),
                });
                await loadDashboard();
              } catch (error) {
                statusBox.className = 'status error visible';
                statusBox.textContent = error instanceof Error ? error.message : 'Unable to update dispute.';
              }
            });
          });

          sections.querySelectorAll('button[data-user-id]').forEach((button) => {
            button.addEventListener('click', async () => {
              try {
                await api(\`/admin/users/\${button.dataset.userId}/status\`, {
                  method: 'PATCH',
                  body: JSON.stringify({
                    isActive: button.dataset.userActive === 'true',
                  }),
                });
                await loadDashboard();
              } catch (error) {
                statusBox.className = 'status error visible';
                statusBox.textContent = error instanceof Error ? error.message : 'Unable to update user.';
              }
            });
          });

          sections.querySelectorAll('button[data-auction-id]').forEach((button) => {
            button.addEventListener('click', async () => {
              try {
                await api(\`/admin/auctions/\${button.dataset.auctionId}/status\`, {
                  method: 'PATCH',
                  body: JSON.stringify({
                    status: button.dataset.auctionStatus,
                  }),
                });
                await loadDashboard();
              } catch (error) {
                statusBox.className = 'status error visible';
                statusBox.textContent = error instanceof Error ? error.message : 'Unable to update auction.';
              }
            });
          });
        }

        if (!token) {
          authWarning.style.display = 'block';
        } else {
          content.style.display = 'block';
          loadDashboard().catch((error) => {
            statusBox.className = 'status error visible';
            statusBox.textContent = error instanceof Error ? error.message : 'Unable to load admin dashboard.';
          });
        }
      </script>`,
    });
  }
}
