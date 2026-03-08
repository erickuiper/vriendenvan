# agents.md

## Doel
Bouw een browsergame die in **Google Chrome** draait en een Nederlandse jongen van **7 jaar** helpt om de **vrienden van getallen van 3 t/m 10** te automatiseren.

### Wat zijn “vrienden van een getal”?
**Vrienden van een getal** zijn getalcombinaties die **samen dat getal maken** (waarvan de som gelijk is aan dat getal). De speler moet in het spel die combinaties vinden.

Voorbeeld voor **vrienden van 3** (combinaties die samen 3 maken):
- 0 en 3, 1 en 2

In het spel: **elke kaart toont één getal**. De speler draait twee kaarten om; als die twee getallen **samen het doelgetal maken** (som = doelgetal), is het een match. Voor getal 3 zijn er kaarten met 0, 1, 2 en 3; de speler zoekt bijvoorbeeld 0 bij 3, en 1 bij 2.

De app moet dit in **spelvorm** aanbieden, met een eenvoudige, vrolijke en kindvriendelijke ervaring. De oplossing moet door de AI-agent ook automatisch getest worden op correcte werking.

---

## Productvisie
De speler kiest een getal tussen 3 en 10. De app genereert alle **combinaties die samen dat getal maken** (getalparen waarvan de som gelijk is aan het gekozen getal). Daarna speelt de gebruiker een **memoryspel** waarin hij/zij die combinaties bij elkaar zoekt. De volgorde maakt niet uit: `1-3` en `3-1` zijn dus dezelfde combinatie. Zodra alle combinaties gevonden zijn, volgt een duidelijke beloning met **ballonnen** en **confetti**.

De game moet:
- intuïtief zijn voor een kind van 7;
- weinig tekst gebruiken;
- sterk visueel werken;
- fouttolerant zijn;
- snel laden en lokaal in Chrome werken.

---

## Scope

### In scope
- Browserapp voor desktop/laptop in Chrome
- Startscherm
- Keuze van een getal van 3 t/m 10
- Automatisch genereren van alle combinaties voor dat gekozen getal
- Memoryspel gebaseerd op die combinaties
- Matchlogica waarbij volgorde niet uitmaakt
- Winstscherm met felicitaties, ballonnen en confetti
- Geautomatiseerde tests voor logica en basis user flow

### Out of scope
- Backend of database
- Accountregistratie
- Multiplayer
- Native mobiele app
- Complexe analytics
- Externe afhankelijkheid voor core gameplay-data

---

## Doelgroep
- Primaire gebruiker: Nederlandstalig kind van 7 jaar
- Secundaire gebruikers: ouder, verzorger of leerkracht die de game opstart of helpt

### UX-uitgangspunten
- Grote knoppen
- Grote cijfers
- Zeer weinig tekst
- Rustige layout
- Heldere feedback bij goed/fout
- Geen afleidende navigatie
- Visuele beloning bij succes

---

## Functionele eisen

### 1. Startscherm
De app toont:
- een vrolijke titel;
- een korte instructie in eenvoudig Nederlands;
- knoppen voor de getallen `3` t/m `10`.

### 2. Getal kiezen
Wanneer de speler een getal kiest:
- wordt dit getal de actieve speelsessie (het **doelgetal** dat twee kaarten samen moeten maken);
- genereert de app kaarten met **één getal per kaart**: voor elke combinatie die samen het doelgetal maakt, twee kaarten (één per getal). Voor 2+2 twee kaarten met 2.

Voorbeeld voor getal **4** (combinaties die samen 4 maken):
- kaarten (één getal per kaart): `0`, `4`, `1`, `3`, `2`, `2`
- een match: twee kaarten waarvan de **som** 4 is, dus 0+4, 1+3 of 2+2

### 3. Memory genereren
Het memorybord wordt opgebouwd uit kaarten. **Elke kaart toont precies één getal.**

Regels:
- twee kaarten matchen als de **som van de twee getallen** gelijk is aan het gekozen doelgetal;
- kaarten blijven zichtbaar zodra een match gevonden is.

