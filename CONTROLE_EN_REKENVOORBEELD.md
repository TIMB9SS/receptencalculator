# Controle van de receptencalculator – 6BCW

## Wat de calculator doet
De pagina `index.html` is zelfstandig te openen in Chrome, Edge of Firefox. Geef batchgewicht en de gewenste **suiker %, vet %, VVMB %, overige droge stof %, PAC en POD** in. Kies de ingrediënten en klik op **Bereken recept**. De website geeft de hoeveelheden in gram, de berekende waarden, afwijkingen en een CSV-export.

## Hoe werkt de wiskunde?
Voor ieder ingrediënt i bestaat een onbekende massa `x_i` in gram.
- **Massabalans:** `som(x_i) = totaal batchgewicht`.
- **Suiker/vet/VVMB/overig:** `som(x_i * percentage_i / 100)` geeft massa van de betreffende fractie in gram.
- **PAC/POD:** `som(x_i * factor_i)` in equivalenten; gedeeld door batchgewicht en omgerekend naar 1 kg voor de getoonde resultaten.
- De simplex-oplosser minimaliseert afwijkingen van de zes doelen onder massa-, ingrediënten- en (voorbeeld-)maximumeisen. De website toont eerlijk wanneer doelen niet allemaal haalbaar zijn.

## Controlevoorbeeld onafhankelijk met de hand nagerekend
Samenstelling van exact **1000 g**, met alleen ingrediënten uit de aangeleverde tabel:
| Ingrediënt | Hoeveelheid (g) |
|---|---:|
| Volle melk (3,5%) | 600 |
| Room (35% vet) | 200 |
| Magere melkpoeder | 50 |
| Suiker | 140 |
| Stabilisator | 5 |
| Water | 5 |
| **Totaal** | **1000** |

Berekend uit de vier percentages in de screenshot: suiker **14,00%** (140 g), vet **9,15%** (91,5 g), VVMB **11,31%** (113,1 g), overige droge stof **0,50%** (5 g). Totaal droge stof **34,96%** en water **65,04%**.

**Onder de voorlopige PAC/POD-factorinterpretatie**: PAC **201,5195 g/kg**, POD **149,86232 g/kg**. Voer deze zes doelen bij 1000 g in; de test bevestigt dat de calculator een exact passende oplossing vindt. Andere ingrediëntenmixen kunnen dezelfde doelen bereiken.

## Wat nog niet onafhankelijk vaststaat
De screenshot toont waarden zoals 4,905 PAC en 0,7848 POD voor volle melk. De huidige code neemt voor een aantal zuivelproducten een deling door **100** aan, maar de originele spreadsheetformules en een volledig uitgewerkt lesvoorbeeld ontbreken. De berekeningen zijn daardoor **intern getest maar niet inhoudelijk gevalideerd door de les**. Voor sommige grondstoffen lijken waarden ongewoon, bijvoorbeeld gecondenseerde melk, hazelnootpasta en inuline. De maxima in g/kg en het sorbetminimum (20% fruit) zijn eigen didactische voorbeeldregels.

**Gebruik de resultaten dus nog niet als gegarandeerd juiste ijsreceptuur.** Vraag de leerkracht om één uitgewerkt voorbeeld of het originele spreadsheet; vergelijk en corrigeer die regels zo nodig.

## Automatische test
Met Node.js: `node tests/test_model.js`. De test rekent de zes waarden na, controleert 49 ingrediënten, de massabalans voor 100/500/1000/5000 g en foutafhandeling.

## Samenwerking
Deze repository is privé. De leerkracht `ja-dore` is uitgenodigd; alleen zijzelf kan de uitnodiging accepteren. De klaspartner moet ook een eigen, inhoudelijke bijdrage aan het project committen; alleen een uitnodiging is geen contributie.
