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
          <div class="admin-dashboard" style="display: grid; grid-template-columns: 250px 1fr; gap: 24px;">
            <aside class="admin-sidebar">
              <nav class="sidebar-nav">
                <h3 style="margin-bottom: 16px;">Dashboard</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 8px;"><button class="sidebar-link active" data-view="overview">Overview</button></li>
                  <li style="margin-bottom: 8px;"><button class="sidebar-link" data-view="users">Users</button></li>
                  <li style="margin-bottom: 8px;"><button class="sidebar-link" data-view="auctions">Auctions</button></li>
                  <li style="margin-bottom: 8px;"><button class="sidebar-link" data-view="disputes">Disputes</button></li>
                  <li style="margin-bottom: 8px;"><button class="sidebar-link" data-view="payments">Payments</button></li>
                  <li style="margin-bottom: 8px;"><button class="sidebar-link" data-view="messages">Messages</button></li>
                  <li style="margin-bottom: 8px;"><button class="sidebar-link" data-view="notifications">Notifications</button></li>
                </ul>
              </nav>
            </aside>
            <div class="admin-main">
              <div id="admin-overview" class="admin-view">
                <div class="grid grid-3" style="margin-bottom: 16px;">
                  <article class="metric-card"><span id="metric-users" class="metric">0</span><h3>Users</h3></article>
                  <article class="metric-card"><span id="metric-auctions" class="metric">0</span><h3>Auctions</h3></article>
                  <article class="metric-card"><span id="metric-disputes" class="metric">0</span><h3>Disputes</h3></article>
                </div>
                <p id="admin-summary" style="font-size: 14px; color: #666; margin: 0;">System status: Operational</p>
              </div>
              <div id="admin-users" class="admin-view" style="display: none;"></div>
              <div id="admin-auctions" class="admin-view" style="display: none;"></div>
              <div id="admin-disputes" class="admin-view" style="display: none;"></div>
              <div id="admin-payments" class="admin-view" style="display: none;"></div>
              <div id="admin-messages" class="admin-view" style="display: none;"></div>
              <div id="admin-notifications" class="admin-view" style="display: none;"></div>
            </div>
          </div>
          <div id="admin-status" class="status" aria-live="polite" style="margin-top: 24px;"></div>
        </section>
      </main>
      <style>
        .admin-dashboard {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
          min-height: 600px;
        }
        .admin-sidebar {
          background: var(--color-surface, #f8f9fa);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid var(--color-border, #e9ecef);
          height: fit-content;
        }
        .sidebar-nav h3 {
          margin: 0 0 20px 0;
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--color-text, #333);
        }
        .sidebar-link {
          width: 100%;
          padding: 14px 18px;
          background: none;
          border: none;
          text-align: left;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .sidebar-link:hover {
          background: var(--color-hover, #e9ecef);
          transform: translateX(2px);
        }
        .sidebar-link.active {
          background: var(--color-primary, #007bff);
          color: white;
          box-shadow: 0 2px 8px rgba(0,123,255,0.2);
        }
        .admin-main {
          min-height: 500px;
        }
        .admin-view {
          background: var(--color-surface, #ffffff);
          border-radius: 12px;
          border: 1px solid var(--color-border, #e9ecef);
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .table-container {
          overflow-x: auto;
          padding: 24px;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }
        .data-table th {
          background: var(--color-surface, #f8f9fa);
          padding: 16px 12px;
          text-align: left;
          font-weight: 600;
          color: var(--color-text, #333);
          border-bottom: 2px solid var(--color-border, #e9ecef);
          position: sticky;
          top: 0;
        }
        .data-table td {
          padding: 14px 12px;
          border-bottom: 1px solid var(--color-border, #e9ecef);
          vertical-align: middle;
        }
        .data-table tr:hover {
          background: var(--color-hover, #f8f9fa);
        }
        .status-active {
          color: #28a745;
          font-weight: 600;
        }
        .status-inactive {
          color: #dc3545;
          font-weight: 600;
        }
        .status-draft, .status-pending {
          color: #ffc107;
          font-weight: 600;
        }
        .status-active {
          color: #28a745;
          font-weight: 600;
        }
        .status-ended, .status-completed, .status-resolved, .status-closed {
          color: #6c757d;
          font-weight: 600;
        }
        .status-cancelled, .status-failed {
          color: #dc3545;
          font-weight: 600;
        }
        .status-under-review {
          color: #ffc107;
          font-weight: 600;
        }
        .button-sm {
          padding: 6px 12px;
          font-size: 0.8rem;
          border-radius: 4px;
        }
        .action-buttons {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .metric-card {
          background: linear-gradient(135deg, var(--color-primary, #007bff) 0%, var(--color-primary-dark, #0056b3) 100%);
          color: white;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,123,255,0.15);
        }
        .metric-card h3 {
          margin: 4px 0 0 0;
          font-size: 0.8rem;
          font-weight: 500;
          opacity: 0.9;
        }
        .metric {
          font-size: 2rem;
          font-weight: 700;
          display: block;
          margin-bottom: 2px;
        }
        .status {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-block;
          margin: 4px 0;
        }
        .status.visible {
          display: inline-block;
        }
        .status.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .status.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        @media (max-width: 768px) {
          .admin-dashboard {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .admin-sidebar {
            order: 2;
          }
          .table-container {
            padding: 16px;
          }
          .data-table th, .data-table td {
            padding: 8px 6px;
            font-size: 0.8rem;
          }
        }
      </style>
      <script>
        const token = localStorage.getItem('auctionHouseToken');
        const authWarning = document.getElementById('admin-auth-warning');
        const content = document.getElementById('admin-content');
        const summary = document.getElementById('admin-summary');
        const statusBox = document.getElementById('admin-status');

        let currentView = 'overview';

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

        function renderTable(headers, rows, actions = []) {
          return \`
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    \${headers.map(h => \`<th>\${h}</th>\`).join('')}
                    \${actions.length ? '<th>Actions</th>' : ''}
                  </tr>
                </thead>
                <tbody>
                  \${rows.map((row, index) => \`
                    <tr>
                      \${row.map(cell => \`<td>\${cell}</td>\`).join('')}
                      \${actions.length ? \`<td>\${actions[index] || ''}</td>\` : ''}
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          \`;
        }

        function showView(view) {
          document.querySelectorAll('.admin-view').forEach(el => el.style.display = 'none');
          document.querySelectorAll('.sidebar-link').forEach(btn => btn.classList.remove('active'));
          document.querySelector(\`[data-view="\${view}"]\`).classList.add('active');
          document.getElementById(\`admin-\${view}\`).style.display = 'block';
          currentView = view;
        }

        async function loadDashboard() {
          const dashboard = await api('/admin/api/dashboard');
          document.getElementById('metric-users').textContent = String(dashboard.summary.users);
          document.getElementById('metric-auctions').textContent = String(dashboard.summary.auctions);
          document.getElementById('metric-disputes').textContent = String(dashboard.summary.disputes);

          summary.textContent = 'System status: Operational';

          // Populate individual views
          const usersDiv = document.getElementById('admin-users');
          const userActions = dashboard.users.slice(0, 50).map(user => \`
            <button class="button button-sm button-secondary" type="button" data-user-id="\${user.id}" data-user-active="\${user.isActive ? 'false' : 'true'}">\${user.isActive ? 'Suspend' : 'Activate'}</button>
          \`);
          usersDiv.innerHTML = renderTable(
            ['ID', 'Name', 'Email', 'Role', 'Status', 'Joined'],
            dashboard.users.slice(0, 50).map(user => [
              user.id,
              user.displayName || 'N/A',
              user.email,
              user.role,
              user.isActive ? '<span class="status-active">Active</span>' : '<span class="status-inactive">Suspended</span>',
              new Date(user.createdAt).toLocaleDateString()
            ]),
            userActions
          );

          const auctionsDiv = document.getElementById('admin-auctions');
          const auctionActions = dashboard.auctions.slice(0, 50).map(auction => \`
            <div class="action-buttons">
              <button class="button button-sm button-ghost" type="button" data-auction-id="\${auction.id}" data-auction-status="CANCELLED">Cancel</button>
              <button class="button button-sm button-secondary" type="button" data-auction-id="\${auction.id}" data-auction-status="ACTIVE">Activate</button>
            </div>
          \`);
          auctionsDiv.innerHTML = renderTable(
            ['ID', 'Title', 'Status', 'Seller', 'Current Bid', 'Ends'],
            dashboard.auctions.slice(0, 50).map(auction => [
              auction.id,
              auction.title,
              \`<span class="status-\${auction.status.toLowerCase()}">\${auction.status}</span>\`,
              auction.seller.displayName || auction.seller.email,
              formatMoney(auction.currentBid || 0),
              new Date(auction.endsAt).toLocaleString()
            ]),
            auctionActions
          );

          const disputesDiv = document.getElementById('admin-disputes');
          const disputeActions = dashboard.disputes.slice(0, 50).map(dispute => \`
            <div class="action-buttons">
              <button class="button button-sm button-ghost" type="button" data-dispute-id="\${dispute.id}" data-status="UNDER_REVIEW">Review</button>
              <button class="button button-sm button-secondary" type="button" data-dispute-id="\${dispute.id}" data-status="RESOLVED" data-resolution="FAVOUR_BUYER">Favor Buyer</button>
              <button class="button button-sm button-secondary" type="button" data-dispute-id="\${dispute.id}" data-status="RESOLVED" data-resolution="FAVOUR_SELLER">Favor Seller</button>
              <button class="button button-sm button-ghost" type="button" data-dispute-id="\${dispute.id}" data-status="CLOSED" data-resolution="NO_ACTION">Close</button>
            </div>
          \`);
          disputesDiv.innerHTML = renderTable(
            ['ID', 'Auction', 'Status', 'Raised By', 'Created'],
            dashboard.disputes.slice(0, 50).map(dispute => [
              dispute.id,
              dispute.auction.title,
              \`<span class="status-\${dispute.status.toLowerCase().replace(' ', '-')}">\${dispute.status}</span>\`,
              dispute.raisedBy.displayName || dispute.raisedBy.email,
              new Date(dispute.createdAt).toLocaleDateString()
            ]),
            disputeActions
          );

          document.getElementById('admin-payments').innerHTML = renderTable(
            ['ID', 'Auction', 'Amount', 'Status', 'Payer', 'Payee', 'Created'],
            dashboard.payments.slice(0, 50).map(payment => [
              payment.id,
              payment.auction?.title || 'N/A',
              formatMoney(payment.amount),
              \`<span class="status-\${payment.status.toLowerCase()}">\${payment.status}</span>\`,
              payment.payer.displayName || payment.payer.email,
              payment.payee.displayName || payment.payee.email,
              new Date(payment.createdAt).toLocaleDateString()
            ])
          );

          document.getElementById('admin-messages').innerHTML = renderTable(
            ['ID', 'From', 'To', 'Content', 'Sent'],
            (dashboard.messages?.slice(0, 50) || []).map(message => [
              message.id,
              message.sender.displayName || message.sender.email,
              message.recipient.displayName || message.recipient.email,
              message.content.length > 50 ? message.content.substring(0, 50) + '...' : message.content,
              new Date(message.createdAt).toLocaleString()
            ])
          );

          document.getElementById('admin-notifications').innerHTML = renderTable(
            ['ID', 'Title', 'Message', 'User', 'Read', 'Created'],
            (dashboard.notifications?.slice(0, 50) || []).map(notification => [
              notification.id,
              notification.title,
              notification.message.length > 50 ? notification.message.substring(0, 50) + '...' : notification.message,
              notification.user.displayName || notification.user.email,
              notification.isRead ? 'Yes' : 'No',
              new Date(notification.createdAt).toLocaleDateString()
            ])
          );

          // Add event listeners
          document.querySelectorAll('.sidebar-link').forEach(btn => {
            btn.addEventListener('click', () => showView(btn.dataset.view));
          });

          disputesDiv.querySelectorAll('button[data-dispute-id]').forEach((button) => {
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

          usersDiv.querySelectorAll('button[data-user-id]').forEach((button) => {
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

          auctionsDiv.querySelectorAll('button[data-auction-id]').forEach((button) => {
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
