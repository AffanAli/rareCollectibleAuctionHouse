import { Injectable } from '@nestjs/common';
import { renderSitePage } from 'src/ui/site-page';

@Injectable()
export class AuctionsUiService {
  getMarketplacePage(): string {
    return renderSitePage({
      title: 'Marketplace | Rare Collectible Auction House',
      description:
        'Browse rare collectible auctions, search listings, and inspect auction details before bidding begins.',
      activePath: '/marketplace',
      body: `<main class="shell">
        <section class="hero">
          <div class="reveal delay-1">
            <span class="eyebrow">Public marketplace</span>
            <h1>Explore curated rare collectible listings with confidence.</h1>
            <p>
              Discover detailed seller listings with timing, condition, provenance, image galleries,
              and structured pricing information in one polished browsing experience.
            </p>
            <div class="hero-actions">
              <a class="button button-primary" href="/seller/auctions/new">Create a listing</a>
              <a class="button button-secondary" href="/login">Log in to manage auctions</a>
            </div>
            <div class="hero-foot">
              <span class="chip">Search by keyword</span>
              <span class="chip">Browse by category</span>
              <span class="chip">Inspect condition and provenance</span>
            </div>
          </div>
          <div class="hero-rail">
            <article class="panel hero-highlight reveal delay-2">
              <h2>What buyers can review</h2>
              <div class="highlight-list" style="margin-top: 18px;">
                <div class="highlight-item">Category and condition details for quick comparison.</div>
                <div class="highlight-item">Listing schedule, reserve context, and starting price.</div>
                <div class="highlight-item">Seller identity, shipping notes, provenance, and images.</div>
              </div>
            </article>
          </div>
        </section>

        <section class="panel reveal delay-2" style="margin-top: 24px;">
          <div class="section-title" style="margin-top: 0; margin-bottom: 0;">
            <div>
              <div class="kicker">Find auctions</div>
              <h2>Search the marketplace</h2>
            </div>
            <p>Use a keyword, category, or status filter to narrow down the listings you want to inspect.</p>
          </div>
          <form id="marketplace-filters" style="margin-top: 20px;">
            <div class="field-grid-3">
              <label>
                Keyword
                <input type="text" name="q" placeholder="Vintage watch, rare card, signed memorabilia..." />
              </label>
              <label>
                Category
                <input type="text" name="category" placeholder="Watches, Cards, Comics..." />
              </label>
              <label>
                Status
                <select name="status">
                  <option value="">Active and ended</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ENDED">Ended</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </label>
            </div>
            <div class="toolbar">
              <button class="button-primary" type="submit">Apply filters</button>
              <button class="button-secondary" id="reset-filters" type="button">Reset</button>
            </div>
          </form>
        </section>

        <section class="section-title reveal delay-3">
          <div>
            <div class="kicker">Listings</div>
            <h2>Available auctions</h2>
          </div>
          <p id="results-summary">Loading public listings...</p>
        </section>

        <div id="results" class="list-grid reveal delay-4"></div>
        <div id="empty-state" class="empty-state reveal delay-4" style="display: none; margin-top: 22px;">
          <h3>No auctions matched those filters</h3>
          <p class="muted" style="margin-top: 10px;">
            Try a broader keyword, clear the status filter, or create the first listing in a new niche.
          </p>
        </div>
      </main>
      <script>
        const filtersForm = document.getElementById('marketplace-filters');
        const results = document.getElementById('results');
        const emptyState = document.getElementById('empty-state');
        const summary = document.getElementById('results-summary');
        const resetButton = document.getElementById('reset-filters');

        const formatMoney = (value) =>
          new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(value || 0));
        const formatDate = (value) =>
          new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

        const createAuctionCard = (auction) => {
          const primaryImage = auction.images?.[0]?.url;
          return \`
            <article class="auction-card">
              <div class="media-frame">
                \${primaryImage ? \`<img src="\${primaryImage}" alt="\${auction.title}" />\` : '<span>No image provided yet</span>'}
              </div>
              <div class="auction-card-body">
                <div class="pill-row">
                  <span class="badge">\${auction.status}</span>
                  <span class="chip">\${auction.category}</span>
                </div>
                <div>
                  <h3>\${auction.title}</h3>
                  <p class="muted" style="margin-top: 8px;">\${auction.description.slice(0, 130)}\${auction.description.length > 130 ? '...' : ''}</p>
                </div>
                <div class="meta">
                  <span>Condition: \${auction.itemCondition}</span>
                  <span>Location: \${auction.location}</span>
                </div>
                <div class="meta">
                  <span>Starts: \${formatDate(auction.startsAt)}</span>
                  <span>Ends: \${formatDate(auction.endsAt)}</span>
                </div>
                <div class="meta">
                  <strong>Opening price: \${formatMoney(auction.startingPrice)}</strong>
                </div>
                <div class="toolbar">
                  <a class="button button-primary" href="/marketplace/\${auction.id}">View details</a>
                </div>
              </div>
            </article>
          \`;
        };

        async function loadAuctions() {
          const formData = new FormData(filtersForm);
          const params = new URLSearchParams();

          for (const [key, value] of formData.entries()) {
            if (String(value).trim()) params.set(key, String(value).trim());
          }

          summary.textContent = 'Loading public listings...';

          const response = await fetch(\`/auctions?\${params.toString()}\`);
          const auctions = await response.json();

          results.innerHTML = '';

          if (!Array.isArray(auctions) || auctions.length === 0) {
            summary.textContent = '0 auctions found';
            emptyState.style.display = 'block';
            return;
          }

          emptyState.style.display = 'none';
          summary.textContent = \`\${auctions.length} auction\${auctions.length === 1 ? '' : 's'} found\`;
          results.innerHTML = auctions.map(createAuctionCard).join('');
        }

        filtersForm.addEventListener('submit', (event) => {
          event.preventDefault();
          loadAuctions().catch(() => {
            summary.textContent = 'Unable to load auctions right now.';
          });
        });

        resetButton.addEventListener('click', () => {
          filtersForm.reset();
          loadAuctions().catch(() => {
            summary.textContent = 'Unable to load auctions right now.';
          });
        });

        loadAuctions().catch(() => {
          summary.textContent = 'Unable to load auctions right now.';
        });
      </script>`,
    });
  }