### 4. Gameplay
- De speler klikt twee kaarten open.
- **Foutjesteller**: tijdens het spel wordt altijd het aantal fouten getoond (bijv. *Foutjes: 0*). Visueel zacht en niet bestraffend.
- **Fout**: een beurt waar de speler twee kaarten omdraait en de som van de twee waarden *niet* gelijk is aan het doelgetal. Bij een fout wordt de teller met 1 verhoogd.
- Bij een juiste match:
  - positieve feedback tonen;
  - kaarten gematcht markeren;
  - optioneel subtiel geluid of animatie ondersteunen.
- Bij een foute match:
  - korte foutfeedback tonen;
  - kaarten na een korte vertraging weer sluiten.

### 5. Einde van het spel (graded reward)
Wanneer alle matches gevonden zijn:
- **Altijd tonen**: het totaal aantal gemaakte fouten (*Foutjes gemaakt: X*).
- **Beloningsniveaus** (gebaseerd op aantal fouten):
  - **>5 fouten**: licht teleurgesteld gezicht, ondersteunende boodschap, minimale viering, aanmoediging om opnieuw te proberen.
  - **4–5 fouten**: neutraal gezicht, kleine positieve feedback, beperkte viering.
  - **2–3 fouten**: licht blij gezicht, ballonnen, positieve boodschap.
  - **1 fout**: blij gezicht, meer ballonnen, lichte confetti, sterke positieve boodschap.
  - **0 fouten (perfecte ronde)**: groot blij gezicht, volle ballonnen en confetti, extra badge/ster (*Perfecte ronde*), boodschap zoals *Wauw, 0 foutjes!* of *Perfect gespeeld!*.
- Viering (ballonnen, confetti) schaalt met het beloningsniveau; 0 fouten krijgt de sterkste viering.
- Knop **Nog een keer** en knop **Kies een ander getal**.
- **UX**: nooit straffen voor fouten; normale winst blijft succesvol; perfecte ronde voelt als bonus, geen vereiste.

---

## Niet-functionele eisen
- Werkt in recente versies van **Google Chrome**
- Responsief binnen normaal browservenster op laptop/desktop
- Snelle laadtijd
- Geen backend nodig voor basisfunctionaliteit
- Codebase moet eenvoudig onderhoudbaar zijn voor een AI-agent
- Tests moeten lokaal uitvoerbaar zijn
- UI moet toegankelijk zijn voor jonge kinderen

---

## Aanbevolen technologiekeuze

### Frontend
- **TypeScript**
- **React**
- **Vite**

### Styling
- **CSS Modules** of eenvoudige component-scoped CSS
- Heldere, speelse vormgeving zonder zware design libraries

### Testing
- **Vitest** voor unit tests
- **React Testing Library** voor component- en interactietests
- **Playwright** voor end-to-end tests in Chrome

### Waarom deze stack
- snel op te zetten;
- goed testbaar;
- sterk voor browserapps;
- eenvoudig voor een AI-agent om consistent in te werken;
- Playwright kan echte browserflows valideren in Chrome-achtige omgeving.

---

## Architectuur

### Hoofdonderdelen
1. **App shell**
   - routerloze single-page app
   - schermstatus beheren

2. **Game configuration module**
   - gekozen doelgetal opslaan
   - spel resetten

3. **Kaartwaarden genereren**
   - voor het doelgetal alle getalparen die samen dat getal maken
   - per combinatie twee kaarten (één getal per kaart)

4. **Memory board logic**
   - kaarten schudden
   - flip-status beheren
   - matchcontrole uitvoeren
   - winconditie bepalen
   - fouten tellen per ronde

5. **Reward tier logic** (`logic/rewardTier.ts`)
   - `getRewardTier(mistakes)` voor beloningsniveau
   - teksten en vieringsniveau per tier

6. **Celebration layer**
   - confetti en ballonnen; intensiteit afhankelijk van reward tier

7. **Test suite**
   - logica testen
   - componentgedrag testen
   - end-to-end user flow testen

---

## Datamodel

### Card
Elke kaart toont **één getal**. Twee kaarten matchen als hun waarden samen het doelgetal vormen.
```ts
interface Card {
  id: string;
  value: number;       // het getal op de kaart (0 t/m doelgetal)
  isFlipped: boolean;
  isMatched: boolean;
}
```

