// Začetni podatki za RecipeHub. Vsa besedila so originalna.
// Sestavina: [ime, količina | null, enota]
// Iz te datoteke se z `npm run seed:build` generira supabase/02_seed.sql.

export const categories = [
  { slug: 'zajtrk', name: 'Zajtrk', description: 'Hitri in nasitni začetki dneva.' },
  { slug: 'juhe-in-enolocnice', name: 'Juhe in enolončnice', description: 'Tople jedi iz enega lonca.' },
  { slug: 'glavne-jedi', name: 'Glavne jedi', description: 'Kosila in večerje z mesom ali ribami.' },
  { slug: 'vegetarijansko', name: 'Vegetarijansko', description: 'Brez mesa, a polno okusa.' },
  { slug: 'solate-in-priloge', name: 'Solate in priloge', description: 'Sveže solate in priloge k glavni jedi.' },
  { slug: 'sladice', name: 'Sladice', description: 'Od hitrih kremnih sladic do praznične potice.' },
]

export const recipes = [
  // --- Zajtrk ---------------------------------------------------------------
  {
    slug: 'palacinke-z-marelicno-marmelado',
    title: 'Palačinke z marelično marmelado',
    category: 'zajtrk',
    description: 'Tanke palačinke po babičinem receptu, ki jih lahko napolnite s čimerkoli, najboljše pa so z domačo marelično marmelado.',
    prep: 30, difficulty: 'lahka', servings: 4, rating: [38, 4.6],
    ingredients: [
      ['moka', 200, 'g'], ['mleko', 400, 'ml'], ['jajca', 2, 'kos'], ['sol', 1, 'ščep'],
      ['sončnično olje', 2, 'žlici'], ['marelična marmelada', 150, 'g'], ['sladkor v prahu', null, 'po okusu'],
    ],
    steps: [
      'V skledi z metlico zmešaj moko, sol in polovico mleka, da dobiš gladko testo brez grudic.',
      'Dodaj jajca in preostalo mleko ter mešaj, dokler ni testo tekoče kot gosta smetana. Pusti ga počivati 10 minut.',
      'Ponev segrej na srednji temperaturi in jo rahlo namaži z oljem.',
      'Vlij tanko plast testa, ponev zavrti, da se razleže, in peci približno minuto na vsaki strani.',
      'Pečene palačinke namaži z marmelado, zvij in potresi s sladkorjem v prahu.',
    ],
  },
  {
    slug: 'ovseni-kosmici-z-jabolki-in-cimetom',
    title: 'Ovseni kosmiči z jabolki in cimetom',
    category: 'zajtrk',
    description: 'Topla ovsena kaša z dušenimi jabolki, ki diši po jeseni in nasiti do kosila.',
    prep: 15, difficulty: 'lahka', servings: 2, rating: [21, 4.3],
    ingredients: [
      ['ovseni kosmiči', 100, 'g'], ['mleko', 300, 'ml'], ['jabolko', 1, 'kos'], ['cimet', 1, 'žlička'],
      ['med', 1, 'žlica'], ['orehi', 30, 'g'],
    ],
    steps: [
      'Jabolko olupi, odstrani peščišče in nareži na majhne kocke.',
      'Jabolka s cimetom in žlico vode duši 5 minut, da se zmehčajo.',
      'V drugi posodi zavri mleko, dodaj kosmiče in med mešanjem kuhaj 4 minute.',
      'Kašo razdeli v skodelici, nanjo naloži jabolka, pokapaj z medom in potresi s sesekljanimi orehi.',
    ],
  },
  {
    slug: 'umesana-jajca-z-drobnjakom',
    title: 'Umešana jajca z drobnjakom',
    category: 'zajtrk',
    description: 'Kremasta umešana jajca, pripravljena počasi na maslu. Zajtrk v desetih minutah.',
    prep: 10, difficulty: 'lahka', servings: 2, rating: [17, 4.1],
    ingredients: [
      ['jajca', 4, 'kos'], ['maslo', 20, 'g'], ['drobnjak', 1, 'šopek'], ['sol', null, 'po okusu'],
      ['črni poper', null, 'po okusu'], ['kruh', 2, 'rezini'],
    ],
    steps: [
      'Jajca razžvrkljaj v skledi in rahlo posoli.',
      'V ponvi na nizki temperaturi stopi maslo.',
      'Vlij jajca in jih z lopatko počasi premikaj od roba proti sredini.',
      'Ko so jajca še rahlo vlažna, ponev odstavi, potresi s sesekljanim drobnjakom in poprom.',
      'Postrezi na popečenem kruhu.',
    ],
  },
  {
    slug: 'domaca-granola-z-orescki',
    title: 'Domača granola z oreščki',
    category: 'zajtrk',
    description: 'Hrustljava pečena granola za cel teden. Odlična z jogurtom ali mlekom.',
    prep: 40, difficulty: 'srednja', servings: 8, rating: [12, 4.7],
    ingredients: [
      ['ovseni kosmiči', 300, 'g'], ['mandlji', 80, 'g'], ['lešniki', 80, 'g'], ['sončnična semena', 50, 'g'],
      ['med', 4, 'žlice'], ['kokosovo olje', 3, 'žlice'], ['rozine', 60, 'g'], ['cimet', 1, 'žlička'],
    ],
    steps: [
      'Pečico segrej na 160 °C in pekač obloži s peki papirjem.',
      'V veliki skledi zmešaj kosmiče, grobo sesekljane oreščke, semena in cimet.',
      'Med in kokosovo olje segrej, da se utekočinita, prelij čez suhe sestavine in dobro premešaj.',
      'Zmes razporedi po pekaču in peci 25 minut; na polovici peke jo premešaj.',
      'Ohlajeni granoli primešaj rozine in jo shrani v zaprt kozarec.',
    ],
  },

  // --- Juhe in enolončnice ----------------------------------------------------
  {
    slug: 'goveja-juha-z-rezanci',
    title: 'Goveja juha z rezanci',
    category: 'juhe-in-enolocnice',
    description: 'Bistra nedeljska juha, ki se kuha počasi, da dobi poln okus po mesu in zelenjavi.',
    prep: 180, difficulty: 'srednja', servings: 6, rating: [44, 4.8],
    ingredients: [
      ['goveje meso s kostjo', 800, 'g'], ['korenje', 2, 'kos'], ['peteršiljeva korenina', 1, 'kos'],
      ['zelena', 0.25, 'kos'], ['čebula', 1, 'kos'], ['por', 0.5, 'kos'], ['juhini rezanci', 150, 'g'],
      ['sol', null, 'po okusu'], ['poper v zrnu', 6, 'kos'],
    ],
    steps: [
      'Meso operi, ga stresi v lonec s 3 litri hladne vode in počasi zavri.',
      'Odstrani peno, ki se nabere na površini, in juho kuhaj na nizkem ognju 2 uri.',
      'Čebulo prereži in jo na suhi ponvi zapeci do temne barve.',
      'Dodaj očiščeno zelenjavo, čebulo in poper ter kuhaj še eno uro.',
      'Juho precedi, posoli in v njej skuhaj rezance.',
    ],
  },
  {
    slug: 'bucna-kremna-juha',
    title: 'Bučna kremna juha',
    category: 'juhe-in-enolocnice',
    description: 'Žametna juha iz hokaido buče z ingverjem in kapljico bučnega olja.',
    prep: 45, difficulty: 'lahka', servings: 4, rating: [29, 4.5],
    ingredients: [
      ['hokaido buča', 800, 'g'], ['čebula', 1, 'kos'], ['česen', 2, 'stroka'], ['svež ingver', 1, 'cm'],
      ['zelenjavna osnova', 800, 'ml'], ['sladka smetana', 100, 'ml'], ['bučno olje', 2, 'žlici'], ['sol', null, 'po okusu'],
    ],
    steps: [
      'Bučo operi, odstrani semena in jo z lupino vred nareži na kocke.',
      'Na olju prepraži sesekljano čebulo, česen in nariban ingver.',
      'Dodaj bučo, zalij z osnovo in kuhaj 20 minut, da se buča zmehča.',
      'Juho s paličnim mešalnikom zmešaj v gladko kremo, primešaj smetano in posoli.',
      'Postrezi s kapljico bučnega olja.',
    ],
  },
  {
    slug: 'jota',
    title: 'Jota',
    category: 'juhe-in-enolocnice',
    description: 'Primorska enolončnica s kislim zeljem, fižolom in krompirjem. Naslednji dan je še boljša.',
    prep: 90, difficulty: 'srednja', servings: 6, rating: [33, 4.6],
    ingredients: [
      ['kislo zelje', 500, 'g'], ['fižol (kuhan)', 400, 'g'], ['krompir', 3, 'kos'], ['prekajena rebrca', 400, 'g'],
      ['česen', 3, 'stroki'], ['lovorjev list', 2, 'kos'], ['moka', 1, 'žlica'], ['sol', null, 'po okusu'],
    ],
    steps: [
      'Rebrca kuhaj v 2 litrih vode približno 40 minut.',
      'Dodaj oprano kislo zelje in lovor ter kuhaj še 20 minut.',
      'Krompir olupi, nareži na kocke in ga skupaj s fižolom dodaj v lonec.',
      'Na žlici olja prepraži moko in sesekljan česen, zalij z malo juhe in vmešaj v enolončnico.',
      'Kuhaj še 15 minut in po potrebi posoli.',
    ],
  },
  {
    slug: 'paradiznikova-juha-z-baziliko',
    title: 'Paradižnikova juha z baziliko',
    category: 'juhe-in-enolocnice',
    description: 'Poletna juha iz pečenih paradižnikov, ki jo lahko jeste toplo ali ohlajeno.',
    prep: 35, difficulty: 'lahka', servings: 4, rating: [18, 4.2],
    ingredients: [
      ['zreli paradižniki', 1000, 'g'], ['čebula', 1, 'kos'], ['česen', 3, 'stroki'], ['oljčno olje', 3, 'žlice'],
      ['bazilika', 1, 'šopek'], ['zelenjavna osnova', 400, 'ml'], ['sladkor', 1, 'žlička'], ['sol', null, 'po okusu'],
    ],
    steps: [
      'Paradižnike prereži na pol in jih s čebulo in česnom na pekaču pokapaj z oljem.',
      'Peci 20 minut na 200 °C, da se zelenjava rahlo zapeče.',
      'Pečeno zelenjavo stresi v lonec, zalij z osnovo, dodaj sladkor in zavri.',
      'Dodaj večino bazilike in juho zmešaj s paličnim mešalnikom.',
      'Posoli in postrezi z ostalimi lističi bazilike.',
    ],
  },

  // --- Glavne jedi -----------------------------------------------------------
  {
    slug: 'piscanec-v-smetanovi-omaki-z-gobami',
    title: 'Piščanec v smetanovi omaki z gobami',
    category: 'glavne-jedi',
    description: 'Mehki koščki piščanca v kremasti omaki s šampinjoni. Odlično s testeninami ali rižem.',
    prep: 40, difficulty: 'srednja', servings: 4, rating: [41, 4.5],
    ingredients: [
      ['piščančje prsi', 600, 'g'], ['šampinjoni', 250, 'g'], ['čebula', 1, 'kos'], ['česen', 2, 'stroka'],
      ['sladka smetana', 200, 'ml'], ['peteršilj', 1, 'šopek'], ['olje', 2, 'žlici'], ['sol', null, 'po okusu'],
      ['črni poper', null, 'po okusu'],
    ],
    steps: [
      'Piščanca nareži na trakove, ga posoli in popopraj.',
      'Na olju ga na hitro opeci z vseh strani, nato ga vzemi iz ponve.',
      'V isti ponvi prepraži čebulo, dodaj narezane gobe in česen ter praži, da gobe izpustijo vodo.',
      'Prilij smetano, vrni piščanca in kuhaj 8 minut, da se omaka zgosti.',
      'Potresi s sesekljanim peteršiljem.',
    ],
  },
  {
    slug: 'golaz',
    title: 'Golaž',
    category: 'glavne-jedi',
    description: 'Počasi dušen goveji golaž z veliko čebule in sladke paprike.',
    prep: 120, difficulty: 'srednja', servings: 6, rating: [52, 4.7],
    ingredients: [
      ['goveje meso (stegno)', 1000, 'g'], ['čebula', 1000, 'g'], ['mleta sladka paprika', 2, 'žlici'],
      ['paradižnikova mezga', 2, 'žlici'], ['česen', 3, 'stroki'], ['lovorjev list', 2, 'kos'], ['kumina', 1, 'žlička'],
      ['olje', 4, 'žlice'], ['sol', null, 'po okusu'],
    ],
    steps: [
      'Čebulo drobno nasekljaj in jo na olju počasi praži 20 minut, da porjavi.',
      'Dodaj na kocke narezano meso in ga popeci z vseh strani.',
      'Odstavi z ognja, primešaj papriko in mezgo, nato zalij z vodo, da je meso pokrito.',
      'Dodaj česen, lovor in kumino ter pokrito duši 90 minut; po potrebi prilivaj vodo.',
      'Posoli in postrezi s polento ali kruhom.',
    ],
  },
  {
    slug: 'pecen-losos-z-limono-in-krompirjem',
    title: 'Pečen losos z limono in krompirjem',
    category: 'glavne-jedi',
    description: 'Celotno kosilo na enem pekaču: sočen losos in hrustljav krompir z rožmarinom.',
    prep: 45, difficulty: 'lahka', servings: 2, rating: [26, 4.4],
    ingredients: [
      ['lososov file', 2, 'kos'], ['mladi krompir', 500, 'g'], ['limona', 1, 'kos'], ['rožmarin', 2, 'vejici'],
      ['oljčno olje', 3, 'žlice'], ['česen', 2, 'stroka'], ['sol', null, 'po okusu'],
    ],
    steps: [
      'Pečico segrej na 200 °C.',
      'Krompir prereži na pol, ga prelij z oljem, posoli, dodaj rožmarin in peci 25 minut.',
      'Lososa posoli in nanj položi rezine limone in strt česen.',
      'Lososa položi na pekač med krompir in peci še 12–15 minut.',
      'Pred serviranjem pokapaj s svežim limoninim sokom.',
    ],
  },
  {
    slug: 'polnjene-paprike',
    title: 'Polnjene paprike',
    category: 'glavne-jedi',
    description: 'Paprike, polnjene z mletim mesom in rižem, kuhane v paradižnikovi omaki.',
    prep: 90, difficulty: 'zahtevna', servings: 4, rating: [36, 4.6],
    ingredients: [
      ['zelene paprike', 8, 'kos'], ['mleto meso', 500, 'g'], ['riž', 100, 'g'], ['jajce', 1, 'kos'],
      ['čebula', 1, 'kos'], ['paradižnikova passata', 700, 'ml'], ['mleta sladka paprika', 1, 'žlička'],
      ['sladkor', 1, 'žlička'], ['sol', null, 'po okusu'],
    ],
    steps: [
      'Paprikam odreži vrh in odstrani semena.',
      'Meso zmešaj z opranim surovim rižem, jajcem, drobno sesekljano čebulo, papriko in soljo.',
      'Paprike napolni z mesno zmesjo, a ne do vrha, ker riž nabrekne.',
      'V širšem loncu zavri passato s 500 ml vode in sladkorjem.',
      'V omako zloži paprike in jih pokrito kuhaj na nizkem ognju 60 minut.',
    ],
  },

  // --- Vegetarijansko ----------------------------------------------------------
  {
    slug: 'rizota-z-jurcki',
    title: 'Rižota z jurčki',
    category: 'vegetarijansko',
    description: 'Kremasta rižota s posušenimi jurčki in parmezanom. Potrebuje potrpežljivo mešanje.',
    prep: 40, difficulty: 'srednja', servings: 4, rating: [31, 4.6],
    ingredients: [
      ['riž za rižoto', 320, 'g'], ['suhi jurčki', 30, 'g'], ['čebula', 1, 'kos'], ['belo vino', 100, 'ml'],
      ['zelenjavna osnova', 1200, 'ml'], ['maslo', 40, 'g'], ['parmezan', 60, 'g'], ['sol', null, 'po okusu'],
    ],
    steps: [
      'Jurčke namoči v 200 ml tople vode za 20 minut, nato jih sesekljaj; vode ne zavrzi.',
      'Na polovici masla prepraži čebulo, dodaj riž in ga praži, da postekleni.',
      'Zalij z vinom in mešaj, da izpari.',
      'Dodaj jurčke in postopoma prilivaj vročo osnovo ter vodo od gob; mešaj 18 minut.',
      'Odstavi, vmešaj preostalo maslo in nariban parmezan ter pusti stati 2 minuti.',
    ],
  },
  {
    slug: 'spageti-aglio-olio',
    title: 'Špageti aglio e olio',
    category: 'vegetarijansko',
    description: 'Klasika za lene večere: samo testenine, česen, olje in kanček pekočega.',
    prep: 20, difficulty: 'lahka', servings: 2, rating: [24, 4.3],
    ingredients: [
      ['špageti', 200, 'g'], ['česen', 4, 'stroki'], ['oljčno olje', 5, 'žlic'], ['čili', 1, 'kos'],
      ['peteršilj', 0.5, 'šopka'], ['sol', null, 'po okusu'],
    ],
    steps: [
      'Špagete skuhaj v obilici osoljene vode po navodilih na embalaži.',
      'Medtem česen nareži na tanke lističe, čili pa na kolobarje.',
      'Na olju na nizki temperaturi počasi praži česen in čili, da česen postane zlat.',
      'Odcejene špagete stresi v ponev, dodaj zajemalko vode od kuhanja in premešaj.',
      'Potresi s peteršiljem in takoj postrezi.',
    ],
  },
  {
    slug: 'zelenjavni-curry-s-cicariko',
    title: 'Zelenjavni curry s čičeriko',
    category: 'vegetarijansko',
    description: 'Dišeč curry s kokosovim mlekom, čičeriko in špinačo. Najboljši z basmati rižem.',
    prep: 35, difficulty: 'lahka', servings: 4, rating: [27, 4.5],
    ingredients: [
      ['čičerika (kuhana)', 400, 'g'], ['kokosovo mleko', 400, 'ml'], ['sladki krompir', 1, 'kos'],
      ['mlada špinača', 100, 'g'], ['čebula', 1, 'kos'], ['curry v prahu', 2, 'žlici'], ['svež ingver', 2, 'cm'],
      ['basmati riž', 250, 'g'], ['sol', null, 'po okusu'],
    ],
    steps: [
      'Na olju prepraži čebulo in nariban ingver, dodaj curry in praži še minuto.',
      'Dodaj na kocke narezan sladki krompir in čičeriko ter zalij s kokosovim mlekom.',
      'Kuhaj 15 minut, da se krompir zmehča.',
      'Vmešaj špinačo in jo kuhaj le toliko, da oveni; posoli.',
      'Postrezi z rižem, skuhanim po navodilih.',
    ],
  },
  {
    slug: 'kuhani-skutni-struklji',
    title: 'Kuhani skutni štruklji',
    category: 'vegetarijansko',
    description: 'Tradicionalni slovenski štruklji s skuto, zaviti v krpo in kuhani. Zahtevajo nekaj spretnosti.',
    prep: 120, difficulty: 'zahtevna', servings: 6, rating: [19, 4.8],
    ingredients: [
      ['moka', 300, 'g'], ['jajce', 1, 'kos'], ['olje', 2, 'žlici'], ['mlačna voda', 150, 'ml'],
      ['skuta', 500, 'g'], ['kisla smetana', 200, 'g'], ['jajca (za nadev)', 2, 'kos'], ['drobtine', 50, 'g'],
      ['maslo', 60, 'g'], ['sol', 1, 'žlička'],
    ],
    steps: [
      'Iz moke, jajca, olja, vode in ščepca soli zamesi mehko testo in ga pusti počivati 30 minut.',
      'Skuto zmešaj s kislo smetano, jajci in soljo.',
      'Testo na pomokanem prtu razvaljaj in razvleci na tanko.',
      'Namaži nadev, testo s pomočjo prta zvij in zavij v namočeno krpo; konca zaveži.',
      'Štrukelj kuhaj v vreli osoljeni vodi 40 minut.',
      'Nareži ga na kose in prelij z na maslu opečenimi drobtinami.',
    ],
  },

  // --- Solate in priloge --------------------------------------------------------
  {
    slug: 'krompirjeva-solata',
    title: 'Krompirjeva solata',
    category: 'solate-in-priloge',
    description: 'Domača krompirjeva solata s čebulo in bučnim oljem, kot spremljava k vsem mesnim jedem.',
    prep: 35, difficulty: 'lahka', servings: 4, rating: [22, 4.4],
    ingredients: [
      ['krompir', 800, 'g'], ['rdeča čebula', 1, 'kos'], ['jabolčni kis', 3, 'žlice'], ['bučno olje', 3, 'žlice'],
      ['goveja ali zelenjavna juha', 100, 'ml'], ['drobnjak', 0.5, 'šopka'], ['sol', null, 'po okusu'],
    ],
    steps: [
      'Krompir skuhaj v lupini, da je mehak, nato ga olupi še toplega.',
      'Nareži ga na tanke rezine in prelij s toplo juho.',
      'Dodaj na tanke rezine narezano čebulo, kis, olje in sol ter nežno premešaj.',
      'Pusti stati vsaj 15 minut, da se okusi povežejo, in potresi z drobnjakom.',
    ],
  },
  {
    slug: 'grska-solata',
    title: 'Grška solata',
    category: 'solate-in-priloge',
    description: 'Sveža solata s paradižnikom, kumarami, olivami in feta sirom.',
    prep: 15, difficulty: 'lahka', servings: 4, rating: [16, 4.2],
    ingredients: [
      ['paradižniki', 3, 'kos'], ['kumara', 1, 'kos'], ['zelena paprika', 1, 'kos'], ['rdeča čebula', 0.5, 'kos'],
      ['olive', 80, 'g'], ['feta sir', 150, 'g'], ['oljčno olje', 4, 'žlice'], ['origano', 1, 'žlička'],
    ],
    steps: [
      'Paradižnike in kumaro nareži na večje kose, papriko in čebulo pa na tanke kolobarje.',
      'Zelenjavo zloži v skledo in dodaj olive.',
      'Na vrh položi kos feta sira.',
      'Pokapaj z oljčnim oljem in potresi z origanom.',
    ],
  },
  {
    slug: 'pecena-zelenjava-z-zelisci',
    title: 'Pečena zelenjava z zelišči',
    category: 'solate-in-priloge',
    description: 'Pisana pečena zelenjava, ki je lahko priloga ali lahek obrok.',
    prep: 50, difficulty: 'lahka', servings: 4, rating: [14, 4.3],
    ingredients: [
      ['bučka', 1, 'kos'], ['rdeča paprika', 1, 'kos'], ['korenje', 2, 'kos'], ['rdeča čebula', 1, 'kos'],
      ['jajčevec', 1, 'kos'], ['oljčno olje', 4, 'žlice'], ['timijan', 1, 'žlička'], ['sol', null, 'po okusu'],
    ],
    steps: [
      'Pečico segrej na 210 °C.',
      'Vso zelenjavo nareži na podobno velike kose.',
      'Zelenjavo v skledi premešaj z oljem, soljo in timijanom.',
      'Razporedi jo po pekaču v eni plasti in peci 35 minut; na polovici jo obrni.',
    ],
  },
  {
    slug: 'kuskus-solata-s-papriko',
    title: 'Kuskus solata s papriko',
    category: 'solate-in-priloge',
    description: 'Hitra solata za malico ali piknik, ki zdrži v hladilniku do dva dni.',
    prep: 20, difficulty: 'lahka', servings: 4, rating: [11, 4.0],
    ingredients: [
      ['kuskus', 200, 'g'], ['rdeča paprika', 1, 'kos'], ['kumara', 1, 'kos'], ['meta', 0.5, 'šopka'],
      ['limona', 1, 'kos'], ['oljčno olje', 3, 'žlice'], ['sol', null, 'po okusu'],
    ],
    steps: [
      'Kuskus prelij z 250 ml vrele osoljene vode, pokrij in pusti stati 5 minut.',
      'Kuskus razrahljaj z vilicami in ga ohladi.',
      'Papriko in kumaro nareži na majhne kocke, meto pa sesekljaj.',
      'Vse zmešaj s kuskusom, dodaj limonin sok in olje ter posoli.',
    ],
  },

  // --- Sladice -----------------------------------------------------------------
  {
    slug: 'orehova-potica',
    title: 'Orehova potica',
    category: 'sladice',
    description: 'Praznična potica s kvašenim testom in bogatim orehovim nadevom.',
    prep: 240, difficulty: 'zahtevna', servings: 12, rating: [47, 4.9],
    ingredients: [
      ['moka', 500, 'g'], ['kvas', 20, 'g'], ['mleko', 250, 'ml'], ['sladkor', 80, 'g'], ['maslo', 80, 'g'],
      ['rumenjaki', 3, 'kos'], ['mleti orehi', 400, 'g'], ['med', 100, 'g'], ['sladka smetana', 150, 'ml'],
      ['cimet', 1, 'žlička'],
    ],
    steps: [
      'Kvas raztopi v mlačnem mleku z žličko sladkorja in pusti, da vzhaja.',
      'Zamesi testo iz moke, kvasa, preostalega sladkorja, stopljenega masla in rumenjakov; vzhaja naj 1 uro.',
      'Za nadev orehe prelij z vročo smetano in primešaj med ter cimet.',
      'Testo razvaljaj v pravokotnik, namaži nadev in tesno zvij.',
      'Zvitek položi v namaščen model za potico in pusti vzhajati še 45 minut.',
      'Peci 60 minut na 170 °C; po 30 minutah jo pokrij s peki papirjem.',
    ],
  },
  {
    slug: 'jabolcni-zavitek',
    title: 'Jabolčni zavitek',
    category: 'sladice',
    description: 'Tanko vlečeno testo, polno jabolk, rozin in cimeta.',
    prep: 90, difficulty: 'zahtevna', servings: 8, rating: [34, 4.7],
    ingredients: [
      ['vlečeno testo', 1, 'zavitek'], ['jabolka', 1200, 'g'], ['sladkor', 100, 'g'], ['cimet', 2, 'žlički'],
      ['rozine', 60, 'g'], ['drobtine', 60, 'g'], ['maslo', 80, 'g'], ['sladkor v prahu', null, 'po okusu'],
    ],
    steps: [
      'Jabolka olupi in naribaj ali nareži na tanke lističe.',
      'Jabolka zmešaj s sladkorjem, cimetom in rozinami.',
      'Drobtine popraži na polovici masla.',
      'Liste testa namaži s stopljenim maslom, potresi z drobtinami in razporedi jabolčni nadev.',
      'Testo zvij, položi na pekač in peci 45 minut na 180 °C.',
      'Ohlajen zavitek potresi s sladkorjem v prahu.',
    ],
  },
  {
    slug: 'cokoladni-mousse',
    title: 'Čokoladni mousse',
    category: 'sladice',
    description: 'Lahka, zračna čokoladna krema iz samo treh sestavin. Pred serviranjem se mora ohladiti.',
    prep: 30, difficulty: 'srednja', servings: 4, rating: [28, 4.6],
    ingredients: [
      ['temna čokolada', 150, 'g'], ['jajca', 3, 'kos'], ['sladka smetana', 200, 'ml'], ['sladkor', 1, 'žlica'],
    ],
    steps: [
      'Čokolado stopi nad soparo in jo malo ohladi.',
      'Ločeno stepi smetano in iz beljakov s sladkorjem trd sneg.',
      'V čokolado vmešaj rumenjake, nato nežno primešaj smetano.',
      'Na koncu z lopatko previdno vmešaj sneg, da mousse ostane zračen.',
      'Razdeli v kozarčke in hladi vsaj 3 ure.',
    ],
  },
  {
    slug: 'prekmurska-gibanica',
    title: 'Prekmurska gibanica',
    category: 'sladice',
    description: 'Plastovita sladica z makom, skuto, orehi in jabolki. Projekt za cel popoldan.',
    prep: 180, difficulty: 'zahtevna', servings: 12, rating: [39, 4.9],
    ingredients: [
      ['krhko testo', 300, 'g'], ['vlečeno testo', 2, 'zavitka'], ['mleti mak', 250, 'g'], ['skuta', 500, 'g'],
      ['mleti orehi', 250, 'g'], ['jabolka', 800, 'g'], ['sladkor', 250, 'g'], ['jajca', 2, 'kos'],
      ['sladka smetana', 300, 'ml'], ['maslo', 150, 'g'],
    ],
    steps: [
      'Pripravi štiri nadeve: makovega, skutnega (z jajci in sladkorjem), orehovega in jabolčnega.',
      'Z razvaljanim krhkim testom obloži dno globljega pekača.',
      'Nadeve nalagaj v vrstnem redu mak, skuta, orehi, jabolka; med vsako plast položi list vlečenega testa, pokapan z maslom in smetano.',
      'Zaporedje ponovi še enkrat in zaključi z listom testa, ki ga prelij s smetano.',
      'Peci 75 minut na 180 °C in gibanico pred rezanjem ohladi.',
    ],
  },
]