  getMarketplaceAuctionPage(auctionId: number): string {
    return renderSitePage({
      title: `Auction #${auctionId} | Rare Collectible Auction House`,
      description: 'Inspect auction details, images, provenance, and seller-facing listing information.',
      activePath: '/marketplace',
      body: `<main class="shell">
        <section id="auction-detail" class="grid grid-2">
          <article class="media-card reveal delay-1">
            <div id="gallery-primary" class="media-frame" style="aspect-ratio: 4 / 3;">
              <span>Loading auction images...</span>
            </div>
          </article>
          <article class="panel reveal delay-2">
            <span class="eyebrow">Auction detail</span>
            <h1 id="auction-title" style="font-size: clamp(2rem, 5vw, 3.2rem);">Loading auction...</h1>
            <p id="auction-description" class="lead">Fetching auction detail.</p>
            <div id="auction-pills" class="pill-row" style="margin-top: 18px;"></div>
            <div id="auction-meta" class="grid grid-2" style="margin-top: 22px;"></div>
            <section class="info-card" style="margin-top: 22px;">
              <div class="kicker">Bidding</div>
              <h3 style="margin-top: 10px;">Place a bid</h3>
              <p class="muted" id="bidding-summary" style="margin-top: 10px;">
                Loading bid history...
              </p>
              <form id="bid-form" style="margin-top: 18px;">
                <label>
                  Your bid amount
                  <input type="number" name="amount" min="0.01" step="0.01" placeholder="Enter your bid" />
                </label>
                <div class="toolbar">
                  <button class="button-primary" type="submit">Place bid</button>
                  <a class="button button-secondary" href="/bids">My bids</a>
                </div>
              </form>
              <div id="bid-status" class="status" aria-live="polite"></div>
            </section>
            <section class="info-card" style="margin-top: 22px;">
              <div class="kicker">Messaging</div>
              <h3 style="margin-top: 10px;">Contact the seller</h3>
              <p class="muted" id="message-summary" style="margin-top: 10px;">
                Ask questions about provenance, shipping, or item condition before you bid.
              </p>
              <form id="message-form" style="margin-top: 18px;">
                <label>
                  Your message
                  <textarea name="body" placeholder="Hi, could you confirm the item's condition and shipping details?"></textarea>
                </label>
                <div class="toolbar">
                  <button class="button-primary" type="submit">Send to seller</button>
                  <a class="button button-secondary" href="/messages">Open inbox</a>
                </div>
              </form>
              <div id="message-status" class="status" aria-live="polite"></div>
            </section>
            <div class="hero-actions" style="margin-top: 24px;">
              <a class="button button-secondary" href="/marketplace">Back to marketplace</a>
              <a class="button button-primary" href="/bids">Track my bids</a>
            </div>
          </article>
        </section>

        <section class="grid grid-2" style="margin-top: 24px;">
          <article class="info-card reveal delay-3">
            <div class="kicker">Seller notes</div>
            <h3 style="margin-top: 10px;">Provenance</h3>
            <p id="auction-provenance" class="muted" style="margin-top: 10px;">Loading provenance...</p>
          </article>
          <article class="info-card reveal delay-4">
            <div class="kicker">Logistics</div>
            <h3 style="margin-top: 10px;">Shipping and dispatch</h3>
            <p id="auction-shipping" class="muted" style="margin-top: 10px;">Loading shipping notes...</p>
          </article>
        </section>

        <section class="section-title reveal delay-4">
          <div>
            <div class="kicker">Bid history</div>
            <h2>Recent bids on this auction</h2>
          </div>
          <p>See the latest activity and the current leading amount for this listing.</p>
        </section>
        <section id="bid-history" class="table-card">
          <table>
            <thead>
              <tr>
                <th>Bidder</th>
                <th>Amount</th>
                <th>Placed</th>
              </tr>
            </thead>
            <tbody id="bid-history-body"></tbody>
          </table>
        </section>

        <section class="section-title reveal delay-4" style="margin-top: 24px;">
          <div>
            <div class="kicker">Gallery</div>
            <h2>Additional listing images</h2>
          </div>
          <p>Each image is pulled from the seller-managed listing gallery.</p>
        </section>
        <div id="gallery-grid" class="list-grid"></div>
        <div id="auction-error" class="status error" style="display: none;"></div>
      </main>
      <script>
        const auctionId = ${auctionId};
        const token = localStorage.getItem('auctionHouseToken');
        const title = document.getElementById('auction-title');
        const description = document.getElementById('auction-description');
        const pills = document.getElementById('auction-pills');
        const meta = document.getElementById('auction-meta');
        const provenance = document.getElementById('auction-provenance');
        const shipping = document.getElementById('auction-shipping');
        const galleryPrimary = document.getElementById('gallery-primary');
        const galleryGrid = document.getElementById('gallery-grid');
        const bidHistoryBody = document.getElementById('bid-history-body');
        const biddingSummary = document.getElementById('bidding-summary');
        const bidForm = document.getElementById('bid-form');
        const bidStatus = document.getElementById('bid-status');
        const messageForm = document.getElementById('message-form');
        const messageStatus = document.getElementById('message-status');
        const errorBox = document.getElementById('auction-error');

        const formatMoney = (value) =>
          new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(value || 0));
        const formatDate = (value) =>
          new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

        const setBidStatus = (message, type = 'success') => {
          bidStatus.className = \`status \${type} visible\`;
          bidStatus.textContent = message;
        };

        const setMessageStatus = (message, type = 'success') => {
          messageStatus.className = \`status \${type} visible\`;
          messageStatus.textContent = message;
        };

        async function loadBidHistory() {
          const response = await fetch(\`/auctions/\${auctionId}/bids\`);
          const summary = await response.json().catch(() => null);

          if (!response.ok || !summary) {
            throw new Error(summary?.message || 'Unable to load bidding data.');
          }

          const current = summary.currentHighBid
            ? \`Current high bid: \${formatMoney(summary.currentHighBid.amount)}\`
            : 'No bids yet. You can open the bidding.';
          biddingSummary.textContent = \`\${current} Minimum next bid: \${formatMoney(summary.minimumNextBid)}.\`;
          bidForm.amount.min = summary.minimumNextBid;
          bidForm.amount.placeholder = summary.minimumNextBid.toFixed(2);

          bidHistoryBody.innerHTML = (summary.recentBids || []).map((bid) => \`
            <tr>
              <td>\${bid.bidder.displayName}</td>
              <td>\${formatMoney(bid.amount)}</td>
              <td>\${formatDate(bid.createdAt)}</td>
            </tr>
          \`).join('');

          if ((summary.recentBids || []).length === 0) {
            bidHistoryBody.innerHTML = '<tr><td colspan="3">No bids placed yet.</td></tr>';
          }
        }

        async function loadAuction() {
          const response = await fetch(\`/auctions/\${auctionId}\`);
          const auction = await response.json().catch(() => null);

          if (!response.ok || !auction) {
            throw new Error(auction?.message || 'Unable to load this auction.');
          }

          const primaryImage = auction.images?.[0]?.url;
          const resultText = auction.status === 'ENDED'
            ? (auction.winningBid
              ? \`Won by \${auction.winningBid.bidder.displayName} at \${formatMoney(auction.winningBid.amount)}\`
              : 'Ended without a winning bidder')
            : 'Result available when the auction ends.';
          title.textContent = auction.title;
          description.textContent = auction.description;
          pills.innerHTML = \`
            <span class="badge">\${auction.status}</span>
            <span class="chip">\${auction.category}</span>
            <span class="chip">Condition: \${auction.itemCondition}</span>
            <span class="chip">Seller: \${auction.seller.displayName}</span>
          \`;
          meta.innerHTML = \`
            <div class="feature-card">
              <h3>Opening price</h3>
              <p>\${formatMoney(auction.startingPrice)}</p>
            </div>
            <div class="feature-card">
              <h3>Reserve price</h3>
              <p>\${auction.reservePrice ? formatMoney(auction.reservePrice) : 'No reserve set'}</p>
            </div>
            <div class="feature-card">
              <h3>Starts</h3>
              <p>\${formatDate(auction.startsAt)}</p>
            </div>
            <div class="feature-card">
              <h3>Ends</h3>
              <p>\${formatDate(auction.endsAt)}</p>
            </div>
            <div class="feature-card">
              <h3>Location</h3>
              <p>\${auction.location}</p>
            </div>
            <div class="feature-card">
              <h3>Listing updated</h3>
              <p>\${formatDate(auction.updatedAt)}</p>
            </div>
            <div class="feature-card">
              <h3>Auction result</h3>
              <p>\${resultText}</p>
            </div>
          \`;
          provenance.textContent = auction.provenance || 'No provenance notes were provided.';
          shipping.textContent = auction.shippingNotes || 'No shipping notes were provided.';
          if (auction.status === 'ENDED') {
            bidForm.querySelector('button[type="submit"]').disabled = true;
            bidForm.amount.disabled = true;
            biddingSummary.textContent = \`Auction closed. \${resultText}\`;
          }
          galleryPrimary.innerHTML = primaryImage
            ? \`<img src="\${primaryImage}" alt="\${auction.title}" />\`
            : '<span>No image provided yet</span>';
          galleryGrid.innerHTML = (auction.images || []).map((image) => \`
            <article class="auction-card">
              <div class="media-frame"><img src="\${image.url}" alt="\${auction.title}" /></div>
            </article>
          \`).join('');

          await loadBidHistory();
        }

        bidForm.addEventListener('submit', async (event) => {
          event.preventDefault();

          if (!token) {
            setBidStatus('Please log in before placing a bid.', 'error');
            return;
          }

          try {
            const response = await fetch(\`/auctions/\${auctionId}/bids\`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
              },
              body: JSON.stringify({
                amount: Number(bidForm.amount.value),
              }),
            });
            const result = await response.json().catch(() => null);

            if (!response.ok) {
              throw new Error(result?.message || 'Unable to place bid.');
            }

            setBidStatus('Bid placed successfully.');
            bidForm.reset();
            await loadBidHistory();
          } catch (error) {
            setBidStatus(error instanceof Error ? error.message : 'Something went wrong.', 'error');
          }
        });

        messageForm.addEventListener('submit', async (event) => {
          event.preventDefault();

          if (!token) {
            setMessageStatus('Please log in before messaging the seller.', 'error');
            return;
          }

          try {
            const response = await fetch(\`/auctions/\${auctionId}/messages\`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
              },
              body: JSON.stringify({
                body: messageForm.body.value,
              }),
            });
            const result = await response.json().catch(() => null);

            if (!response.ok) {
              throw new Error(result?.message || 'Unable to send message.');
            }

            setMessageStatus('Message sent successfully.');
            messageForm.reset();
          } catch (error) {
            setMessageStatus(error instanceof Error ? error.message : 'Something went wrong.', 'error');
          }
        });

        loadAuction().catch((error) => {
          errorBox.className = 'status error visible';
          errorBox.textContent = error instanceof Error ? error.message : 'Something went wrong.';
          title.textContent = 'Auction unavailable';
          description.textContent = 'This listing could not be loaded.';
        });
      </script>`,
    });
  }

