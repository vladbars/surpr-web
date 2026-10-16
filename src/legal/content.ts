// UI copy is written in the project language (German). Route and section IDs are not translation keys.
export const legalPages = {
  impressum: {
    title: 'Impressum',
    intro: 'Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG).',
    sections: [
      { id: 'provider', title: 'Anbieter',
        body: 'Surpr ist ein Angebot von Vladislav Baranov, geführt als Einzelunternehmen.' },
      { id: 'contact', title: 'Kontakt',
        body: 'Bei Fragen zu Surpr, für Unterstützung oder rechtliche Anliegen erreichst du mich unter:' },
      { id: 'identifier', title: 'Wirtschafts-Identifikationsnummer',
        body: 'Wirtschafts-Identifikationsnummer (W-IdNr.) gemäß § 139c Abgabenordnung:' },
      { id: 'disputes', title: 'Verbraucherstreitbeilegung',
        body: 'Ich bin weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.' },
    ],
  },
  privacy: {
    title: 'Datenschutzerklärung',
    intro: 'So geht Surpr in der aktuellen kostenlosen Web-Demo mit deinen Daten um.',
    sections: [
      { id: 'controller', title: '1. Verantwortlicher',
        body: 'Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:' },
      { id: 'demo', title: '2. Deine Demo bleibt im Browser',
        body: 'Empfängername, Nachricht und gewählte Figur werden lokal für die Vorschau verarbeitet. Diese Demo übermittelt sie nicht an unseren Server, speichert sie nicht in einer Datenbank und veröffentlicht keine teilbare Karte. Surpr speichert diese Eingaben nicht dauerhaft; beim Neuladen der Seite wird die Vorschau zurückgesetzt. An diese Demo sind weder ein Nutzerkonto noch eine Bezahlfunktion oder ein KI-Moderationsdienst angebunden. Name und Nachricht sind freiwillig und werden nur für die Personalisierung der lokalen Vorschau benötigt.' },
      { id: 'hosting', title: '3. Hosting und technische Daten',
        body: 'Die Website wird bei der Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Deutschland, auf einem Server in Deutschland gehostet. Beim Besuch können IP-Adresse, Zeitpunkt, angeforderte Ressource, Antwortstatus sowie Browser- oder Geräteinformationen durch die Hosting-Infrastruktur verarbeitet werden, um die Website auszuliefern und technische Fehler oder Missbrauch zu untersuchen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist der sichere und zuverlässige Betrieb. Technische Daten werden nur so lange aufbewahrt, wie dies für die Bereitstellung, Fehleranalyse, Untersuchung von Sicherheitsvorfällen oder eine gesetzliche Pflicht erforderlich ist, und anschließend gelöscht. Die regulären Web-Zugriffsprotokolle enthalten keine IP-Adressen oder vollständigen Anfrage-URLs; Proxy- und Fehlerprotokolle können dennoch personenbezogene Daten enthalten.' },
      { id: 'preferences', title: '4. Sprache, Ton und lokaler Speicher',
        body: 'Surpr bestimmt die Sprache zunächst anhand der Spracheinstellungen deines Browsers. Wenn du Sprache oder Ton ausdrücklich änderst, wird diese Einstellung lokal auf deinem Gerät gespeichert, damit sie bei späteren Besuchen angewendet werden kann. Dieser funktionale Speicher dient den von dir gewünschten Einstellungen gemäß § 25 Abs. 2 Nr. 2 TDDDG; eine damit verbundene Verarbeitung personenbezogener Daten erfolgt nach Art. 6 Abs. 1 lit. f DSGVO mit dem berechtigten Interesse, diese Einstellungen zu berücksichtigen. Surpr setzt keine Werbe- oder Analyse-Cookies ein, verwendet keine Tracking-Pixel und lädt keine externen Schriftarten. Gespeicherte Einstellungen kannst du auf der Seite zur Datenlöschung oder in den Website-Dateneinstellungen deines Browsers entfernen. Die Demo funktioniert auch ohne dauerhaften Speicher.' },
      { id: 'contact', title: '5. Kontakt per E-Mail',
        body: 'Wenn du uns schreibst, verarbeiten wir deine E-Mail-Adresse, Nachricht und die von dir mitgeteilten Angaben zur Beantwortung deiner Anfrage. Bitte übermittle nur dafür benötigte Informationen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bei vertraglichen oder vorvertraglichen Anfragen, andernfalls Art. 6 Abs. 1 lit. f DSGVO aufgrund unseres berechtigten Interesses an ihrer Beantwortung. Korrespondenz wird gelöscht, sobald die Anfrage erledigt und eine weitere Aufbewahrung nicht erforderlich ist, sofern nicht gesetzliche Aufbewahrungspflichten oder die Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen eine längere Speicherung erfordern.' },
      { id: 'recipients', title: '6. Empfänger',
        body: 'Hosting- und E-Mail-Dienstleister können Daten verarbeiten, soweit dies zum Betrieb der Website und zur Bearbeitung der Korrespondenz erforderlich ist. Eine Weitergabe kann außerdem erfolgen, wenn sie gesetzlich vorgeschrieben oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist. Wir verkaufen keine personenbezogenen Daten. Die Demo übermittelt deinen Kartentext weder an Zahlungsanbieter noch an KI-Anbieter. Beim Folgen eines externen Links oder Versenden einer E-Mail nutzt du den jeweiligen fremden Dienst; dabei gelten auch dessen Datenschutzhinweise.' },
      { id: 'rights', title: '7. Deine Rechte',
        body: 'Unter den Voraussetzungen der DSGVO hast du Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit. Wende dich dazu an die unten angegebene E-Mail-Adresse. Wir müssen gegebenenfalls deine Identität prüfen. Wir betreiben kein Profiling und treffen keine ausschließlich automatisierten Entscheidungen mit rechtlicher oder ähnlich erheblicher Wirkung.' },
      { id: 'changes', title: '8. Änderungen dieser Hinweise',
        body: 'Wir aktualisieren diese Informationen, wenn sich die Datenverarbeitung von Surpr ändert, insbesondere vor Einführung von serverseitiger Kartenspeicherung, öffentlichen Links, Käufen oder externer Moderation.' },
    ],
  },
  terms: {
    title: 'Nutzungsbedingungen',
    intro: 'Die Bedingungen für die aktuelle kostenlose Surpr-Web-Demo.',
    sections: [
      { id: 'scope', title: '1. Aktuelles Angebot',
        body: 'Surpr wird von Vladislav Baranov angeboten; die Angaben stehen im Impressum. Die aktuelle Website ist eine kostenlose interaktive Vorschau. Sie bietet weder Käufe oder Abonnements noch die Veröffentlichung und Zustellung von Karten an. Durch das Ausprobieren entsteht keine Zahlungspflicht. Vor einem künftigen kostenpflichtigen Angebot werden Preise, Bereitstellung, Widerrufsrechte und geltende Kaufbedingungen gesondert vor dem Kauf mitgeteilt.' },
      { id: 'use', title: '2. Rücksichtsvoll nutzen',
        body: 'Die Halloween-Vorschau enthält animierte Schreckmomente und nach Interaktion auch Ton. Du kannst den Ton ausschalten; die Einstellung deines Geräts für reduzierte Bewegung wird berücksichtigt. Wähle das Erlebnis mit Rücksicht auf die betrachtende Person. Nutze Surpr nicht für Drohungen, Belästigung, Diskriminierung, Eingriffe in die Privatsphäre oder andere Rechtsverletzungen, rechtswidrige Inhalte oder Angriffe auf Sicherheit und Verfügbarkeit des Dienstes.' },
      { id: 'content', title: '3. Inhalte und Rechte',
        body: 'Gib nur Inhalte ein, zu deren Nutzung du berechtigt bist. Deine Rechte an deinem eigenen Text bleiben bei dir. Durch die Eingabe in diese lokale Demo erhält Surpr kein Recht zur Veröffentlichung. Gestaltung, Illustrationen und Code von Surpr unterliegen dem geltenden Schutz geistigen Eigentums. Komponenten und Audioinhalte Dritter unterliegen ihren jeweiligen Lizenzen.' },
      { id: 'availability', title: '4. Verfügbarkeit und Haftung',
        body: 'Die Demo kann sich ändern oder beispielsweise wegen Wartungsarbeiten zeitweise nicht verfügbar sein. Sie ist kein Speicherdienst; bewahre benötigte Texte bitte selbst auf. Es gelten die gesetzlichen Haftungsregelungen. Zwingende Verbraucherrechte werden durch diese Bedingungen nicht eingeschränkt.' },
      { id: 'law', title: '5. Anwendbares Recht und Kontakt',
        body: 'Es gilt deutsches Recht. Wenn du Verbraucher bist, bleiben zwingende Schutzvorschriften des Staates deines gewöhnlichen Aufenthalts unberührt. Bei Fragen oder Beschwerden nutze die Kontaktdaten im Impressum oder auf der Support-Seite.' },
    ],
  },
  support: {
    title: 'Brauchst du Hilfe?',
    intro: 'Eine Frage, ein technisches Problem oder etwas, das hier nicht hingehört? Schreib uns.',
    sections: [
      { id: 'contact', title: 'Kontakt',
        body: 'Hinter Surpr steht Vladislav Baranov. Für Unterstützung und andere Anliegen erreichst du mich per E-Mail:' },
      { id: 'help', title: 'Ein Problem mit der Demo?',
        body: 'Beschreibe bitte, was passiert ist, und bei Bedarf deinen Browser und dein Gerät. Prüfe bei Tonproblemen die Gerätelautstärke und die Ton-Taste auf der Karte; Audio startet nach einer Interaktion. Die aktuelle Demo veröffentlicht keine Links und nimmt keine Zahlungen entgegen. Sende keine Passwörter, Zugriffstokens, Zahlungsdaten oder privaten Karteninhalte.' },
      { id: 'report', title: 'Probleme oder rechtswidrige Inhalte melden',
        body: 'Schicke uns die betroffene Seiten-URL, deine Beobachtung und den Grund für deine Meldung per E-Mail. Beschränke dich auf Informationen, die für die Prüfung benötigt werden. Über diese Adresse kannst du auch Sicherheitsprobleme vertraulich melden.' },
    ],
  },
  delete: {
    title: 'Deine Daten. Deine Wahl.',
    intro: 'Was du in der aktuellen Surpr-Web-Demo entfernen kannst.',
    sections: [
      { id: 'demo', title: 'Name und Nachricht',
        body: 'Dein Demo-Text und deine Figurenauswahl werden nicht auf unserem Server gespeichert. Lade die Vorschau neu oder schließe sie, um die Eingaben zu verwerfen. In dieser Demo gibt es kein Surpr-Nutzerkonto, das gelöscht werden müsste.' },
      { id: 'preferences', title: 'Gespeicherte Einstellungen',
        body: 'Mit der Schaltfläche unten entfernst du die von Surpr gespeicherten Sprach- und Toneinstellungen aus diesem Browser. Die aktuelle Seite behält ihre Sprache, bis du sie verlässt. Das betrifft nur die gespeicherten Surpr-Einstellungen auf diesem Gerät. Alternativ kannst du die gespeicherten Website-Daten in den Browsereinstellungen löschen.' },
      { id: 'requests', title: 'Weitere Löschanfragen',
        body: 'Wenn du uns kontaktiert hast oder die Löschung anderer personenbezogener Daten anfragen möchtest, schreibe an die unten genannte Adresse. Beschreibe dein Anliegen ohne Passwörter oder sensible Angaben; wir müssen gegebenenfalls deine Identität prüfen. Gesetzliche Aufbewahrungspflichten sowie die Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen können einer sofortigen Löschung einzelner Unterlagen entgegenstehen.' },
    ],
  },
};

export type LegalPageId = keyof typeof legalPages;

export const legalLinks = [
  { path: '/impressum', id: 'impressum', label: 'Impressum' },
  { path: '/privacy', id: 'privacy', label: 'Datenschutz' },
  { path: '/terms', id: 'terms', label: 'Nutzungsbedingungen' },
  { path: '/support', id: 'support', label: 'Support' },
  { path: '/delete', id: 'delete', label: 'Daten löschen' },
] as const;
