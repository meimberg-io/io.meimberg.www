# Newsletter über Brevo

Stand 2026-09-26: Brevo läuft im Testbetrieb, Buttondown verschickt weiter produktiv über `/api/news/rss.xml`. Dieser Feed bleibt unverändert, bis umgestellt ist.

## Feed

`/api/news/rss-weekly.xml` enthält genau die abgeschlossene Woche Freitag 00:00 bis Donnerstag 24:00, Europe/Berlin. Ab Freitag 00:00 steht die eben beendete Woche im Feed.

- Höchstens 10 Items, weil Brevo pro RSS-Kampagne nicht mehr holt. Blog, Artikel und Morpheuxx gehen immer komplett rein, Awesome Apps füllen die restlichen Plätze, neueste zuerst.
- `pubDate` ist das Originaldatum.
- `?now=<ISO-8601>` berechnet das Fenster für einen anderen Zeitpunkt, zum Prüfen beliebiger Wochen, etwa `?now=2026-09-25T08:00:00%2B02:00`.
- Wochengrenzen und Auswahl prüft `npx --yes tsx scripts/verify-weekly-window.ts`.

Code: [`weeklyWindow.ts`](../../src/lib/weeklyWindow.ts), [`weeklyNews.ts`](../../src/lib/weeklyNews.ts), [`route.ts`](../../src/app/api/news/rss-weekly.xml/route.ts).

## Brevo-Einstellungen

RSS-Campaign-Integration:

- Feed-URL `https://www.meimberg.io/api/news/rss-weekly.xml`
- Template: eigenes Template mit einem HTML-Block aus [`brevo-template.html`](brevo-template.html)
- Zeitplan: wöchentlich, Freitag, morgens. Brevo liest den Feed nur zur Prüfzeit; Items müssen laut Brevo mindestens eine Stunde vorher im Feed stehen.
- Versand: im Testbetrieb „Manually", Brevo legt dann nur einen Entwurf an.

Schneller Template-Test ohne RSS-Lauf: `node --env-file=.env scripts/brevo-template-test.mjs` schickt das Template sofort mit dem aktuellen Wochen-Feed als Testmail (braucht `BREVO_API_KEY`, `BREVO_TEST_TO`, `BREVO_TEST_FROM` in `.env`).

Die Sektionen trennt das Template über `item.AUTHOR` (`Oli`, `Artikel`, `Morpheuxx`, `Awesome Apps`). Eine Brevo-Integration liest genau einen Feed, getrennte Feeds pro Sektion würden getrennte Mails ergeben.

## Anmeldung

`/api/newsletter` meldet bis zur Umstellung weiter bei Buttondown an. Die Brevo-Variante (Double-Opt-In, Variablen `BREVO_API_KEY` als Secret, `BREVO_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`, `BREVO_DOI_REDIRECT_URL`) liegt in Commit `0592063` und wurde für den Testbetrieb zurückgenommen; zur Umstellung per `git revert` des Revert-Commits wieder einspielen.

## Nach der Umstellung

- Anmeldung auf Brevo umstellen (siehe oben), Abonnenten aus Buttondown importieren.
- Buttondown-RSS-Automation abschalten.
- [Design](../superpowers/specs/2026-08-12-newsletter-weekly-feed-design.md) und [Plan](../superpowers/plans/2026-08-12-newsletter-weekly-feed.md) des Buttondown-Wochen-Feeds sind überholt.