  getSellerAuctionsPage(): string {
    return renderSitePage({
      title: 'My Auctions | Rare Collectible Auction House',
      description: 'Manage your collectible listings, publish drafts, and keep your auction catalog organised.',
      activePath: '/seller/auctions',
      body: `<main class="shell">
        <section class="hero">
          <div class="reveal delay-1">
            <span class="eyebrow">Seller workspace</span>
            <h1>Manage your auction pipeline from draft to live listing.</h1>
            <p>
              Create polished listings, keep imagery organised, update auction details, publish when
              ready, and cancel or remove listings without leaving the platform.
            </p>
            <div class="hero-actions">
              <a class="button button-primary" href="/seller/auctions/new">Create a new auction</a>
              <button class="button button-secondary" id="logout-button" type="button">Log out</button>
            </div>
          </div>
          <div class="hero-rail">
            <article class="panel hero-highlight reveal delay-2">
              <h2>Seller workflow</h2>
              <div class="highlight-list" style="margin-top: 18px;">
                <div class="highlight-item">Draft listings privately before publishing.</div>
                <div class="highlight-item">Update condition, provenance, schedule, and gallery images.</div>
                <div class="highlight-item">Cancel or remove listings with clear lifecycle controls.</div>
              </div>
            </article>
          </div>
        </section>

        <section id="auth-warning" class="empty-state" style="display: none; margin-top: 24px;">
          <h3>Login required</h3>
          <p class="muted" style="margin-top: 10px;">
            Sign in first so we can load your seller dashboard and let you manage your listings.
          </p>
          <div class="hero-actions" style="margin-top: 18px;">
            <a class="button button-primary" href="/login">Go to login</a>
          </div>
        </section>

        <section id="dashboard-content" style="display: none;">
          <div class="grid grid-3">
            <article class="metric-card reveal delay-2">
              <span id="metric-total" class="metric">0</span>
              <h3>Total listings</h3>
              <p>Every auction you have created in this workspace.</p>
            </article>
            <article class="metric-card reveal delay-3">
              <span id="metric-live" class="metric">0</span>
              <h3>Live auctions</h3>
              <p>Listings currently visible to buyers in the marketplace.</p>
            </article>
            <article class="metric-card reveal delay-4">
              <span id="metric-draft" class="metric">0</span>
              <h3>Draft or cancelled</h3>
              <p>Listings you can still refine, publish again, or remove.</p>
            </article>
          </div>

          <section class="table-card reveal delay-4" style="margin-top: 24px;">
            <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
              <div>
                <div class="kicker">My auctions</div>
                <h2>Seller listing overview</h2>
              </div>
              <p>Use the actions column to edit, publish, cancel, or remove each listing.</p>
            </div>
            <div id="dashboard-status" class="status" aria-live="polite"></div>
            <table>
              <thead>
                <tr>
                  <th>Listing</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Schedule</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="dashboard-table"></tbody>
            </table>
          </section>
        </section>
      </main>
      <script>
        const token = localStorage.getItem('auctionHouseToken');
        const authWarning = document.getElementById('auth-warning');
        const dashboardContent = document.getElementById('dashboard-content');
        const dashboardTable = document.getElementById('dashboard-table');
        const dashboardStatus = document.getElementById('dashboard-status');
        const logoutButton = document.getElementById('logout-button');

        const formatMoney = (value) =>
          new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(value || 0));
        const formatDate = (value) =>
          new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

        const api = async (path, options = {}) => {
          const response = await fetch(path, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              Authorization: \`Bearer \${token}\`,
              ...(options.headers || {}),
            },
          });
          const data = await response.json().catch(() => null);
          if (!response.ok) {
            throw new Error(data?.message || 'Request failed.');
          }
          return data;
        };

        function setStatus(message, type = 'success') {
          dashboardStatus.className = \`status \${type} visible\`;
          dashboardStatus.textContent = message;
        }

        async function loadDashboard() {
          const auctions = await api('/auctions/mine/list');
          const liveCount = auctions.filter((auction) => auction.status === 'ACTIVE').length;
          const draftCount = auctions.filter((auction) => ['DRAFT', 'CANCELLED'].includes(auction.status)).length;

          document.getElementById('metric-total').textContent = String(auctions.length);
          document.getElementById('metric-live').textContent = String(liveCount);
          document.getElementById('metric-draft').textContent = String(draftCount);

          dashboardTable.innerHTML = auctions.map((auction) => \`
            <tr>
              <td>
                <strong>\${auction.title}</strong>
                <div class="muted">\${auction.location}</div>
              </td>
              <td>\${auction.category}</td>
              <td><span class="badge">\${auction.status}</span></td>
              <td>
                <div>\${formatDate(auction.startsAt)}</div>
                <div class="muted">to \${formatDate(auction.endsAt)}</div>
              </td>
              <td>
                <div>\${formatMoney(auction.startingPrice)}</div>
                <div class="muted">\${auction.reservePrice ? \`Reserve \${formatMoney(auction.reservePrice)}\` : 'No reserve'}</div>
              </td>
              <td>
                <div class="toolbar">
                  <a class="button button-secondary" href="/seller/auctions/\${auction.id}/edit">Edit</a>
                  <button class="button button-ghost" type="button" data-action="publish" data-id="\${auction.id}">Publish</button>
                  <button class="button button-ghost" type="button" data-action="cancel" data-id="\${auction.id}">Cancel</button>
                  <button class="button button-secondary" type="button" data-action="delete" data-id="\${auction.id}">Remove</button>
                </div>
              </td>
            </tr>
          \`).join('');
        }

        dashboardTable.addEventListener('click', async (event) => {
          const target = event.target.closest('button[data-action]');
          if (!target) return;

          const action = target.dataset.action;
          const auctionId = target.dataset.id;

          try {
            if (action === 'publish') {
              await api(\`/auctions/mine/\${auctionId}/publish\`, { method: 'POST' });
              setStatus('Auction published successfully.');
            }

            if (action === 'cancel') {
              await api(\`/auctions/mine/\${auctionId}/cancel\`, { method: 'POST' });
              setStatus('Auction cancelled successfully.');
            }

            if (action === 'delete') {
              await api(\`/auctions/mine/\${auctionId}\`, { method: 'DELETE' });
              setStatus('Auction removed successfully.');
            }

            await loadDashboard();
          } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Something went wrong.', 'error');
          }
        });

        logoutButton.addEventListener('click', () => {
          localStorage.removeItem('auctionHouseToken');
          window.location.href = '/login';
        });

        if (!token) {
          authWarning.style.display = 'block';
          logoutButton.style.display = 'none';
        } else {
          dashboardContent.style.display = 'block';
          loadDashboard().catch((error) => {
            setStatus(error instanceof Error ? error.message : 'Unable to load your dashboard.', 'error');
          });
        }
      </script>`,
    });
  }

