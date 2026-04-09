import { Injectable } from '@nestjs/common';
import { renderSitePage } from 'src/ui/site-page';

@Injectable()
export class DisputesUiService {
  getDisputesPage(): string {
    return renderSitePage({
      title: 'Disputes | Rare Collectible Auction House',
      description:
        'Raise and manage disputes for ended collectible auctions with supporting evidence.',
      activePath: '/disputes',
      body: `<main class="shell">
        <section class="hero">
          <div class="reveal delay-1">
            <span class="eyebrow">Dispute center</span>
            <h1>Raise concerns clearly and track how they are resolved.</h1>
            <p>
              Sellers and winning bidders can open a dispute for an auction, attach supporting evidence,
              and monitor the administrator's decision in one structured place.
            </p>
            <div class="hero-actions">
              <a class="button button-primary" href="/notifications/page">Open notifications</a>
              <a class="button button-secondary" href="/messages">Review messages</a>
            </div>
          </div>
          <div class="hero-rail">
            <article class="panel hero-highlight reveal delay-2">
              <h2>Good evidence includes</h2>
              <div class="highlight-list" style="margin-top: 18px;">
                <div class="highlight-item">Order of events and what was agreed.</div>
                <div class="highlight-item">Photos, documents, or message links.</div>
                <div class="highlight-item">The resolution you are asking for.</div>
              </div>
            </article>
          </div>
        </section>

        <section id="disputes-auth-warning" class="empty-state" style="display: none; margin-top: 24px;">
          <h3>Login required</h3>
          <p class="muted" style="margin-top: 10px;">Sign in first so we can load your eligible auctions and dispute history.</p>
          <div class="hero-actions" style="margin-top: 18px;">
            <a class="button button-primary" href="/login">Go to login</a>
          </div>
        </section>

        <section id="disputes-content" class="grid grid-2" style="display: none; margin-top: 24px;">
          <article class="form-card">
            <div class="kicker">Raise dispute</div>
            <h2 style="margin-top: 10px;">Open a new case</h2>
            <p class="muted" style="margin-top: 10px;">
              Choose an auction you sold or won, then explain the issue as clearly as possible.
            </p>
            <form id="dispute-form" novalidate>
              <label>
                Auction
                <select name="auctionId" id="dispute-auction-select">
                  <option value="">Select an auction</option>
                </select>
              </label>
              <label>
                What happened?
                <textarea name="description" placeholder="Describe what went wrong, when it happened, and the outcome you are seeking."></textarea>
              </label>
              <label>
                Evidence link
                <input type="url" name="evidenceUrl" placeholder="https://example.com/evidence" />
              </label>
              <div class="toolbar">
                <button class="button-primary" type="submit">Submit dispute</button>
              </div>
            </form>
            <div id="dispute-status" class="status" aria-live="polite"></div>
          </article>

          <article class="table-card">
            <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
              <div>
                <div class="kicker">My cases</div>
                <h2>Dispute history</h2>
              </div>
              <p id="disputes-summary">Loading disputes...</p>
            </div>
            <div id="disputes-list" class="stack"></div>
          </article>
        </section>
      </main>
      <script>
        const token = localStorage.getItem('auctionHouseToken');
        const authWarning = document.getElementById('disputes-auth-warning');
        const content = document.getElementById('disputes-content');
        const form = document.getElementById('dispute-form');
        const auctionSelect = document.getElementById('dispute-auction-select');
        const statusBox = document.getElementById('dispute-status');
        const summary = document.getElementById('disputes-summary');
        const list = document.getElementById('disputes-list');
        const queryAuctionId = new URLSearchParams(window.location.search).get('auctionId');

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
            const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Request failed.';
            throw new Error(message);
          }
          return data;
        };

        const formatDate = (value) =>
          new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

        const setStatus = (message, type = 'success') => {
          statusBox.className = 'status ' + type + ' visible';
          statusBox.textContent = message;
        };

        async function loadEligibleAuctions() {
          const auctions = await api('/disputes/eligible-auctions');
          auctionSelect.innerHTML = '<option value="">Select an auction</option>' + auctions.map((auction) => (
            '<option value="' + auction.id + '">' + auction.title + '</option>'
          )).join('');

          if (queryAuctionId && auctions.some((auction) => String(auction.id) === queryAuctionId)) {
            auctionSelect.value = queryAuctionId;
          }
        }

        async function loadDisputes() {
          const disputes = await api('/disputes/mine');
          summary.textContent = disputes.length + ' dispute' + (disputes.length === 1 ? '' : 's');
          list.innerHTML = disputes.length
            ? disputes.map((dispute) => \`
                <article class="info-card">
                  <div class="meta">
                    <strong>\${dispute.auction.title}</strong>
                    <span>\${dispute.status}</span>
                  </div>
                  <p style="margin-top: 10px;">\${dispute.description}</p>
                  <div class="meta" style="margin-top: 10px;">
                    <span>Opened \${formatDate(dispute.createdAt)}</span>
                    <span>Raised by \${dispute.raisedBy.displayName || dispute.raisedBy.email}</span>
                  </div>
                  \${dispute.evidenceUrl ? \`<div class="toolbar" style="margin-top: 12px;"><a class="button button-secondary" href="\${dispute.evidenceUrl}" target="_blank" rel="noreferrer">View evidence</a></div>\` : ''}
                  \${dispute.resolutionNotes ? \`<p class="muted" style="margin-top: 12px;">Resolution: \${dispute.resolutionNotes}</p>\` : ''}
                </article>
              \`).join('')
            : '<div class="empty-state"><p class="muted">No disputes yet.</p></div>';
        }

        form.addEventListener('submit', async (event) => {
          event.preventDefault();

          try {
            await api('/disputes', {
              method: 'POST',
              body: JSON.stringify({
                auctionId: Number(form.auctionId.value),
                description: String(form.description.value || '').trim(),
                evidenceUrl: String(form.evidenceUrl.value || '').trim() || undefined,
              }),
            });
            form.reset();
            setStatus('Dispute submitted successfully.');
            await Promise.all([loadEligibleAuctions(), loadDisputes()]);
          } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Unable to submit dispute.', 'error');
          }
        });

        if (!token) {
          authWarning.style.display = 'block';
        } else {
          content.style.display = 'grid';
          Promise.all([loadEligibleAuctions(), loadDisputes()]).catch((error) => {
            setStatus(error instanceof Error ? error.message : 'Unable to load disputes.', 'error');
          });
        }
      </script>`,
    });
  }
}
