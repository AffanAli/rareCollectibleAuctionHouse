import { Injectable } from '@nestjs/common';
import { renderSitePage } from 'src/ui/site-page';

@Injectable()
export class NotificationsUiService {
  getNotificationsPage(): string {
    return renderSitePage({
      title: 'Notifications | Rare Collectible Auction House',
      description:
        'Review auction updates, outbid alerts, messages, and results in one place.',
      activePath: '/notifications',
      body: `<main class="shell">
        <section class="hero">
          <div class="reveal delay-1">
            <span class="eyebrow">Notifications</span>
            <h1>Stay on top of bids, messages, and auction results.</h1>
            <p>
              Your notification center keeps key marketplace events visible, including outbid alerts,
              new messages, and ended auction outcomes.
            </p>
            <div class="hero-actions">
              <a class="button button-primary" href="/marketplace">Browse auctions</a>
              <button class="button button-secondary" id="mark-all-read" type="button">Mark all as read</button>
            </div>
          </div>
          <div class="hero-rail">
            <article class="panel hero-highlight reveal delay-2">
              <h2>What appears here</h2>
              <div class="highlight-list" style="margin-top: 18px;">
                <div class="highlight-item">Auction won and auction ended updates.</div>
                <div class="highlight-item">Outbid alerts and new message notifications.</div>
                <div class="highlight-item">A simple live-refresh view without push setup.</div>
              </div>
            </article>
          </div>
        </section>

        <section id="notifications-auth-warning" class="empty-state" style="display: none; margin-top: 24px;">
          <h3>Login required</h3>
          <p class="muted" style="margin-top: 10px;">Sign in first so we can load your notifications.</p>
          <div class="hero-actions" style="margin-top: 18px;">
            <a class="button button-primary" href="/login">Go to login</a>
          </div>
        </section>

        <section id="notifications-content" style="display: none; margin-top: 24px;">
          <div class="section-title reveal delay-3">
            <div>
              <div class="kicker">Notification feed</div>
              <h2>Recent activity</h2>
            </div>
            <p id="notifications-summary">Loading notifications...</p>
          </div>

          <div id="notifications-status" class="status" aria-live="polite"></div>
          <div id="notifications-list" class="stack"></div>
        </section>
      </main>
      <script>
        const token = localStorage.getItem('auctionHouseToken');
        const authWarning = document.getElementById('notifications-auth-warning');
        const content = document.getElementById('notifications-content');
        const summary = document.getElementById('notifications-summary');
        const statusBox = document.getElementById('notifications-status');
        const list = document.getElementById('notifications-list');
        const markAllReadButton = document.getElementById('mark-all-read');
        let pollingHandle = null;
        let notificationsSnapshot = '';

        const formatDate = (value) =>
          new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

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

        const buildSnapshot = (notifications) =>
          JSON.stringify(
            (notifications || []).map((notification) => ({
              id: notification.id,
              readAt: notification.readAt,
              createdAt: notification.createdAt,
            })),
          );

        function renderNotifications(notifications) {
          notificationsSnapshot = buildSnapshot(notifications);
          summary.textContent = \`\${notifications.length} notification\${notifications.length === 1 ? '' : 's'}\`;
          list.innerHTML = notifications.length
            ? notifications.map((notification) => \`
                <article class="info-card" data-id="\${notification.id}" style="\${notification.readAt ? 'opacity: 0.78;' : ''}">
                  <div class="meta">
                    <strong>\${notification.title}</strong>
                    <span>\${formatDate(notification.createdAt)}</span>
                  </div>
                  <p style="margin-top: 10px;">\${notification.body || 'No additional details provided.'}</p>
                  <div class="toolbar" style="margin-top: 14px;">
                    \${notification.auction ? \`<a class="button button-secondary" href="/marketplace/\${notification.auction.id}">Open auction</a>\` : ''}
                    \${notification.readAt ? '' : \`<button class="button button-ghost" type="button" data-read-id="\${notification.id}">Mark as read</button>\`}
                  </div>
                </article>
              \`).join('')
            : '<div class="empty-state"><p class="muted">No notifications yet.</p></div>';

          list.querySelectorAll('button[data-read-id]').forEach((button) => {
            button.addEventListener('click', async () => {
              try {
                await api(\`/notifications/\${button.dataset.readId}/read\`, { method: 'PATCH' });
                await loadNotifications();
              } catch (error) {
                statusBox.className = 'status error visible';
                statusBox.textContent = error instanceof Error ? error.message : 'Unable to update notification.';
              }
            });
          });
        }

        async function loadNotifications() {
          const notifications = await api('/notifications');
          renderNotifications(notifications);
        }

        async function pollNotifications() {
          if (document.hidden) {
            return;
          }

          try {
            const notifications = await api('/notifications');
            const nextSnapshot = buildSnapshot(notifications);
            if (nextSnapshot !== notificationsSnapshot) {
              renderNotifications(notifications);
            }
          } catch {
            // Silent polling refresh.
          }
        }

        function startPolling() {
          if (pollingHandle) {
            window.clearInterval(pollingHandle);
          }
          pollingHandle = window.setInterval(() => {
            pollNotifications();
          }, 10000);
        }

        markAllReadButton.addEventListener('click', async () => {
          try {
            await api('/notifications/read-all', { method: 'PATCH' });
            await loadNotifications();
          } catch (error) {
            statusBox.className = 'status error visible';
            statusBox.textContent = error instanceof Error ? error.message : 'Unable to mark notifications as read.';
          }
        });

        if (!token) {
          authWarning.style.display = 'block';
        } else {
          content.style.display = 'block';
          loadNotifications().catch((error) => {
            statusBox.className = 'status error visible';
            statusBox.textContent = error instanceof Error ? error.message : 'Unable to load notifications.';
          });
          startPolling();
        }

        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) {
            pollNotifications();
          }
        });

        window.addEventListener('beforeunload', () => {
          if (pollingHandle) {
            window.clearInterval(pollingHandle);
          }
        });
      </script>`,
    });
  }
}
