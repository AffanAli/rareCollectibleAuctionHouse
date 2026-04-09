import { Injectable } from '@nestjs/common';
import { renderSitePage } from 'src/ui/site-page';

@Injectable()
export class MessagesUiService {
  getMessagesPage(): string {
    return renderSitePage({
      title: 'Messages | Rare Collectible Auction House',
      description:
        'Communicate with buyers and sellers about auction listings in one place.',
      activePath: '/messages',
      body: `<main class="shell">
        <section class="hero">
          <div class="reveal delay-1">
            <span class="eyebrow">Buyer and seller communication</span>
            <h1>Keep auction conversations organized in one inbox.</h1>
            <p>
              View message threads by auction, reply to buyers or sellers, and keep communication
              tied to the listing it belongs to.
            </p>
            <div class="hero-actions">
              <a class="button button-primary" href="/marketplace">Browse marketplace</a>
              <a class="button button-secondary" href="/seller/auctions">Manage auctions</a>
            </div>
          </div>
          <div class="hero-rail">
            <article class="panel hero-highlight reveal delay-2">
              <h2>Messaging workflow</h2>
              <div class="highlight-list" style="margin-top: 18px;">
                <div class="highlight-item">Buyers can contact sellers directly from an auction page.</div>
                <div class="highlight-item">Sellers can reply inside the same auction thread.</div>
                <div class="highlight-item">Your inbox groups conversations by auction and counterpart.</div>
              </div>
            </article>
          </div>
        </section>

        <section id="messages-auth-warning" class="empty-state" style="display: none; margin-top: 24px;">
          <h3>Login required</h3>
          <p class="muted" style="margin-top: 10px;">Sign in first so we can load your messages.</p>
          <div class="hero-actions" style="margin-top: 18px;">
            <a class="button button-primary" href="/login">Go to login</a>
          </div>
        </section>

        <section id="messages-content" class="grid grid-2" style="display: none; margin-top: 24px;">
          <article class="table-card">
            <div class="section-title" style="margin-top: 0; margin-bottom: 16px;">
              <div>
                <div class="kicker">Inbox</div>
                <h2>Conversations</h2>
              </div>
              <p id="messages-summary">Loading conversations...</p>
            </div>
            <div id="messages-status" class="status" aria-live="polite"></div>
            <div id="conversation-list" class="stack"></div>
          </article>

          <article class="form-card">
            <div class="kicker">Thread</div>
            <h2 id="thread-title" style="margin-top: 10px;">Choose a conversation</h2>
            <p id="thread-subtitle" class="muted" style="margin-top: 10px;">
              Select a conversation from the inbox to see the full thread and send a reply.
            </p>
            <div id="thread-messages" class="stack" style="margin-top: 18px;"></div>
            <form id="thread-form" style="margin-top: 18px; display: none;">
              <label>
                Reply
                <textarea name="body" placeholder="Write your message..."></textarea>
              </label>
              <div class="toolbar">
                <button class="button-primary" type="submit">Send message</button>
              </div>
            </form>
          </article>
        </section>
      </main>
      <script>
        const token = localStorage.getItem('auctionHouseToken');
        const authWarning = document.getElementById('messages-auth-warning');
        const messagesContent = document.getElementById('messages-content');
        const summary = document.getElementById('messages-summary');
        const statusBox = document.getElementById('messages-status');
        const list = document.getElementById('conversation-list');
        const threadTitle = document.getElementById('thread-title');
        const threadSubtitle = document.getElementById('thread-subtitle');
        const threadMessages = document.getElementById('thread-messages');
        const threadForm = document.getElementById('thread-form');

        let currentConversation = null;
        let currentInboxSnapshot = '';
        let currentThreadSnapshot = '';
        let pollingHandle = null;

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

        const buildInboxSnapshot = (conversations) =>
          JSON.stringify(
            (conversations || []).map((conversation) => ({
              auctionId: conversation.auction.id,
              counterpartId: conversation.counterpart.id,
              lastMessageId: conversation.lastMessage.id,
              lastMessageAt: conversation.lastMessage.createdAt,
            })),
          );

        const buildThreadSnapshot = (messages) =>
          JSON.stringify(
            (messages || []).map((message) => ({
              id: message.id,
              createdAt: message.createdAt,
            })),
          );

        async function loadThread(conversation) {
          currentConversation = conversation;
          const messages = await api(\`/auctions/\${conversation.auction.id}/messages?counterpartUserId=\${conversation.counterpart.id}\`);
          currentThreadSnapshot = buildThreadSnapshot(messages);
          threadTitle.textContent = conversation.auction.title;
          threadSubtitle.textContent = \`Conversation with \${conversation.counterpart.displayName}\`;
          threadForm.style.display = 'grid';
          threadMessages.innerHTML = messages.length
            ? messages.map((message) => \`
                <article class="info-card">
                  <div class="meta">
                    <strong>\${message.sender.displayName}</strong>
                    <span>\${formatDate(message.createdAt)}</span>
                  </div>
                  <p style="margin-top: 10px;">\${message.body}</p>
                </article>
              \`).join('')
            : '<div class="empty-state"><p class="muted">No messages yet.</p></div>';
        }

        async function loadInbox() {
          const conversations = await api('/messages/inbox');
          currentInboxSnapshot = buildInboxSnapshot(conversations);
          summary.textContent = \`\${conversations.length} conversation\${conversations.length === 1 ? '' : 's'}\`;
          list.innerHTML = conversations.length
            ? conversations.map((conversation, index) => \`
                <button class="dropdown-item" type="button" data-index="\${index}">
                  <span>
                    <strong>\${conversation.auction.title}</strong><br />
                    <span class="dropdown-subtle">\${conversation.counterpart.displayName}</span>
                  </span>
                  <span class="dropdown-subtle">\${formatDate(conversation.lastMessage.createdAt)}</span>
                </button>
              \`).join('')
            : '<div class="empty-state"><p class="muted">No conversations yet. Start from an auction page.</p></div>';

          list.querySelectorAll('button[data-index]').forEach((button) => {
            button.addEventListener('click', () => {
              loadThread(conversations[Number(button.dataset.index)]).catch((error) => {
                statusBox.className = 'status error visible';
                statusBox.textContent = error instanceof Error ? error.message : 'Unable to load thread.';
              });
            });
          });

          if (conversations[0]) {
            await loadThread(conversations[0]);
          }
        }

        async function pollMessages() {
          if (document.hidden) {
            return;
          }

          try {
            const conversations = await api('/messages/inbox');
            const nextInboxSnapshot = buildInboxSnapshot(conversations);

            if (nextInboxSnapshot !== currentInboxSnapshot) {
              currentInboxSnapshot = nextInboxSnapshot;
              summary.textContent = \`\${conversations.length} conversation\${conversations.length === 1 ? '' : 's'}\`;
              list.innerHTML = conversations.length
                ? conversations.map((conversation, index) => \`
                    <button class="dropdown-item" type="button" data-index="\${index}">
                      <span>
                        <strong>\${conversation.auction.title}</strong><br />
                        <span class="dropdown-subtle">\${conversation.counterpart.displayName}</span>
                      </span>
                      <span class="dropdown-subtle">\${formatDate(conversation.lastMessage.createdAt)}</span>
                    </button>
                  \`).join('')
                : '<div class="empty-state"><p class="muted">No conversations yet. Start from an auction page.</p></div>';

              list.querySelectorAll('button[data-index]').forEach((button) => {
                button.addEventListener('click', () => {
                  loadThread(conversations[Number(button.dataset.index)]).catch((error) => {
                    statusBox.className = 'status error visible';
                    statusBox.textContent = error instanceof Error ? error.message : 'Unable to load thread.';
                  });
                });
              });
            }

            if (currentConversation) {
              const matchingConversation = conversations.find(
                (conversation) =>
                  conversation.auction.id === currentConversation.auction.id &&
                  conversation.counterpart.id === currentConversation.counterpart.id,
              );

              if (matchingConversation) {
                const messages = await api(
                  \`/auctions/\${matchingConversation.auction.id}/messages?counterpartUserId=\${matchingConversation.counterpart.id}\`,
                );
                const nextThreadSnapshot = buildThreadSnapshot(messages);

                if (nextThreadSnapshot !== currentThreadSnapshot) {
                  currentThreadSnapshot = nextThreadSnapshot;
                  currentConversation = matchingConversation;
                  threadTitle.textContent = matchingConversation.auction.title;
                  threadSubtitle.textContent = \`Conversation with \${matchingConversation.counterpart.displayName}\`;
                  threadMessages.innerHTML = messages.length
                    ? messages.map((message) => \`
                        <article class="info-card">
                          <div class="meta">
                            <strong>\${message.sender.displayName}</strong>
                            <span>\${formatDate(message.createdAt)}</span>
                          </div>
                          <p style="margin-top: 10px;">\${message.body}</p>
                        </article>
                      \`).join('')
                    : '<div class="empty-state"><p class="muted">No messages yet.</p></div>';
                }
              }
            }
          } catch {
            // Keep polling silent to avoid interrupting the user with transient refresh errors.
          }
        }

        function startPolling() {
          if (pollingHandle) {
            window.clearInterval(pollingHandle);
          }

          pollingHandle = window.setInterval(() => {
            pollMessages();
          }, 8000);
        }

        threadForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          if (!currentConversation) return;

          try {
            await api(\`/auctions/\${currentConversation.auction.id}/messages\`, {
              method: 'POST',
              body: JSON.stringify({
                recipientId: currentConversation.counterpart.id,
                body: threadForm.body.value,
              }),
            });
            threadForm.reset();
            await loadInbox();
          } catch (error) {
            statusBox.className = 'status error visible';
            statusBox.textContent = error instanceof Error ? error.message : 'Unable to send message.';
          }
        });

        if (!token) {
          authWarning.style.display = 'block';
        } else {
          messagesContent.style.display = 'grid';
          loadInbox().catch((error) => {
            statusBox.className = 'status error visible';
            statusBox.textContent = error instanceof Error ? error.message : 'Unable to load inbox.';
          });
          startPolling();
        }

        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) {
            pollMessages();
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