### GameState
```ts
type RewardTier =
  | 'needs-encouragement'  // >5 fouten
  | 'ok'                   // 4–5 fouten
  | 'good'                 // 2–3 fouten
  | 'great'                // 1 fout
  | 'perfect';             // 0 fouten

interface GameState {
  targetNumber: number | null;
  cards: Card[];
  flippedCardIds: string[];
  moves: number;
  mistakes: number;   // aantal foute paren deze ronde
  status: 'start' | 'playing' | 'won';
}
```
De `rewardTier` wordt afgeleid uit `mistakes` bij status `'won'` (pure functie `getRewardTier(mistakes)`).

---

## Kernlogica

### Genereren van kaartwaarden
Voor gekozen doelgetal `n`: voor elke combinatie die samen `n` maakt (d.w.z. `(i, n - i)` voor `i` van `0` t/m `floor(n/2)`), voeg twee kaarten toe: één met waarde `i`, één met waarde `n - i`. Zo heeft elke kaart **één getal**.

Voorbeeld voor getal **5** (combinaties die samen 5 maken):
- kaartwaarden: `0`, `5`, `1`, `4`, `2`, `3` (6 kaarten)

### Matchregel
Twee kaarten matchen als **de som van hun waarden** gelijk is aan het doelgetal (en het zijn twee verschillende kaarten).

---

## Schermontwerp

### Scherm 1: Start
Elementen:
- titel, bijvoorbeeld: **Vriendjes van Getallen**
- korte uitleg: **Kies een getal en zoek de combinaties die dat getal maken!**
- knoppen `3` t/m `10`

### Scherm 2: Game
Elementen:
- terugknop
- zichtbaar gekozen getal
- **Foutjes: X** (foutjesteller, kindvriendelijk)
- memory grid
- eenvoudige statusregel, bijvoorbeeld: **Zoek de combinaties die samen [getal] maken!**

### Scherm 3: Gewonnen (graded reward)
Elementen:
- **Foutjes gemaakt: X** (altijd zichtbaar)
- Gezicht/emoji en titel/tekst afhankelijk van beloningsniveau (0 t/m >5 fouten)
- Bij 0 fouten: extra **Perfecte ronde**-badge/ster
- Confetti en ballonnen: intensiteit afhankelijk van tier (0 fouten = maximaal)
- Knop **Nog een keer**
- Knop **Kies een ander getal**

---

## Visueel ontwerp
- Speelse primaire kleuren
- Hoge contrasten
- Grote afgeronde kaarten
- Grote cijfers en minimale tekst
- Subtiele animaties
- Rustige achtergrond
- Geen reclame, geen extra menu’s

### Aanbevolen stijl
- vriendelijk
- school-proof
- leerzaam maar speels
- niet druk of overprikkelend

---

## Gedragsregels voor de AI-agent

### De agent moet
- een complete werkende browserapp bouwen;
- kiezen voor een eenvoudige, moderne frontend-stack;
- duidelijke en kleine componenten maken;
- logica scheiden van presentatie;
- alle kernlogica voorzien van unit tests;
- componentinteracties testen;
- een end-to-end test toevoegen die de hoofdflow valideert;
- zorgen dat de app lokaal start en in Chrome werkt;
- **vóór elke commit alle tests draaien** (unit, component én e2e): `npm run test:all` of eerst `npm run test` dan `npm run test:e2e`; pas committen als alle tests groen zijn; nooit committen met falende tests.

### De agent mag aannemen
- taal van de interface is Nederlands;
- de gebruiker bedient de app met muis of touchpad;
- initiële uitvoering gebeurt lokaal in een moderne ontwikkelomgeving.

### De agent moet vermijden
- onnodig complexe architectuur;
- backend tenzij strikt nodig;
- zware state-management libraries;
- afhankelijkheid van externe API’s voor kernfunctionaliteit.

---

## Verwachte projectstructuur
```text
project-root/
├─ src/
│  ├─ components/
│  │  ├─ NumberPicker.tsx
│  │  ├─ MemoryBoard.tsx
│  │  ├─ MemoryCard.tsx
│  │  ├─ Celebration.tsx
│  │  └─ Header.tsx
│  ├─ logic/
│  │  ├─ pairs.ts
│  │  ├─ memory.ts
│  │  └─ shuffle.ts
│  ├─ hooks/
│  │  └─ useMemoryGame.ts
│  ├─ styles/
│  │  └─ *.css
│  ├─ App.tsx
│  └─ main.tsx
├─ tests/
│  ├─ unit/
│  ├─ component/
│  └─ e2e/
├─ package.json
├─ vite.config.ts
├─ vitest.config.ts
└─ playwright.config.ts
```

