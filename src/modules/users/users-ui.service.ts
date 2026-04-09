import { Injectable } from '@nestjs/common';
import { renderSitePage } from 'src/ui/site-page';

@Injectable()
export class UsersUiService {
  getProfilePage(): string {
    return renderSitePage({
      title: 'My Profile | Rare Collectible Auction House',
      description:
        'View and manage your profile, contact details, and account preferences.',
      activePath: '/profile',
      body: `<main class="form-shell">
        <section id="profile-auth-warning" class="empty-state" style="display: none;">
          <h3>Login required</h3>
          <p class="muted" style="margin-top: 10px;">
            Sign in first so we can load your profile and save your contact details and preferences.
          </p>
          <div class="hero-actions" style="margin-top: 18px;">
            <a class="button button-primary" href="/login">Go to login</a>
          </div>
        </section>

        <section id="profile-card" class="form-card reveal delay-1" style="display: none;">
          <span class="eyebrow">My profile</span>
          <h1>Manage your contact details and auction preferences.</h1>
          <p class="lead">
            Keep your profile current so notifications, seller communication, and marketplace preferences stay aligned with how you use the platform.
          </p>

          <div class="grid grid-2" style="margin-top: 22px;">
            <article class="info-card">
              <div class="kicker">Account</div>
              <h3 style="margin-top: 10px;">Identity</h3>
              <p class="muted" id="profile-identity" style="margin-top: 10px;">Loading account details...</p>
            </article>
            <article class="info-card">
              <div class="kicker">Preferences</div>
              <h3 style="margin-top: 10px;">Personal setup</h3>
              <p class="muted" style="margin-top: 10px;">
                These settings are stored in your profile preferences so the platform can adapt to how you browse and participate.
              </p>
            </article>
          </div>

          <form id="profile-form" novalidate>
            <div class="field-grid">
              <label>
                Display name
                <input type="text" name="displayName" placeholder="Collector Loft" />
              </label>
              <label>
                Contact phone
                <input type="tel" name="contactPhone" placeholder="+44 7700 900123" />
              </label>
            </div>
            <div class="field-grid">
              <label>
                Preferred currency
                <select name="preferredCurrency">
                  <option value="GBP">GBP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>
              <label>
                Favorite categories
                <input type="text" name="favoriteCategories" placeholder="Watches, Cards, Memorabilia" />
              </label>
            </div>
            <div class="field-grid">
              <label>
                Email notifications
                <select name="emailNotifications">
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </label>
              <label>
                Outbid alerts
                <select name="outbidAlerts">
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </label>
            </div>
            <div class="field-grid">
              <label>
                Marketplace digest
                <select name="weeklyDigest">
                  <option value="true">Weekly summary</option>
                  <option value="false">No digest</option>
                </select>
              </label>
              <label>
                Interface density
                <select name="dashboardDensity">
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                </select>
              </label>
            </div>
            <label>
              Notes for your own setup
              <textarea name="profileNotes" placeholder="Keep track of collector interests, shipping preferences, or any personal notes for your account."></textarea>
            </label>
            <div class="toolbar">
              <button class="button-primary" type="submit">Save profile</button>
              <a class="button button-secondary" href="/seller/auctions">Manage auctions</a>
            </div>
          </form>
          <div id="profile-status" class="status" aria-live="polite"></div>
        </section>
      </main>
      <script>
        const token = localStorage.getItem('auctionHouseToken');
        const authWarning = document.getElementById('profile-auth-warning');
        const profileCard = document.getElementById('profile-card');
        const profileForm = document.getElementById('profile-form');
        const statusBox = document.getElementById('profile-status');
        const identityBox = document.getElementById('profile-identity');

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

        const parseCategories = (value) =>
          String(value || '')
            .split(',')
            .map((entry) => entry.trim())
            .filter(Boolean);

        const stringifyCategories = (value) =>
          Array.isArray(value) ? value.join(', ') : '';

        async function loadProfile() {
          const profile = await api('/users/me');
          const preferences = profile.preferencesJson || {};

          identityBox.textContent = \`\${profile.email} | Role: \${profile.role} | Joined \${new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(profile.createdAt))}\`;
          profileForm.displayName.value = profile.displayName || '';
          profileForm.contactPhone.value = profile.contactPhone || '';
          profileForm.preferredCurrency.value = preferences.preferredCurrency || 'GBP';
          profileForm.favoriteCategories.value = stringifyCategories(preferences.favoriteCategories);
          profileForm.emailNotifications.value = String(preferences.emailNotifications ?? true);
          profileForm.outbidAlerts.value = String(preferences.outbidAlerts ?? true);
          profileForm.weeklyDigest.value = String(preferences.weeklyDigest ?? true);
          profileForm.dashboardDensity.value = preferences.dashboardDensity || 'comfortable';
          profileForm.profileNotes.value = preferences.profileNotes || '';
        }

        profileForm.addEventListener('submit', async (event) => {
          event.preventDefault();

          const payload = {
            displayName: String(profileForm.displayName.value || '').trim(),
            contactPhone: String(profileForm.contactPhone.value || '').trim(),
            preferencesJson: {
              preferredCurrency: profileForm.preferredCurrency.value,
              favoriteCategories: parseCategories(profileForm.favoriteCategories.value),
              emailNotifications: profileForm.emailNotifications.value === 'true',
              outbidAlerts: profileForm.outbidAlerts.value === 'true',
              weeklyDigest: profileForm.weeklyDigest.value === 'true',
              dashboardDensity: profileForm.dashboardDensity.value,
              profileNotes: String(profileForm.profileNotes.value || '').trim(),
            },
          };

          try {
            await api('/users/me', {
              method: 'PATCH',
              body: JSON.stringify(payload),
            });
            setStatus('Profile updated successfully.');
            await loadProfile();
          } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Something went wrong.', 'error');
          }
        });

        if (!token) {
          authWarning.style.display = 'block';
        } else {
          profileCard.style.display = 'block';
          loadProfile().catch((error) => {
            setStatus(error instanceof Error ? error.message : 'Unable to load your profile.', 'error');
          });
        }
      </script>`,
    });
  }
}
