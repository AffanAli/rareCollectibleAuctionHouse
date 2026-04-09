import { Injectable } from '@nestjs/common';
import { renderSitePage } from 'src/ui/site-page';

@Injectable()
export class BidsUiService {
  getMyBidsPage(): string {
    return renderSitePage({
      title: 'My Bids | Rare Collectible Auction House',
      description:
        'Track the bids you have placed across collectible auctions and monitor your participation.',
      activePath: '/bids',
      body: `<main class="shell">
        <section class="hero">
          <div class="reveal delay-1">
            <span class="eyebrow">Bid tracking</span>
            <h1>Review every bid you have placed across the marketplace.</h1>
            <p>
              Keep an eye on your auction activity, compare amounts, and jump back into the listing details
              when you want to stay competitive.
            </p>
            <div class="hero-actions">
              <a class="button button-primary" href="/marketplace">Browse auctions</a>
              <a class="button button-secondary" href="/profile">Profile</a>
            </div>
          </div>
          <div class="hero-rail">
            <article class="panel hero-highlight reveal delay-2">
              <h2>What you can track</h2>
              <div class="highlight-list" style="margin-top: 18px;">
                <div class="highlight-item">Every bid amount and its timestamp.</div>
                <div class="highlight-item">Quick links back to the auction where you bid.</div>
                <div class="highlight-item">A simple history view for active and completed auctions.</div>
              </div>
            </article>
          </div>
        </section>

        <section id="bids-auth-warning" class="empty-state" style="display: none; margin-top: 24px;">
          <h3>Login required</h3>
          <p class="muted" style="margin-top: 10px;">
            Sign in first so we can load your bid history.
          </p>
          <div class="hero-actions" style="margin-top: 18px;">
            <a class="button button-primary" href="/login">Go to login</a>
          </div>
        </section>

        <section id="bids-content" style="display: none;">
          <div class="section-title reveal delay-3">
            <div>
              <div class="kicker">My activity</div>
              <h2>Recent bids</h2>
            </div>
            <p id="bids-summary">Loading your bids...</p>
          </div>

          <section class="table-card reveal delay-4">
            <div id="bids-status" class="status" aria-live="polite"></div>
            <table>
              <thead>
                <tr>
                  <th>Auction</th>
                  <th>Amount</th>
                  <th>Placed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="bids-table"></tbody>
            </table>
          </section>

          <section id="bids-empty" class="empty-state reveal delay-4" style="display: none; margin-top: 22px;">
            <h3>No bids yet</h3>
            <p class="muted" style="margin-top: 10px;">
              Start browsing the marketplace and place your first bid on an active auction.
            </p>
          </section>
        </section>
      </main>
      <script>
        const token = localStorage.getItem('auctionHouseToken');
        const authWarning = document.getElementById('bids-auth-warning');
        const bidsContent = document.getElementById('bids-content');
        const bidsTable = document.getElementById('bids-table');
        const bidsEmpty = document.getElementById('bids-empty');
        const bidsSummary = document.getElementById('bids-summary');
        const bidsStatus = document.getElementById('bids-status');

        const formatMoney = (value) =>
          new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(value || 0));
        const formatDate = (value) =>
          new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

        async function loadBids() {
          const response = await fetch('/users/me/bids', {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          });
          const bids = await response.json().catch(() => null);

          if (!response.ok) {
            throw new Error(bids?.message || 'Unable to load your bids.');
          }

          bidsTable.innerHTML = '';

          if (!Array.isArray(bids) || bids.length === 0) {
            bidsSummary.textContent = '0 bids placed';
            bidsEmpty.style.display = 'block';
            return;
          }

          bidsEmpty.style.display = 'none';
          bidsSummary.textContent = \`\${bids.length} bid\${bids.length === 1 ? '' : 's'} placed\`;
          bidsTable.innerHTML = bids.map((bid) => \`
            <tr>
              <td>
                <strong>\${bid.auction.title}</strong>
                <div class="muted">Auction #\${bid.auction.id}</div>
              </td>
              <td>\${formatMoney(bid.amount)}</td>
              <td>\${formatDate(bid.createdAt)}</td>
              <td>
                <a class="button button-secondary" href="/marketplace/\${bid.auction.id}">View auction</a>
              </td>
            </tr>
          \`).join('');
        }

        if (!token) {
          authWarning.style.display = 'block';
        } else {
          bidsContent.style.display = 'block';
          loadBids().catch((error) => {
            bidsStatus.className = 'status error visible';
            bidsStatus.textContent = error instanceof Error ? error.message : 'Something went wrong.';
          });
        }
      </script>`,
    });
  }
}