  getSellerAuctionEditorPage(auctionId?: number): string {
    const isEditing = typeof auctionId === 'number';
    return renderSitePage({
      title: isEditing
        ? `Edit Auction #${auctionId} | Rare Collectible Auction House`
        : 'Create Auction | Rare Collectible Auction House',
      description: 'Create or refine a collectible listing with strong UX and realistic auction detail fields.',
      activePath: '/seller/auctions/new',
      body: `<main class="form-shell">
        <section id="editor-auth-warning" class="empty-state" style="display: none;">
          <h3>Login required</h3>
          <p class="muted" style="margin-top: 10px;">
            Sign in first so we can save this listing to your seller account.
          </p>
          <div class="hero-actions" style="margin-top: 18px;">
            <a class="button button-primary" href="/login">Go to login</a>
          </div>
        </section>

        <section id="editor-card" class="form-card reveal delay-1" style="display: none;">
          <span class="eyebrow">${isEditing ? 'Edit listing' : 'New listing'}</span>
          <h1>${isEditing ? 'Refine your auction listing.' : 'Create a new collectible auction.'}</h1>
          <p class="lead">
            Fill in the listing details buyers need to evaluate your collectible clearly before bidding opens.
          </p>
          <form id="auction-form" novalidate>
            <label>
              Title
              <input type="text" name="title" placeholder="1967 Omega Seamaster in original box" required />
            </label>
            <label>
              Description
              <textarea name="description" placeholder="Describe the item, its rarity, condition, accessories, and why collectors would care." required></textarea>
            </label>
            <div class="field-grid">
              <label>
                Category
                <input type="text" name="category" placeholder="Watches" required />
              </label>
              <label>
                Item condition
                <input type="text" name="itemCondition" placeholder="Excellent vintage condition" required />
              </label>
            </div>
            <div class="field-grid">
              <label>
                Starts at
                <input type="datetime-local" name="startsAt" required />
              </label>
              <label>
                Ends at
                <input type="datetime-local" name="endsAt" required />
              </label>
            </div>
            <div class="field-grid-3">
              <label>
                Starting price
                <input type="number" name="startingPrice" min="0" step="0.01" placeholder="150.00" required />
              </label>
              <label>
                Reserve price
                <input type="number" name="reservePrice" min="0" step="0.01" placeholder="200.00" />
              </label>
              <label>
                Status
                <select name="status">
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </label>
            </div>
            <div class="field-grid">
              <label>
                Dispatch location
                <input type="text" name="location" placeholder="London, United Kingdom" required />
              </label>
              <label>
                Image URLs
                <span class="hint">Enter one absolute image URL per line.</span>
                <textarea name="imageUrls" placeholder="https://example.com/image-1.jpg&#10;https://example.com/image-2.jpg"></textarea>
              </label>
            </div>
            <label>
              Provenance
              <textarea name="provenance" placeholder="Document item history, certificates, signatures, or previous ownership context."></textarea>
            </label>
            <label>
              Shipping notes
              <textarea name="shippingNotes" placeholder="Explain packaging, dispatch timing, insurance, or collection instructions."></textarea>
            </label>
            <div class="toolbar">
              <button class="button-primary" type="submit">Save listing</button>
              <button class="button-secondary" id="save-and-publish" type="button">Save and publish</button>
              <a class="button button-ghost" href="/seller/auctions">Back to dashboard</a>
            </div>
          </form>
          <div id="editor-status" class="status" aria-live="polite"></div>
        </section>
      </main>
      <script>
        const token = localStorage.getItem('auctionHouseToken');
        const isEditing = ${isEditing ? 'true' : 'false'};
        const auctionId = ${isEditing ? auctionId : 'null'};
        const authWarning = document.getElementById('editor-auth-warning');
        const editorCard = document.getElementById('editor-card');
        const form = document.getElementById('auction-form');
        const statusBox = document.getElementById('editor-status');
        const saveAndPublishButton = document.getElementById('save-and-publish');

        const toDateTimeLocal = (value) => {
          const date = new Date(value);
          const offset = date.getTimezoneOffset();
          const local = new Date(date.getTime() - offset * 60000);
          return local.toISOString().slice(0, 16);
        };

        const toIsoString = (value) => new Date(value).toISOString();

        const api = async (path, options = {}) => {
          const response = await fetch(path, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              Authorization: \`Bearer \${token}\`,
              ...(options.headers || {}),
            },
          });
          const data = await response.json().catch(() => null);
          if (!response.ok) {
            const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Request failed.';
            throw new Error(message);
          }
          return data;
        };

        const setStatus = (message, type = 'success') => {
          statusBox.className = \`status \${type} visible\`;
          statusBox.textContent = message;
        };

        const buildPayload = (publishAfterSave = false) => {
          const formData = Object.fromEntries(new FormData(form).entries());
          const imageUrls = String(formData.imageUrls || '')
            .split(/\\n+/)
            .map((value) => value.trim())
            .filter(Boolean)
            .map((url, index) => ({ url, sortOrder: index }));

          const payload = {
            title: String(formData.title).trim(),
            description: String(formData.description).trim(),
            category: String(formData.category).trim(),
            itemCondition: String(formData.itemCondition).trim(),
            startsAt: toIsoString(formData.startsAt),
            endsAt: toIsoString(formData.endsAt),
            startingPrice: Number(formData.startingPrice),
            location: String(formData.location).trim(),
            status: publishAfterSave ? 'ACTIVE' : String(formData.status),
            images: imageUrls,
          };

          if (String(formData.reservePrice).trim()) payload.reservePrice = Number(formData.reservePrice);
          if (String(formData.provenance).trim()) payload.provenance = String(formData.provenance).trim();
          if (String(formData.shippingNotes).trim()) payload.shippingNotes = String(formData.shippingNotes).trim();

          return payload;
        };

        async function preloadAuction() {
          if (!isEditing) return;

          const auction = await api(\`/auctions/mine/\${auctionId}\`);
          form.title.value = auction.title;
          form.description.value = auction.description;
          form.category.value = auction.category;
          form.itemCondition.value = auction.itemCondition;
          form.startsAt.value = toDateTimeLocal(auction.startsAt);
          form.endsAt.value = toDateTimeLocal(auction.endsAt);
          form.startingPrice.value = auction.startingPrice;
          form.reservePrice.value = auction.reservePrice || '';
          form.location.value = auction.location;
          form.status.value = auction.status;
          form.provenance.value = auction.provenance || '';
          form.shippingNotes.value = auction.shippingNotes || '';
          form.imageUrls.value = (auction.images || []).map((image) => image.url).join('\\n');
        }

        async function saveAuction(publishAfterSave = false) {
          const payload = buildPayload(publishAfterSave);
          const path = isEditing ? \`/auctions/mine/\${auctionId}\` : '/auctions/mine';
          const method = isEditing ? 'PATCH' : 'POST';
          const auction = await api(path, { method, body: JSON.stringify(payload) });
          setStatus(publishAfterSave ? 'Auction saved and published.' : 'Auction saved successfully.');
          window.setTimeout(() => {
            window.location.href = \`/seller/auctions/\${auction.id}/edit\`;
          }, 700);
        }

        form.addEventListener('submit', (event) => {
          event.preventDefault();
          saveAuction(false).catch((error) => {
            setStatus(error instanceof Error ? error.message : 'Something went wrong.', 'error');
          });
        });

        saveAndPublishButton.addEventListener('click', () => {
          saveAuction(true).catch((error) => {
            setStatus(error instanceof Error ? error.message : 'Something went wrong.', 'error');
          });
        });

        if (!token) {
          authWarning.style.display = 'block';
        } else {
          editorCard.style.display = 'block';
          preloadAuction().catch((error) => {
            setStatus(error instanceof Error ? error.message : 'Unable to load auction.', 'error');
          });
        }
      </script>`,
    });
  }
}
