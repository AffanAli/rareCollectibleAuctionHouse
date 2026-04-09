export type SitePagePath =
  | '/'
  | '/login'
  | '/register'
  | '/marketplace'
  | '/profile'
  | '/seller/auctions'
  | '/seller/auctions/new';

export function renderSitePage({
  title,
  description,
  body,
  activePath,
}: {
  title: string;
  description: string;
  body: string;
  activePath: SitePagePath;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <style>
      :root {
        --bg: #f4efe7;
        --surface: rgba(255, 252, 247, 0.84);
        --surface-strong: #fffdf9;
        --text: #1f2937;
        --muted: #5f6c7b;
        --line: rgba(92, 70, 44, 0.14);
        --brand: #9f4f2f;
        --brand-dark: #6e311c;
        --highlight: #1f6f78;
        --success: #1f7a53;
        --shadow: 0 24px 80px rgba(57, 37, 19, 0.12);
        --radius-xl: 32px;
        --radius-lg: 22px;
        --radius-md: 16px;
      }

      * {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: "Avenir Next", "Segoe UI", "Helvetica Neue", sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(201, 124, 71, 0.22), transparent 28%),
          radial-gradient(circle at top right, rgba(31, 111, 120, 0.14), transparent 24%),
          linear-gradient(180deg, #f7f2eb 0%, #f4efe7 42%, #efe7dc 100%);
      }

      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        background-image:
          linear-gradient(rgba(159, 79, 47, 0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(159, 79, 47, 0.025) 1px, transparent 1px);
        background-size: 26px 26px;
        mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.3), transparent 70%);
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .shell {
        width: min(1180px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 24px 0 72px;
      }

      .form-shell {
        width: min(760px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 24px 0 72px;
      }

      .nav {
        position: sticky;
        top: 16px;
        z-index: 10;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        padding: 14px 18px;
        margin-bottom: 28px;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 249, 241, 0.8);
        backdrop-filter: blur(18px);
        box-shadow: 0 10px 30px rgba(55, 38, 20, 0.08);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 700;
        letter-spacing: 0.01em;
      }

      .brand-mark {
        display: inline-grid;
        place-items: center;
        width: 42px;
        height: 42px;
        border-radius: 14px;
        color: #fff8f2;
        background: linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28);
      }

      .nav-links,
      .nav-actions,
      .hero-actions,
      .toolbar,
      .pill-row {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .nav-link,
      .button,
      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 44px;
        padding: 0 18px;
        border-radius: 999px;
        transition:
          transform 180ms ease,
          box-shadow 180ms ease,
          background 180ms ease,
          border-color 180ms ease;
      }

      .nav-link {
        color: var(--muted);
      }

      .nav-link:hover,
      .nav-link:focus-visible {
        color: var(--text);
        background: rgba(159, 79, 47, 0.08);
        outline: none;
      }

      .nav-link.active {
        color: var(--brand-dark);
        background: rgba(159, 79, 47, 0.12);
      }

      .button,
      button {
        border: 1px solid transparent;
        font-weight: 600;
        font: inherit;
        cursor: pointer;
      }

      .button:hover,
      .button:focus-visible,
      button:hover,
      button:focus-visible {
        transform: translateY(-1px);
        outline: none;
      }

      .button-primary {
        color: #fff9f3;
        background: linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%);
        box-shadow: 0 12px 28px rgba(110, 49, 28, 0.22);
      }

      .button-secondary {
        border-color: rgba(159, 79, 47, 0.18);
        color: var(--brand-dark);
        background: rgba(255, 250, 243, 0.9);
      }

      .button-ghost {
        border-color: rgba(31, 111, 120, 0.12);
        color: var(--highlight);
        background: rgba(245, 251, 251, 0.9);
      }

      .hero,
      .panel,
      .info-card,
      .feature-card,
      .metric-card,
      .form-card,
      .table-card,
      .empty-state {
        border: 1px solid var(--line);
        background: var(--surface);
        backdrop-filter: blur(18px);
        box-shadow: var(--shadow);
      }

      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
        gap: 24px;
        padding: 28px;
        border-radius: var(--radius-xl);
        overflow: hidden;
      }

      .eyebrow,
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 14px;
        border-radius: 999px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        font-size: 0.78rem;
      }

      .eyebrow {
        background: rgba(31, 111, 120, 0.1);
        color: var(--highlight);
      }

      .badge {
        background: rgba(159, 79, 47, 0.1);
        color: var(--brand-dark);
      }

      h1,
      h2,
      h3,
      p {
        margin: 0;
      }

      h1 {
        margin-top: 18px;
        font-size: clamp(2.4rem, 6vw, 4.8rem);
        line-height: 0.97;
        letter-spacing: -0.04em;
      }

      .hero p,
      .lead {
        margin-top: 18px;
        max-width: 61ch;
        color: var(--muted);
        font-size: 1.06rem;
        line-height: 1.7;
      }

      .hero-foot {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 26px;
      }

      .chip {
        padding: 10px 14px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.66);
        border: 1px solid rgba(95, 108, 123, 0.12);
        color: var(--muted);
        font-size: 0.95rem;
      }

      .hero-rail,
      .stack {
        display: grid;
        gap: 16px;
        align-content: start;
      }

      .panel {
        border-radius: 28px;
        padding: 22px;
      }

      .hero-highlight {
        position: relative;
        overflow: hidden;
        min-height: 100%;
        background:
          linear-gradient(155deg, rgba(31, 111, 120, 0.9), rgba(14, 47, 52, 0.9)),
          linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent);
        color: #f5fbfb;
      }

      .hero-highlight::after {
        content: "";
        position: absolute;
        inset: auto -80px -120px auto;
        width: 240px;
        height: 240px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.12);
        filter: blur(4px);
      }

      .highlight-list,
      .grid {
        display: grid;
        gap: 18px;
      }

      .grid {
        margin-top: 22px;
      }

      .grid-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .grid-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .feature-card,
      .metric-card,
      .info-card,
      .form-card,
      .table-card,
      .empty-state {
        border-radius: var(--radius-lg);
        padding: 22px;
      }

      .section-title {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 16px;
        margin-top: 38px;
        margin-bottom: 14px;
      }

      .section-title p,
      .muted {
        max-width: 56ch;
        color: var(--muted);
        line-height: 1.6;
      }

      .kicker {
        color: var(--brand);
        font-size: 0.82rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-weight: 700;
      }

      .metric {
        display: block;
        margin-bottom: 10px;
        color: var(--brand-dark);
        font-size: 2rem;
        font-weight: 800;
        letter-spacing: -0.04em;
      }

      form {
        display: grid;
        gap: 18px;
        margin-top: 22px;
      }

      .field-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .field-grid-3 {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }

      label {
        display: grid;
        gap: 8px;
        font-weight: 600;
      }

      .hint {
        color: var(--muted);
        font-size: 0.94rem;
        font-weight: 400;
      }

      input,
      textarea,
      select {
        width: 100%;
        min-height: 50px;
        padding: 12px 14px;
        border: 1px solid rgba(95, 108, 123, 0.22);
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.88);
        color: var(--text);
        font: inherit;
      }

      textarea {
        min-height: 132px;
        resize: vertical;
      }

      input:focus-visible,
      textarea:focus-visible,
      select:focus-visible {
        outline: 2px solid rgba(159, 79, 47, 0.22);
        border-color: rgba(159, 79, 47, 0.4);
      }

      .status {
        display: none;
        margin-top: 18px;
        padding: 14px 16px;
        border-radius: 16px;
        font-size: 0.95rem;
        line-height: 1.55;
      }

      .status.visible {
        display: block;
      }

      .status.success {
        color: #0b5134;
        background: rgba(31, 122, 83, 0.12);
        border: 1px solid rgba(31, 122, 83, 0.18);
      }

      .status.error {
        color: #7b1d1d;
        background: rgba(173, 52, 52, 0.1);
        border: 1px solid rgba(173, 52, 52, 0.18);
      }

      .table-card table {
        width: 100%;
        border-collapse: collapse;
      }

      .table-card th,
      .table-card td {
        padding: 14px 10px;
        text-align: left;
        border-bottom: 1px solid rgba(95, 108, 123, 0.12);
        vertical-align: top;
      }

      .table-card th {
        color: var(--muted);
        font-size: 0.88rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .media-card {
        overflow: hidden;
        border-radius: 24px;
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.76);
        box-shadow: var(--shadow);
      }

      .media-frame {
        aspect-ratio: 4 / 3;
        width: 100%;
        background:
          linear-gradient(135deg, rgba(31, 111, 120, 0.18), rgba(159, 79, 47, 0.14)),
          linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(245, 239, 231, 0.92));
        display: grid;
        place-items: center;
        color: var(--muted);
        overflow: hidden;
      }

      .media-frame img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .list-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
        margin-top: 22px;
      }

      .auction-card {
        border-radius: 24px;
        overflow: hidden;
        border: 1px solid var(--line);
        background: rgba(255, 252, 247, 0.92);
        box-shadow: var(--shadow);
      }

      .auction-card-body {
        padding: 18px;
        display: grid;
        gap: 12px;
      }

      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        color: var(--muted);
        font-size: 0.94rem;
      }

      .footer {
        margin-top: 38px;
        padding: 22px 0 0;
        color: var(--muted);
        text-align: center;
      }

      .reveal {
        opacity: 0;
        transform: translateY(18px);
        animation: rise 700ms ease forwards;
      }

      .delay-1 { animation-delay: 70ms; }
      .delay-2 { animation-delay: 140ms; }
      .delay-3 { animation-delay: 210ms; }
      .delay-4 { animation-delay: 280ms; }

      @keyframes rise {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 920px) {
        .hero,
        .grid-3,
        .grid-2,
        .field-grid,
        .field-grid-3,
        .list-grid {
          grid-template-columns: 1fr;
        }

        .nav {
          border-radius: 28px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .nav-links,
        .nav-actions {
          justify-content: center;
        }

        .section-title {
          align-items: start;
          flex-direction: column;
        }
      }

      @media (max-width: 640px) {
        .shell,
        .form-shell {
          width: min(100vw - 20px, 100%);
        }

        .hero,
        .panel,
        .feature-card,
        .metric-card,
        .info-card,
        .form-card,
        .table-card,
        .empty-state {
          padding: 20px;
          border-radius: 24px;
        }

        h1 {
          font-size: clamp(2.15rem, 12vw, 3rem);
        }

        .table-card {
          overflow-x: auto;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <nav class="nav reveal">
        <a class="brand" href="/">
          <span class="brand-mark">RC</span>
          <span>Rare Collectible Auction House</span>
        </a>
        <div class="nav-links">
          <a class="nav-link${activePath === '/' ? ' active' : ''}" href="/">Home</a>
          <a class="nav-link${activePath === '/marketplace' ? ' active' : ''}" href="/marketplace">Marketplace</a>
          <a class="nav-link${activePath === '/profile' ? ' active' : ''}" href="/profile">Profile</a>
          <a class="nav-link${activePath === '/seller/auctions' || activePath === '/seller/auctions/new' ? ' active' : ''}" href="/seller/auctions">Sell</a>
          <a class="nav-link${activePath === '/login' ? ' active' : ''}" href="/login">Login</a>
          <a class="nav-link${activePath === '/register' ? ' active' : ''}" href="/register">Register</a>
          <a class="nav-link" href="/api">API Docs</a>
        </div>
        <div class="nav-actions">
          <a class="button button-secondary" href="/marketplace">Browse auctions</a>
          <a class="button button-primary" href="/seller/auctions">Manage listings</a>
        </div>
      </nav>
    </div>
    ${body}
  </body>
</html>`;
}