---

## Teststrategie

### Unit tests
Test minimaal:
1. genereren van kaartwaarden (één getal per kaart) voor een gekozen getal;
2. matchdetectie: twee kaarten matchen als hun som het doelgetal is;
3. correcte afhandeling van dubbele waarden (bijv. twee kaarten met 2 voor doelgetal 4);
4. winconditie als alle kaarten gematcht zijn;
5. **Foutentracking**: `mistakes` start op 0; neemt toe na een fout paar; neemt niet toe bij een juiste match;
6. **Reward tier**: `getRewardTier(mistakes)` geeft de juiste tier voor 0, 1, 2–3, 4–5, >5.

### Component tests
Test minimaal:
1. startscherm toont getallen 3 t/m 10;
2. kiezen van een getal start het spel;
3. kaarten worden weergegeven;
4. juiste match blijft open;
5. foute match sluit weer;
6. foutjesteller wordt getoond tijdens spel (bijv. *Foutjes: 0*).

### End-to-end tests
Gebruik Playwright en valideer minimaal:
1. app opent in browser;
2. gebruiker kiest een getal;
3. memorybord verschijnt;
4. alle matches kunnen worden gevonden;
5. winstscherm met felicitatie en visueel feestje verschijnt;
6. op winstscherm: *Foutjes gemaakt: X* is zichtbaar; koptekst past bij beloningsniveau.

### Testuitvoer
De agent moet testcommando’s opleveren zoals:
```bash
npm install
npm run test
npm run test:e2e
npm run test:all
npm run dev
```

**Voor elke commit:** alle tests draaien (unit, component én e2e), bijv. met `npm run test:all`; alleen committen als alle tests slagen.

---

## Acceptatiecriteria
De oplossing is geslaagd wanneer:
1. de app in Chrome opent zonder backend;
2. de gebruiker een getal van 3 t/m 10 kan kiezen;
3. alle juiste somparen voor dat getal worden gegenereerd;
4. het memoryspel correct werkt;
5. `a-b` en `b-a` als dezelfde match tellen;
6. het spel eindigt zodra alle matches gevonden zijn;
7. tijdens het spel het aantal fouten zichtbaar is (*Foutjes: X*);
8. op het winstscherm het totaal aantal gemaakte fouten wordt getoond en de viering (ballonnen, confetti) en tekst/gezicht schalen met het aantal fouten (0 fouten = sterkste beloning);
9. automatische tests aanwezig zijn en slagen.

---

## Edge cases
- Getal `3` moet correct werken met kleine set
- Getal `10` moet correct werken met grotere set
- Paar `n/2 - n/2` moet correct als dubbele kaartset speelbaar zijn bij even getallen
- Snelle dubbele klikken mogen state niet corrupt maken
- Tijdens een korte mismatch-animatie mogen extra kliks geblokkeerd worden

---

## Voorbeeldlogica

### Voor getal 3 (combinaties die samen 3 maken)
Kaarten (één getal per kaart): `0`, `3`, `1`, `2` (4 kaarten).
Matches: 0+3, 1+2.

### Voor getal 4 (combinaties die samen 4 maken)
Kaarten: `0`, `4`, `1`, `3`, `2`, `2` (6 kaarten).
Matches: 0+4, 1+3, 2+2 (twee kaarten met 2).

---

## Definition of done
- Werkende React + TypeScript app
- Draait lokaal in Chrome
- Nederlandse UI
- Kindvriendelijke styling
- Matchlogica correct
- Winanimatie aanwezig
- Unit, component en e2e tests aanwezig
- Alle tests groen
- Code leesbaar en modulair

---

## Opdracht aan de uitvoerende AI-agent
Implementeer deze applicatie als een complete, lokaal draaibare browserapp voor Chrome. Maak een eenvoudige en vrolijke interface voor een 7-jarige. Zorg dat de logica voor getalvrienden correct is, inclusief het behandelen van omgekeerde volgordes als dezelfde match. Voeg automatische tests toe voor logica, componentgedrag en end-to-end werking. Lever een oplossing op die direct lokaal gestart en getest kan wo