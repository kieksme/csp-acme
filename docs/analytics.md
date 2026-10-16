# Acme analytics

Swetrix project: `csp-acme` (`QKIxNNebrjFs`), private dashboard at <https://analytics.kieks.me>.
Ingestion: `https://analytics-api.kieks.me/log`. Allowed origin: `kieksme.github.io`.

All eight portal profiles include the Swetrix plugin. Variants: `main`, `demo`, `hosted`, `support-demo`, `support`, `datadog-demo`, `datadog-live`, `datadog-hosted`. The published root portal currently uses `support`; `/csp-acme/datadog/` uses `datadog-demo`; `/csp-acme/datadog-live/` uses `datadog-hosted`. Localhost and loopback never send analytics. Configuration is public and built into each frontend; no API key is required.

Anonymous tracking starts directly and respects Do Not Track. It excludes chat text, search terms, contact details, profile identifiers, URL query strings, referrers, cookies and session replay. Set `analytics.swetrix.enabled` to `false` and rebuild to disable it.

## Custom events

`PORTAL_VIEW`, `SECTION_VIEW`, `FAQ_OPEN`, `TICKET_CLICK`, `PROCESS_CLICK`, `STATUS_CLICK`, `CONTACT_CLICK`, `CHAT_OPEN`, `CHAT_MESSAGE_SENT`, `CHAT_REPLY_RECEIVED`, `HUMAN_SUPPORT_REQUESTED`, `CONVERSATION_RESOLVED`.

Metadata is restricted to variant, section, FAQ/process IDs, contact channel and chat mode. IDs are content identifiers, never personal identifiers. Chat events reflect confirmed actions. Restored replies and resolutions are not counted again. Opening a ticket link does not prove ticket creation.

## Funnels

| Name                   | Ordered events                                                            |
| ---------------------- | ------------------------------------------------------------------------- |
| Selbsthilfe vor Ticket | `PORTAL_VIEW` → `FAQ_OPEN` → `TICKET_CLICK`                               |
| FAQ zu Kontakt         | `FAQ_OPEN` → `CONTACT_CLICK`                                              |
| Status zu Kontakt      | `STATUS_CLICK` → `CONTACT_CLICK`                                          |
| Chat bis Antwort       | `CHAT_OPEN` → `CHAT_MESSAGE_SENT` → `CHAT_REPLY_RECEIVED`                 |
| Support bis Abschluss  | `CHAT_MESSAGE_SENT` → `HUMAN_SUPPORT_REQUESTED` → `CONVERSATION_RESOLVED` |

Project and funnels are managed through Swetrix MCP. New events appear after real browser interactions; do not send fake registration events. Verify event delivery, persisted metadata and funnel conversions independently after deployment. Human-support funnels apply only to variants that offer human handover.

Pageviews are counted once per document load; returning visitors generate normal pageviews as well. CSP 0.15.1 removes the cross-visit `unique` API flag that could reject revisits with HTTP 403.
