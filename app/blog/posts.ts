export interface Post {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  category: string
  content: string
}

export const posts: Post[] = [
  {
    slug: 'hoe-volg-je-leads-op-zonder-crm',
    title: 'Hoe volg je leads op zonder CRM',
    description:
      'Een duur CRM is niet altijd nodig. Ontdek hoe freelancers en kleine bedrijven leads slim opvolgen met eenvoudige systemen — en waar automatisering écht het verschil maakt.',
    date: '2026-03-28',
    readTime: '5 min',
    category: 'Strategie',
    content: `
## Het probleem met handmatige opvolging

Elke ondernemer kent het: een lead stuurt een bericht, jij bent druk met een klus, en drie dagen later — als je eindelijk terugschrijft — hoor je niets meer. Ze zijn al bij de concurrent.

Onderzoek toont aan dat **de kans op conversie met 80% daalt als je langer dan 5 minuten wacht** met een eerste reactie. Vijf minuten. Voor de meeste MKB'ers is dat onhaalbaar.

## Wat werkt als je geen CRM hebt

Niet elk bedrijf heeft budget voor HubSpot of Salesforce. En eerlijk gezegd: voor vrijwel elk bedrijf onder de 50 medewerkers is een CRM ook niet noodzakelijk — als je maar een systeem hebt.

### 1. Eén plek voor alle leads

Gebruik één e-mailadres voor al je leadverkeer. Geen aparte formulieren die naar verschillende inboxen sturen. Centralisereer alles.

### 2. Een vaste opvolgtemplate

Schrijf één goede bevestigingsmail die je altijd stuurt binnen 5 minuten na binnenkomst. Dit hoeft geen roman te zijn:

> *"Hoi [naam], bedankt voor je bericht! Ik heb alles goed ontvangen en neem uiterlijk morgen contact op."*

Simpel, maar het werkt. De lead weet dat hij gezien is.

### 3. Prioriteer op waarde

Niet elke lead verdient evenveel aandacht. Stel jezelf drie vragen:
- Heeft deze persoon een concreet probleem dat ik kan oplossen?
- Is er een indicatie van budget?
- Is de timing urgent?

Een lead die "volgende maand misschien" wil beginnen, verdient minder directe aandacht dan iemand die "zo snel mogelijk" wil starten.

## Waar automatisering het overnemen

Het probleem met handmatige opvolging is dat het schaalbaar is — totdat je ineens meer leads krijgt. Dan valt het systeem uiteen.

Automatisering lost dit op zonder dat je een duur CRM nodig hebt. Tools zoals Runvex:

- **Sturen direct een bevestiging** zodra een formulier binnenkomt — ook om 03:00 's nachts
- **Scoren elke lead** op basis van urgentie, sector en berichtinhoud
- **Plannen een follow-up** voor precies het juiste moment — niet te vroeg, niet te laat

Het resultaat: jij focust op de gesprekken die ertoe doen, terwijl de rest automatisch wordt afgehandeld.

## De conclusie

Je hebt geen CRM nodig om leads goed op te volgen. Wat je wél nodig hebt:

1. Een centraal punt voor alle inkomende leads
2. Een directe bevestigingsmail (binnen 5 minuten)
3. Een systeem dat prioriteit bepaalt
4. Geautomatiseerde follow-ups voor leads die je nog niet hebt gesproken

Start simpel, meet wat werkt, en schaal daarna op. Automatisering is de logische volgende stap — niet het startpunt.
    `.trim(),
  },
  {
    slug: 'ai-lead-scoring-uitgelegd',
    title: 'AI lead scoring uitgelegd: hoe werkt het en waarom doet het ertoe?',
    description:
      'AI lead scoring klinkt complex, maar het idee is simpel: niet elke lead is even waardevol. Leer hoe AI bepaalt welke leads prioriteit verdienen — en hoe je dit zelf kunt toepassen.',
    date: '2026-04-01',
    readTime: '6 min',
    category: 'AI & Technologie',
    content: `
## Wat is lead scoring?

Lead scoring is het proces waarbij je aan elke binnenkomende lead een score geeft op basis van hoe interessant ze zijn voor jouw bedrijf. Een score van 90/100 betekent: hoge prioriteit, bel deze persoon vandaag nog. Een score van 30/100 betekent: stuur een informatieve e-mail en wacht af.

Traditioneel deden sales teams dit handmatig. AI doet het in milliseconden.

## Hoe beoordeelt AI een lead?

Een goed AI-systeem kijkt naar meerdere factoren tegelijk:

### Berichtinhoud
Wat schrijft de lead precies? "Ik zoek informatie" is anders dan "Wij willen per 1 mei live zijn en hebben een budget van €10.000." De tweede lead is concreter, urgenter en klaarder om te kopen.

### Bedrijfscontext
Is het bedrijf groot genoeg om jouw dienst af te nemen? Een eenpitter die vraagt naar enterprise-pricing is waarschijnlijk geen goede fit — en andersom.

### Tijdsindicatoren
Woorden als "zo snel mogelijk," "volgende maand" of "we hebben een deadline" wijzen op urgentie. AI herkent dit en verhoogt de score.

### Sector en niche
Sommige sectoren converteren beter dan andere voor jouw specifieke dienst. AI leert dit patroon na verloop van tijd.

## Een concreet voorbeeld

Stel: iemand vult een contactformulier in met dit bericht:

*"Hoi, ik ben marketingmanager bij een SaaS-bedrijf met 25 medewerkers. We ontvangen zo'n 80 leads per maand maar missen er veel door trage opvolging. We hebben budget vrijgemaakt en willen dit kwartaal een oplossing implementeren."*

Een AI-systeem als Runvex analyseert dit en ziet:
- ✓ Concreet probleem omschreven
- ✓ Bedrijfsgrootte en sector vermeld
- ✓ Budget aanwezig
- ✓ Urgente tijdsindicator ("dit kwartaal")
- ✓ Hoog volume leads (past bij automatisering)

Score: **92/100** — bel deze persoon vandaag.

## Waarom maakt scoring verschil?

Zonder scoring behandel je elke lead hetzelfde. Dat kost tijd en leidt tot frustatie: je besteedt uren aan leads die nooit converteren, terwijl hoge-prioriteit leads op je wachten.

Met scoring weet je in één oogopslag waar je je energie in stopt. Het resultaat:

- **Minder tijd verspild** aan leads die toch niet kopen
- **Snellere opvolging** voor leads die er wél toe doen
- **Hogere conversie** omdat je de juiste aandacht geeft op het juiste moment

## Is AI scoring accuraat?

Het hangt af van de kwaliteit van de AI en de trainingdata. Bij Runvex gebruiken we Claude — het taalmodel van Anthropic — dat getraind is op enorme hoeveelheden zakelijke communicatie.

Claude begrijpt nuance. Het verschil tussen "ik ben geïnteresseerd" en "we moeten dit oplossen voor onze investeerders volgende maand" is iets wat een simpele regelset mist, maar Claude herkent.

## Conclusie

AI lead scoring is geen magie — het is patroonherkenning op schaal. Het doet wat een ervaren sales professional doet als hij een lead beoordeelt, maar sneller, consistenter en 24/7.

Als je meer dan 20 leads per maand ontvangt en handmatig prioriteit bepaalt, laat je geld op tafel liggen. AI scoring is de oplossing.
    `.trim(),
  },
  {
    slug: '5-redenen-waarom-mkb-leads-misloopt',
    title: '5 redenen waarom MKB leads misloopt (en hoe je het voorkomt)',
    description:
      'Trage reacties, vergeten follow-ups, geen prioritering — MKB-ondernemers laten elke maand omzet liggen door vermijdbare fouten in hun leadproces. Dit zijn de 5 grootste.',
    date: '2026-04-03',
    readTime: '4 min',
    category: 'Groei',
    content: `
## Inleiding

De gemiddelde MKB-ondernemer ontvangt minder leads dan een groot bedrijf — maar de leads die binnenkomen zijn niet minder waard. Toch gaat er structureel omzet verloren. Niet door slechte producten of hoge prijzen, maar door fouten in het proces.

Dit zijn de vijf meest gemaakte fouten.

---

## 1. Te lang wachten met reageren

De meest voorkomende fout is ook de meest schadelijke. Onderzoek van Harvard Business Review toont aan dat bedrijven die binnen een uur reageren **7x hogere kans hebben** op een zinvol gesprek dan bedrijven die een dag later reageren.

Voor MKB is dit een groot probleem: de eigenaar is druk, niemand anders is verantwoordelijk, en de lead ontvangt nul reactie totdat iemand tijd heeft.

**Oplossing:** Automatiseer de eerste bevestiging. Ongeacht hoe druk je bent, een lead moet binnen 5 minuten weten dat zijn bericht is ontvangen.

---

## 2. Geen systeem voor follow-ups

"Ik ga dat straks nog even doen" is de doodsteek voor lead opvolging. Als er geen systeem is dat je herinnert, valt een aanzienlijk deel van de leads door de mand.

Dit is geen luiheid — het is gebrek aan structuur. Een lead die zegt "ik laat het je weten volgende week" heeft een follow-up nodig. Zonder systeem vergeet je het.

**Oplossing:** Stel automatische follow-up e-mails in voor leads die je nog niet hebt omgezet. Na 3 dagen, na 7 dagen, na 14 dagen. Eenvoudig en effectief.

---

## 3. Alle leads gelijk behandelen

Niet elke lead verdient evenveel aandacht. Toch behandelen de meeste MKB'ers elke aanvraag hetzelfde: een standaard antwoord, een standaard offerte, standaard communicatie.

Het gevolg: je besteedt evenveel tijd aan een lead die "ooit misschien" wil kopen als aan iemand die volgende week wil starten.

**Oplossing:** Prioriteer op basis van urgentie, budget en concrete behoefte. AI scoring doet dit automatisch.

---

## 4. Formulieren die naar de verkeerde inbox sturen

Technisch klinkt dit simpel, maar het is verrassend vaak een probleem. Contactformulieren die naar een info@-adres sturen dat niemand dagelijks checkt. Of formulieren die in de spam terechtkomen.

**Oplossing:** Test je formulieren maandelijks. Stuur alles naar één inbox die dagelijks gelezen wordt. Stel een melding in als er een formulier binnenkomt.

---

## 5. Geen data over wat werkt

De meeste MKB'ers weten niet hoeveel leads ze per maand ontvangen, wat de gemiddelde conversietijd is, of welke kanalen de beste leads opleveren.

Zonder data kun je niet verbeteren. Je werkt op gevoel, en gevoel is zelden schaalbaar.

**Oplossing:** Gebruik een dashboard dat bijhoudt hoeveel leads er binnenkomen, wat de score is, en welke worden omgezet. Zelfs een simpele spreadsheet is beter dan niets.

---

## Conclusie

De goede nieuws: al deze fouten zijn vermijdbaar. Ze vereisen geen groot team of duur CRM. Ze vereisen systemen — en die systemen kunnen grotendeels geautomatiseerd worden.

Runvex is gebouwd om precies deze vijf problemen op te lossen: directe bevestiging, automatische follow-ups, AI scoring, centrale inbox en een helder dashboard. Alles in één tool, voor een prijs die past bij MKB.
    `.trim(),
  },
]

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}
