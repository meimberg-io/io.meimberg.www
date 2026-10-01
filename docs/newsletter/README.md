# Newsletter über Brevo

Stand 2026-10-01: Der Newsletter läuft über Brevo (RSS-Integration auf `/api/news/rss.xml`, freitags 10:00). Buttondown ist abgeschaltet.

## Feed

Brevo liest den normalen News-Feed `/api/news/rss.xml` und filtert selbst: in jede Kampagne kommen die Items, deren `pubDate` zwischen den letzten beiden Prüfzeiten liegt (jeweils 30 Minuten vorher). Damit das für Blogartikel stimmt, tragen sie eine echte Uhrzeit: der SmartEditor setzt das Storyblok-Feld `date` beim Veröffentlichen einer nicht veröffentlichten Story auf den Veröffentlichungszeitpunkt (Kanal-Einstellung „Veröffentlichungszeit in Feld" = `date`), der Blog-Feed liest den Wert als UTC. Storyblok-Bilder liefert der News-Feed als 1200-px-JPEG.

Zum Testen den Wochentag der Prüfung in Brevo verschieben: bei wöchentlichem Zeitplan kommen die letzten sieben Tage.

### Wochen-Feed (abgelöst)

`/api/news/rss-weekly.xml` enthält genau die abgeschlossene Woche Freitag 00:00 bis Donnerstag 24:00, Europe/Berlin. Ab Freitag 00:00 steht die eben beendete Woche im Feed.

- Höchstens 10 Items, weil Brevo pro RSS-Kampagne nicht mehr holt. Blog, Artikel und Morpheuxx gehen immer komplett rein, Awesome Apps füllen die restlichen Plätze, neueste zuerst.
- Sortiert nach Sektion (Blog und Artikel, Morpheuxx, Awesome Apps), darin neueste zuerst.
- Jedes Item trägt `<mb:section>` (`blog`, `morpheuxx`, `apps`, `other`) und `<mb:first>` (`1` beim ersten Item seiner Sektion, sonst `0`). Brevo macht daraus `item.MB_SECTION` und `item.MB_FIRST`.
- `pubDate` ist der Freischaltzeitpunkt (Freitag 00:00 plus einige Sekunden), das Originaldatum steht in `<dc:date>`. Grund: Brevo übernimmt nur Items, deren `pubDate` zwischen den letzten beiden Prüfzeiten liegt (jeweils 30 Minuten vorher). Mit dem Originaldatum fielen Freitags-Beiträge vor der Prüfzeit heraus, Blogartikel mit Datum 00:00 immer.
- `?test=1` ist der Testmodus für eine täglich prüfende Test-Integration: gleicher Inhalt, aber `pubDate` eine Stunde vor dem Abruf und `guid` pro Tag neu, damit Brevo die Woche bei jeder Prüfung als neu sieht. Nie für die echte Integration verwenden, sonst geht dieselbe Woche jeden Tag raus.
- `?now=<ISO-8601>` berechnet das Fenster für einen anderen Zeitpunkt, zum Prüfen beliebiger Wochen, etwa `?now=2026-09-25T08:00:00%2B02:00`.
- Wochengrenzen und Auswahl prüft `npx --yes tsx scripts/verify-weekly-window.ts`.

Code: [`weeklyWindow.ts`](../../src/lib/weeklyWindow.ts), [`weeklyNews.ts`](../../src/lib/weeklyNews.ts), [`route.ts`](../../src/app/api/news/rss-weekly.xml/route.ts).

## Brevo-Einstellungen

RSS-Campaign-Integration:

- Feed-URL `https://www.meimberg.io/api/news/rss-weekly.xml`
- Template: eigenes Template „Newsletter" (ID 1), Aufbau siehe unten
- Zeitplan: Freitag 10:00, Versand automatisch. Brevo liest den Feed nur zur Prüfzeit; Items müssen laut Brevo mindestens eine Stunde vorher im Feed stehen.
- Versand: im Testbetrieb „Manually", Brevo legt dann nur einen Entwurf an.

Schneller Template-Test ohne RSS-Lauf: `node --env-file=.env scripts/brevo-template-test.mjs` schickt das Template sofort mit dem aktuellen Wochen-Feed als Testmail (braucht `BREVO_API_KEY`, `BREVO_TEST_TO`, `BREVO_TEST_FROM` in `.env`). Mit `--template 1` nimmt es stattdessen das in Brevo gespeicherte Template „Newsletter" samt Kopf und Footer, mit `--template 1 --local` darin den Stand der lokalen Datei, bevor er in Brevo eingefügt ist.

Die Sektionen entstehen im Template aus nativen Brevo-Blöcken: ein Dynamic-content-Block über `items` (Brevos eigener Block speichert das als `params.items`, der HTML-Block schreibt `params.items` beim Speichern zu `items` um; welche Form der RSS-Versand braucht, ist noch nicht per echtem Lauf bestätigt), darin pro Sektion eine Zeile mit der Anzeigebedingung `item.MB_SECTION` gleich `blog`, `morpheuxx` oder `apps`, und für Morpheuxx und Apps je eine Überschriften-Zeile mit zusätzlich `item.MB_FIRST` gleich `1`. So erscheint eine Überschrift nur, wenn die Sektion Items hat. [`brevo-template.html`](brevo-template.html) ist die frühere Variante als HTML-Block, sie trennt über `item.AUTHOR`. Eine Brevo-Integration liest genau einen Feed, getrennte Feeds pro Sektion würden getrennte Mails ergeben.

## Anmeldung

`/api/newsletter` meldet per Double-Opt-In bei Brevo an: Brevo schickt die Bestätigungsmail, erst nach dem Klick landet der Kontakt in der Liste. Konfiguration: Secret `BREVO_API_KEY` und Variablen `BREVO_LIST_ID` (Liste 2), `BREVO_DOI_TEMPLATE_ID` (Double-Opt-In-Vorlage aus Brevo) und `BREVO_DOI_REDIRECT_URL` (Seite nach der Bestätigung) in GitHub. Fehlt eine davon, antwortet die Route mit „nicht konfiguriert". Die Buttondown-Variante steht in der Git-Historie (Commit `0592063` ist die Umstellung).

## Nach der Umstellung

- Abonnenten sind importiert, Buttondown ist abgeschaltet, die Anmeldung läuft über Brevo.
- [Design](../superpowers/specs/2026-08-12-newsletter-weekly-feed-design.md) und [Plan](../superpowers/plans/2026-08-12-newsletter-weekly-feed.md) des Buttondown-Wochen-Feeds sind überholt.
