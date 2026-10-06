import type {
  PublicConfig,
  Person,
  Schedule,
  Status,
  Alert,
} from "@kieksme/csp-sdk";

// Ausschließlich für den statischen Pages-Build; keine Provider oder API erforderlich.
export function installPagesDemo(config: PublicConfig) {
  if (!config.demo) throw new Error("Static Pages demo requires CSP_DEMO=true");
  const api = new URL(config.apiUrl + "/api/v1/", location.href);
  if (api.origin !== location.origin)
    throw new Error("Demo API must be same-origin");
  const originalFetch = window.fetch.bind(window);
  const team: Person[] = [
    {
      id: "acme-lena",
      name: "Lena Beispiel",
      role: "Cloud Operations",
      email: "lena@example.invalid",
      phones: ["+49 000 000001"],
    },
    {
      id: "acme-noah",
      name: "Noah Muster",
      role: "Platform Engineering",
      email: "noah@example.invalid",
      phones: ["+49 000 000002"],
    },
    {
      id: "acme-mila",
      name: "Mila Demo",
      role: "Service Management",
      email: "mila@example.invalid",
      phones: ["+49 000 000003"],
    },
  ];
  const vcard = (person: Person) =>
    [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${person.name}`,
      `EMAIL:${person.email}`,
      ...person.phones.map((phone) => `TEL:${phone}`),
      "END:VCARD",
      "",
    ].join("\r\n");
  window.fetch = async (input, init) => {
    const url = new URL(
      input instanceof Request ? input.url : String(input),
      location.href,
    );
    if (url.origin !== api.origin || !url.pathname.startsWith(api.pathname))
      return originalFetch(input, init);
    const route = url.pathname.slice(api.pathname.length);
    const now = Date.now();
    const date = (offset: number) =>
      new Date(now + offset * 3600000).toISOString();
    const live = (data: unknown) =>
      Response.json({ data, updatedAt: date(0), stale: false });
    if (route === "team") return live(team);
    if (route === "schedule")
      return live({
        timezone: "Europe/Berlin",
        shifts: team.map((person, i) => ({
          userId: person.id,
          name: person.name,
          start: date(i === 0 ? -1 : 2 + (i - 1) * 8),
          end: date(i === 0 ? 2 : 10 + (i - 1) * 8),
        })),
      } satisfies Schedule);
    if (route === "alerts")
      return live([
        {
          id: "acme-demo-alert",
          title: "Acme-Demo: erhöhte Antwortzeiten",
          description:
            "Fiktive Beispielmeldung. Das Service-Team untersucht eine erhöhte Latenz.",
          status: "Bestätigt",
          createdAt: date(-1 / 3),
          severity: 2,
        },
      ] satisfies Alert[]);
    if (route === "status")
      return live({
        url: location.href.split("#")[0] + "#status",
        monitors: [
          {
            id: "portal",
            name: "Acme Kundenportal",
            status: "up",
            uptime: 0.9998,
          },
          {
            id: "cloud",
            name: "Acme Cloud-Infrastruktur",
            status: "up",
            uptime: 1,
          },
          {
            id: "tickets",
            name: "Acme Support & Tickets",
            status: "up",
            uptime: 1,
          },
        ],
      } satisfies Status);
    if (route === "chat") {
      const answer =
        "Dies ist die statische Acme-Demo ohne KI-Provider. Bei einer Störung beschreiben Sie den betroffenen Dienst, Zeitpunkt und Auswirkungen. Nutzen Sie im echten Kundenportal die Support-Hotline oder eine Ticketvorlage. Die Kontakte dieser Demo sind fiktiv.";
      return new Response(
        `event: sources\ndata: []\n\nevent: delta\ndata: ${JSON.stringify({ text: answer })}\n\nevent: done\ndata: {}\n\n`,
        { headers: { "Content-Type": "text/event-stream" } },
      );
    }
    return Response.json({ error: "Unknown demo route" }, { status: 404 });
  };
  // Kontakt-Downloads lokal erzeugen, da Pages keine dynamischen API-Routen hat.
  document.addEventListener("click", (event) => {
    const anchor =
      event.target instanceof Element ? event.target.closest("a") : null;
    if (!anchor) return;
    const person = team.find(
      (person) => anchor.href === api.href + `team/${person.id}/vcard`,
    );
    if (!person) return;
    event.preventDefault();
    const url = URL.createObjectURL(
      new Blob([vcard(person)], { type: "text/vcard" }),
    );
    const download = document.createElement("a");
    download.href = url;
    download.download = `${person.id}.vcf`;
    download.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}
