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
                <div class="overview-shell">
                  <div class="overview-header">
                    <div>
                      <div class="kicker">At a glance</div>
                      <h2 style="margin-top: 10px;">Marketplace pulse</h2>
                      <p class="muted" id="admin-summary" style="margin-top: 10px;">Loading dashboard...</p>
                    </div>
                    <div class="overview-actions">
                      <button class="button button-secondary button-sm" type="button" data-view="disputes">Review disputes</button>
                      <button class="button button-ghost button-sm" type="button" data-view="payments">View payments</button>
                    </div>
                  </div>

                  <div class="overview-kpis" aria-label="Key performance indicators">
                    <article class="kpi-card">
                      <div class="kpi-top">
                        <span class="kpi-label">Users</span>
                        <span class="kpi-pill" id="kpi-users-trend">All time</span>
                      </div>
                      <div class="kpi-value" id="metric-users">0</div>
                      <div class="kpi-sub" id="kpi-users-sub">Active accounts</div>
                    </article>

                    <article class="kpi-card">
                      <div class="kpi-top">
                        <span class="kpi-label">Auctions</span>
                        <span class="kpi-pill" id="kpi-auctions-active">0 active</span>
                      </div>
                      <div class="kpi-value" id="metric-auctions">0</div>
                      <div class="kpi-sub" id="kpi-auctions-sub">Ended: 0, Draft/Cancelled: 0</div>
                    </article>

                    <article class="kpi-card">
                      <div class="kpi-top">
                        <span class="kpi-label">Disputes</span>
                        <span class="kpi-pill warn" id="kpi-disputes-open">0 open</span>
                      </div>
                      <div class="kpi-value" id="metric-disputes">0</div>
                      <div class="kpi-sub" id="kpi-disputes-sub">Resolved: 0</div>
                    </article>

                    <article class="kpi-card">
                      <div class="kpi-top">
                        <span class="kpi-label">Payments</span>
                        <span class="kpi-pill" id="kpi-payments-pending">0 pending</span>
                      </div>
                      <div class="kpi-value" id="kpi-payments-total">0</div>
                      <div class="kpi-sub" id="kpi-payments-sub">Recent ended-auction payments</div>
                    </article>

                    <article class="kpi-card">
                      <div class="kpi-top">
                        <span class="kpi-label">Notifications</span>
                        <span class="kpi-pill" id="kpi-notifications-unread">0 unread</span>
                      </div>
                      <div class="kpi-value" id="kpi-notifications-total">0</div>
                      <div class="kpi-sub">Across all users</div>
                    </article>

                    <article class="kpi-card">
                      <div class="kpi-top">
                        <span class="kpi-label">Messages</span>
                        <span class="kpi-pill" id="kpi-messages-recent">Last 24h</span>
                      </div>
                      <div class="kpi-value" id="kpi-messages-total">0</div>
                      <div class="kpi-sub" id="kpi-messages-sub">Buyer/seller comms</div>
                    </article>
                  </div>

                  <div class="overview-grid">
                    <section class="overview-panel">
                      <div class="overview-panel-head">
                        <h3>Recent auctions</h3>
                        <button class="button button-ghost button-sm" type="button" data-view="auctions">Open tab</button>
                      </div>
                      <div class="overview-list" id="overview-auctions">
                        <div class="overview-row"><strong>Loading…</strong></div>
                      </div>
                    </section>
                    <section class="overview-panel">
                      <div class="overview-panel-head">
                        <h3>Needs attention</h3>
                        <button class="button button-ghost button-sm" type="button" data-view="disputes">Open tab</button>
                      </div>
                      <div class="overview-list" id="overview-attention">
                        <div class="overview-row"><strong>Loading…</strong></div>
                      </div>
                    </section>
                  </div>
                </div>
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
          background: rgba(255, 252, 247, 0.88);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid rgba(92, 70, 44, 0.14);
          height: fit-content;
          box-shadow: 0 14px 44px rgba(57, 37, 19, 0.08);
        }
        .sidebar-nav h3 {
          margin: 0 0 20px 0;
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--text, #333);
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
          background: rgba(159, 79, 47, 0.08);
          transform: translateX(2px);
        }
        .sidebar-link.active {
          background: linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%);
          color: #fff9f3;
          box-shadow: 0 12px 28px rgba(110, 49, 28, 0.18);
        }
        .admin-main {
          min-height: 500px;
        }
        .admin-view {
          background: rgba(255, 252, 247, 0.92);
          border-radius: 12px;
          border: 1px solid rgba(92, 70, 44, 0.14);
          box-shadow: 0 18px 56px rgba(57, 37, 19, 0.1);
        }
        .overview-shell {
          padding: 22px;
        }
        .overview-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
        }
        .overview-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .overview-kpis {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }
        .kpi-card {
          border-radius: 16px;
          border: 1px solid rgba(95, 108, 123, 0.12);
          background: rgba(255, 255, 255, 0.76);
          padding: 16px;
          box-shadow: 0 16px 44px rgba(57, 37, 19, 0.08);
        }
        .kpi-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .kpi-label {
          font-weight: 700;
          color: var(--text, #1f2937);
          letter-spacing: 0.01em;
        }
        .kpi-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--highlight, #1f6f78);
          background: rgba(31, 111, 120, 0.1);
          border: 1px solid rgba(31, 111, 120, 0.12);
          white-space: nowrap;
        }
        .kpi-pill.warn {
          color: var(--brand-dark, #6e311c);
          background: rgba(159, 79, 47, 0.1);
          border-color: rgba(159, 79, 47, 0.14);
        }
        .kpi-value {
          margin-top: 10px;
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--brand-dark, #6e311c);
        }
        .kpi-sub {
          margin-top: 8px;
          color: var(--muted, #5f6c7b);
          font-size: 0.9rem;
          line-height: 1.4;
        }
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 14px;
        }
        .overview-panel {
          border-radius: 16px;
          border: 1px solid rgba(95, 108, 123, 0.12);
          background: rgba(255, 255, 255, 0.76);
          padding: 16px;
          box-shadow: 0 16px 44px rgba(57, 37, 19, 0.08);
        }
        .overview-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .overview-panel h3 {
          margin: 0;
          font-size: 1.05rem;
        }
        .overview-list {
          display: grid;
          gap: 10px;
          margin-top: 12px;
        }
        .overview-row {
          padding: 12px;
          border-radius: 14px;
          border: 1px solid rgba(95, 108, 123, 0.1);
          background: rgba(255, 252, 247, 0.7);
        }
        .overview-row strong {
          display: block;
          color: var(--text, #1f2937);
        }
        .overview-row .meta {
          margin-top: 6px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          color: var(--muted, #5f6c7b);
          font-size: 0.85rem;
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
          background: linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%);
          color: #fff9f3;
          padding: 16px;
          border-radius: 14px;
          text-align: center;
          box-shadow: 0 12px 28px rgba(110, 49, 28, 0.18);
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
          .overview-header {
            align-items: flex-start;
            flex-direction: column;
          }
          .overview-kpis {
            grid-template-columns: 1fr;
          }
          .overview-grid {
            grid-template-columns: 1fr;
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
        const overviewDiv = document.getElementById('admin-overview');

        let currentView = 'overview';

        const api = async (path, options = {}) => {
          const response = await fetch(path, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
              ...(options.headers || {}),
            },
          });
          const data = await response.json().catch(() => null);
          if (!response.ok) {
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

          const users = (dashboard.users || []).filter((u) => !u.deletedAt);
          const auctions = (dashboard.auctions || []).filter((a) => !a.deletedAt);
          const disputes = (dashboard.disputes || []).filter((d) => !d.deletedAt);
          const payments = (dashboard.payments || []).filter((p) => !p.deletedAt);
          const notifications = (dashboard.notifications || []).filter((n) => !n.deletedAt);
          const messages = (dashboard.messages || []).filter((m) => !m.deletedAt);

          const activeAuctions = auctions.filter((a) => a.status === 'ACTIVE').length;
          const endedAuctions = auctions.filter((a) => a.status === 'ENDED').length;
          const cancelledOrDraft = auctions.filter((a) => a.status === 'DRAFT' || a.status === 'CANCELLED').length;
          const openDisputes = disputes.filter((d) => d.status === 'OPEN' || d.status === 'UNDER_REVIEW').length;
          const resolvedDisputes = disputes.filter((d) => d.status === 'RESOLVED' || d.status === 'CLOSED').length;
          const pendingPayments = payments.filter((p) => p.status === 'PENDING').length;
          const unreadNotifications = notifications.filter((n) => !n.readAt).length;
          const last24Hours = Date.now() - 24 * 60 * 60 * 1000;
          const messages24h = messages.filter((m) => new Date(m.createdAt).getTime() >= last24Hours).length;

          const kpiAuctionsActive = document.getElementById('kpi-auctions-active');
          const kpiAuctionsSub = document.getElementById('kpi-auctions-sub');
          const kpiDisputesOpen = document.getElementById('kpi-disputes-open');
          const kpiDisputesSub = document.getElementById('kpi-disputes-sub');
          const kpiPaymentsPending = document.getElementById('kpi-payments-pending');
          const kpiPaymentsTotal = document.getElementById('kpi-payments-total');
          const kpiNotificationsUnread = document.getElementById('kpi-notifications-unread');
          const kpiNotificationsTotal = document.getElementById('kpi-notifications-total');
          const kpiMessagesTotal = document.getElementById('kpi-messages-total');
          const kpiMessagesSub = document.getElementById('kpi-messages-sub');

          if (kpiAuctionsActive) kpiAuctionsActive.textContent = \`\${activeAuctions} active\`;
          if (kpiAuctionsSub) kpiAuctionsSub.textContent = \`Ended: \${endedAuctions}, Draft/Cancelled: \${cancelledOrDraft}\`;
          if (kpiDisputesOpen) kpiDisputesOpen.textContent = \`\${openDisputes} open\`;
          if (kpiDisputesSub) kpiDisputesSub.textContent = \`Resolved: \${resolvedDisputes}\`;
          if (kpiPaymentsPending) kpiPaymentsPending.textContent = \`\${pendingPayments} pending\`;
          if (kpiPaymentsTotal) kpiPaymentsTotal.textContent = String(payments.length);
          if (kpiNotificationsUnread) kpiNotificationsUnread.textContent = \`\${unreadNotifications} unread\`;
          if (kpiNotificationsTotal) kpiNotificationsTotal.textContent = String(notifications.length);
          if (kpiMessagesTotal) kpiMessagesTotal.textContent = String(messages.length);
          if (kpiMessagesSub) kpiMessagesSub.textContent = \`\${messages24h} message\${messages24h === 1 ? '' : 's'} in the last 24h\`;

          summary.textContent = \`System status: Operational. \${activeAuctions} live auction\${activeAuctions === 1 ? '' : 's'} running.\`;

          const overviewAuctions = document.getElementById('overview-auctions');
          const overviewAttention = document.getElementById('overview-attention');

          if (overviewAuctions) {
            const recentAuctions = auctions
              .slice()
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 6);

            overviewAuctions.innerHTML = recentAuctions.length
              ? recentAuctions.map((auction) => \`
                  <div class="overview-row">
                    <strong>#\${auction.id} \${auction.title}</strong>
                    <div class="meta">
                      <span>Status: \${auction.status}</span>
                      <span>Ends: \${new Date(auction.endsAt).toLocaleString()}</span>
                      <span>Seller: \${auction.seller?.displayName || auction.seller?.email || 'N/A'}</span>
                    </div>
                  </div>
                \`).join('')
              : '<div class="overview-row"><strong>No auctions yet.</strong></div>';
          }

          if (overviewAttention) {
            const attentionItems = [];

            const attentionDisputes = disputes
              .filter((d) => d.status === 'OPEN' || d.status === 'UNDER_REVIEW')
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 4)
              .map((dispute) => ({
                title: \`Dispute #\${dispute.id}: \${dispute.auction?.title || 'Auction'}\`,
                meta: [
                  \`Status: \${dispute.status}\`,
                  \`Raised by: \${dispute.raisedBy?.displayName || dispute.raisedBy?.email || 'N/A'}\`,
                  \`Created: \${new Date(dispute.createdAt).toLocaleDateString()}\`,
                ],
              }));

            const attentionPayments = payments
              .filter((p) => p.status === 'PENDING')
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 3)
              .map((payment) => ({
                title: \`Payment #\${payment.id}: \${payment.auction?.title || 'Auction payment'}\`,
                meta: [
                  \`Amount: \${formatMoney(payment.amount)}\`,
                  \`Payer: \${payment.payer?.displayName || payment.payer?.email || 'N/A'}\`,
                  \`Created: \${new Date(payment.createdAt).toLocaleDateString()}\`,
                ],
              }));

            attentionItems.push(...attentionDisputes, ...attentionPayments);

            overviewAttention.innerHTML = attentionItems.length
              ? attentionItems.slice(0, 6).map((item) => \`
                  <div class="overview-row">
                    <strong>\${item.title}</strong>
                    <div class="meta">\${item.meta.map((m) => \`<span>\${m}</span>\`).join('')}</div>
                  </div>
                \`).join('')
              : '<div class="overview-row"><strong>No outstanding disputes or pending payments.</strong></div>';
          }

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
              formatMoney(auction.currentHighBid?.amount || auction.winningBid?.amount || auction.startingPrice || 0),
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
              \`<span class="status-\${String(dispute.status || '').toLowerCase().replaceAll('_', '-')}">\${dispute.status}</span>\`,
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
              message.recipient ? (message.recipient.displayName || message.recipient.email) : 'N/A',
              (message.body || '').length > 50 ? (message.body || '').substring(0, 50) + '...' : (message.body || ''),
              new Date(message.createdAt).toLocaleString()
            ])
          );

          document.getElementById('admin-notifications').innerHTML = renderTable(
            ['ID', 'Title', 'Message', 'User', 'Read', 'Created'],
            (dashboard.notifications?.slice(0, 50) || []).map(notification => [
              notification.id,
              notification.title,
              (notification.body || '').length > 50 ? (notification.body || '').substring(0, 50) + '...' : (notification.body || ''),
              notification.user.displayName || notification.user.email,
              notification.readAt ? 'Yes' : 'No',
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
