-- RecipeHub – začetni podatki (generirano z `npm run seed:build`, ne urejaj ročno).
-- Zaženi po 01_schema.sql. Ponoven zagon pobriše in znova vstavi vse podatke.

truncate public.shopping_items, public.favorites, public.ratings, public.recipes, public.categories restart identity cascade;

insert into public.categories (slug, name, description, sort_order) values
  ('zajtrk', 'Zajtrk', 'Hitri in nasitni začetki dneva.', 1),
  ('juhe-in-enolocnice', 'Juhe in enolončnice', 'Tople jedi iz enega lonca.', 2),
  ('glavne-jedi', 'Glavne jedi', 'Kosila in večerje z mesom ali ribami.', 3),
  ('vegetarijansko', 'Vegetarijansko', 'Brez mesa, a polno okusa.', 4),
  ('solate-in-priloge', 'Solate in priloge', 'Sveže solate in priloge k glavni jedi.', 5),
  ('sladice', 'Sladice', 'Od hitrih kremnih sladic do praznične potice.', 6);

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'palacinke-z-marelicno-marmelado', 'Palačinke z marelično marmelado', 'Tanke palačinke po babičinem receptu, ki jih lahko napolnite s čimerkoli, najboljše pa so z domačo marelično marmelado.', id, 30, 'lahka', 4, null,
  '[{"name":"moka","amount":200,"unit":"g"},{"name":"mleko","amount":400,"unit":"ml"},{"name":"jajca","amount":2,"unit":"kos"},{"name":"sol","amount":1,"unit":"ščep"},{"name":"sončnično olje","amount":2,"unit":"žlici"},{"name":"marelična marmelada","amount":150,"unit":"g"},{"name":"sladkor v prahu","amount":null,"unit":"po okusu"}]'::jsonb,
  array['V skledi z metlico zmešaj moko, sol in polovico mleka, da dobiš gladko testo brez grudic.', 'Dodaj jajca in preostalo mleko ter mešaj, dokler ni testo tekoče kot gosta smetana. Pusti ga počivati 10 minut.', 'Ponev segrej na srednji temperaturi in jo rahlo namaži z oljem.', 'Vlij tanko plast testa, ponev zavrti, da se razleže, in peci približno minuto na vsaki strani.', 'Pečene palačinke namaži z marmelado, zvij in potresi s sladkorjem v prahu.'],
  38, 175, true, null
from public.categories where slug = 'zajtrk';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'ovseni-kosmici-z-jabolki-in-cimetom', 'Ovseni kosmiči z jabolki in cimetom', 'Topla ovsena kaša z dušenimi jabolki, ki diši po jeseni in nasiti do kosila.', id, 15, 'lahka', 2, null,
  '[{"name":"ovseni kosmiči","amount":100,"unit":"g"},{"name":"mleko","amount":300,"unit":"ml"},{"name":"jabolko","amount":1,"unit":"kos"},{"name":"cimet","amount":1,"unit":"žlička"},{"name":"med","amount":1,"unit":"žlica"},{"name":"orehi","amount":30,"unit":"g"}]'::jsonb,
  array['Jabolko olupi, odstrani peščišče in nareži na majhne kocke.', 'Jabolka s cimetom in žlico vode duši 5 minut, da se zmehčajo.', 'V drugi posodi zavri mleko, dodaj kosmiče in med mešanjem kuhaj 4 minute.', 'Kašo razdeli v skodelici, nanjo naloži jabolka, pokapaj z medom in potresi s sesekljanimi orehi.'],
  21, 90, true, null
from public.categories where slug = 'zajtrk';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'umesana-jajca-z-drobnjakom', 'Umešana jajca z drobnjakom', 'Kremasta umešana jajca, pripravljena počasi na maslu. Zajtrk v desetih minutah.', id, 10, 'lahka', 2, null,
  '[{"name":"jajca","amount":4,"unit":"kos"},{"name":"maslo","amount":20,"unit":"g"},{"name":"drobnjak","amount":1,"unit":"šopek"},{"name":"sol","amount":null,"unit":"po okusu"},{"name":"črni poper","amount":null,"unit":"po okusu"},{"name":"kruh","amount":2,"unit":"rezini"}]'::jsonb,
  array['Jajca razžvrkljaj v skledi in rahlo posoli.', 'V ponvi na nizki temperaturi stopi maslo.', 'Vlij jajca in jih z lopatko počasi premikaj od roba proti sredini.', 'Ko so jajca še rahlo vlažna, ponev odstavi, potresi s sesekljanim drobnjakom in poprom.', 'Postrezi na popečenem kruhu.'],
  17, 70, true, null
from public.categories where slug = 'zajtrk';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'domaca-granola-z-orescki', 'Domača granola z oreščki', 'Hrustljava pečena granola za cel teden. Odlična z jogurtom ali mlekom.', id, 40, 'srednja', 8, null,
  '[{"name":"ovseni kosmiči","amount":300,"unit":"g"},{"name":"mandlji","amount":80,"unit":"g"},{"name":"lešniki","amount":80,"unit":"g"},{"name":"sončnična semena","amount":50,"unit":"g"},{"name":"med","amount":4,"unit":"žlice"},{"name":"kokosovo olje","amount":3,"unit":"žlice"},{"name":"rozine","amount":60,"unit":"g"},{"name":"cimet","amount":1,"unit":"žlička"}]'::jsonb,
  array['Pečico segrej na 160 °C in pekač obloži s peki papirjem.', 'V veliki skledi zmešaj kosmiče, grobo sesekljane oreščke, semena in cimet.', 'Med in kokosovo olje segrej, da se utekočinita, prelij čez suhe sestavine in dobro premešaj.', 'Zmes razporedi po pekaču in peci 25 minut; na polovici peke jo premešaj.', 'Ohlajeni granoli primešaj rozine in jo shrani v zaprt kozarec.'],
  12, 56, true, null
from public.categories where slug = 'zajtrk';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'goveja-juha-z-rezanci', 'Goveja juha z rezanci', 'Bistra nedeljska juha, ki se kuha počasi, da dobi poln okus po mesu in zelenjavi.', id, 180, 'srednja', 6, null,
  '[{"name":"goveje meso s kostjo","amount":800,"unit":"g"},{"name":"korenje","amount":2,"unit":"kos"},{"name":"peteršiljeva korenina","amount":1,"unit":"kos"},{"name":"zelena","amount":0.25,"unit":"kos"},{"name":"čebula","amount":1,"unit":"kos"},{"name":"por","amount":0.5,"unit":"kos"},{"name":"juhini rezanci","amount":150,"unit":"g"},{"name":"sol","amount":null,"unit":"po okusu"},{"name":"poper v zrnu","amount":6,"unit":"kos"}]'::jsonb,
  array['Meso operi, ga stresi v lonec s 3 litri hladne vode in počasi zavri.', 'Odstrani peno, ki se nabere na površini, in juho kuhaj na nizkem ognju 2 uri.', 'Čebulo prereži in jo na suhi ponvi zapeci do temne barve.', 'Dodaj očiščeno zelenjavo, čebulo in poper ter kuhaj še eno uro.', 'Juho precedi, posoli in v njej skuhaj rezance.'],
  44, 211, true, null
from public.categories where slug = 'juhe-in-enolocnice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'bucna-kremna-juha', 'Bučna kremna juha', 'Žametna juha iz hokaido buče z ingverjem in kapljico bučnega olja.', id, 45, 'lahka', 4, null,
  '[{"name":"hokaido buča","amount":800,"unit":"g"},{"name":"čebula","amount":1,"unit":"kos"},{"name":"česen","amount":2,"unit":"stroka"},{"name":"svež ingver","amount":1,"unit":"cm"},{"name":"zelenjavna osnova","amount":800,"unit":"ml"},{"name":"sladka smetana","amount":100,"unit":"ml"},{"name":"bučno olje","amount":2,"unit":"žlici"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Bučo operi, odstrani semena in jo z lupino vred nareži na kocke.', 'Na olju prepraži sesekljano čebulo, česen in nariban ingver.', 'Dodaj bučo, zalij z osnovo in kuhaj 20 minut, da se buča zmehča.', 'Juho s paličnim mešalnikom zmešaj v gladko kremo, primešaj smetano in posoli.', 'Postrezi s kapljico bučnega olja.'],
  29, 131, true, null
from public.categories where slug = 'juhe-in-enolocnice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'jota', 'Jota', 'Primorska enolončnica s kislim zeljem, fižolom in krompirjem. Naslednji dan je še boljša.', id, 90, 'srednja', 6, null,
  '[{"name":"kislo zelje","amount":500,"unit":"g"},{"name":"fižol (kuhan)","amount":400,"unit":"g"},{"name":"krompir","amount":3,"unit":"kos"},{"name":"prekajena rebrca","amount":400,"unit":"g"},{"name":"česen","amount":3,"unit":"stroki"},{"name":"lovorjev list","amount":2,"unit":"kos"},{"name":"moka","amount":1,"unit":"žlica"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Rebrca kuhaj v 2 litrih vode približno 40 minut.', 'Dodaj oprano kislo zelje in lovor ter kuhaj še 20 minut.', 'Krompir olupi, nareži na kocke in ga skupaj s fižolom dodaj v lonec.', 'Na žlici olja prepraži moko in sesekljan česen, zalij z malo juhe in vmešaj v enolončnico.', 'Kuhaj še 15 minut in po potrebi posoli.'],
  33, 152, true, null
from public.categories where slug = 'juhe-in-enolocnice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'paradiznikova-juha-z-baziliko', 'Paradižnikova juha z baziliko', 'Poletna juha iz pečenih paradižnikov, ki jo lahko jeste toplo ali ohlajeno.', id, 35, 'lahka', 4, null,
  '[{"name":"zreli paradižniki","amount":1000,"unit":"g"},{"name":"čebula","amount":1,"unit":"kos"},{"name":"česen","amount":3,"unit":"stroki"},{"name":"oljčno olje","amount":3,"unit":"žlice"},{"name":"bazilika","amount":1,"unit":"šopek"},{"name":"zelenjavna osnova","amount":400,"unit":"ml"},{"name":"sladkor","amount":1,"unit":"žlička"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Paradižnike prereži na pol in jih s čebulo in česnom na pekaču pokapaj z oljem.', 'Peci 20 minut na 200 °C, da se zelenjava rahlo zapeče.', 'Pečeno zelenjavo stresi v lonec, zalij z osnovo, dodaj sladkor in zavri.', 'Dodaj večino bazilike in juho zmešaj s paličnim mešalnikom.', 'Posoli in postrezi z ostalimi lističi bazilike.'],
  18, 76, true, null
from public.categories where slug = 'juhe-in-enolocnice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'piscanec-v-smetanovi-omaki-z-gobami', 'Piščanec v smetanovi omaki z gobami', 'Mehki koščki piščanca v kremasti omaki s šampinjoni. Odlično s testeninami ali rižem.', id, 40, 'srednja', 4, null,
  '[{"name":"piščančje prsi","amount":600,"unit":"g"},{"name":"šampinjoni","amount":250,"unit":"g"},{"name":"čebula","amount":1,"unit":"kos"},{"name":"česen","amount":2,"unit":"stroka"},{"name":"sladka smetana","amount":200,"unit":"ml"},{"name":"peteršilj","amount":1,"unit":"šopek"},{"name":"olje","amount":2,"unit":"žlici"},{"name":"sol","amount":null,"unit":"po okusu"},{"name":"črni poper","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Piščanca nareži na trakove, ga posoli in popopraj.', 'Na olju ga na hitro opeci z vseh strani, nato ga vzemi iz ponve.', 'V isti ponvi prepraži čebulo, dodaj narezane gobe in česen ter praži, da gobe izpustijo vodo.', 'Prilij smetano, vrni piščanca in kuhaj 8 minut, da se omaka zgosti.', 'Potresi s sesekljanim peteršiljem.'],
  41, 185, true, null
from public.categories where slug = 'glavne-jedi';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'golaz', 'Golaž', 'Počasi dušen goveji golaž z veliko čebule in sladke paprike.', id, 120, 'srednja', 6, null,
  '[{"name":"goveje meso (stegno)","amount":1000,"unit":"g"},{"name":"čebula","amount":1000,"unit":"g"},{"name":"mleta sladka paprika","amount":2,"unit":"žlici"},{"name":"paradižnikova mezga","amount":2,"unit":"žlici"},{"name":"česen","amount":3,"unit":"stroki"},{"name":"lovorjev list","amount":2,"unit":"kos"},{"name":"kumina","amount":1,"unit":"žlička"},{"name":"olje","amount":4,"unit":"žlice"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Čebulo drobno nasekljaj in jo na olju počasi praži 20 minut, da porjavi.', 'Dodaj na kocke narezano meso in ga popeci z vseh strani.', 'Odstavi z ognja, primešaj papriko in mezgo, nato zalij z vodo, da je meso pokrito.', 'Dodaj česen, lovor in kumino ter pokrito duši 90 minut; po potrebi prilivaj vodo.', 'Posoli in postrezi s polento ali kruhom.'],
  52, 244, true, null
from public.categories where slug = 'glavne-jedi';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'pecen-losos-z-limono-in-krompirjem', 'Pečen losos z limono in krompirjem', 'Celotno kosilo na enem pekaču: sočen losos in hrustljav krompir z rožmarinom.', id, 45, 'lahka', 2, null,
  '[{"name":"lososov file","amount":2,"unit":"kos"},{"name":"mladi krompir","amount":500,"unit":"g"},{"name":"limona","amount":1,"unit":"kos"},{"name":"rožmarin","amount":2,"unit":"vejici"},{"name":"oljčno olje","amount":3,"unit":"žlice"},{"name":"česen","amount":2,"unit":"stroka"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Pečico segrej na 200 °C.', 'Krompir prereži na pol, ga prelij z oljem, posoli, dodaj rožmarin in peci 25 minut.', 'Lososa posoli in nanj položi rezine limone in strt česen.', 'Lososa položi na pekač med krompir in peci še 12–15 minut.', 'Pred serviranjem pokapaj s svežim limoninim sokom.'],
  26, 114, true, null
from public.categories where slug = 'glavne-jedi';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'polnjene-paprike', 'Polnjene paprike', 'Paprike, polnjene z mletim mesom in rižem, kuhane v paradižnikovi omaki.', id, 90, 'zahtevna', 4, null,
  '[{"name":"zelene paprike","amount":8,"unit":"kos"},{"name":"mleto meso","amount":500,"unit":"g"},{"name":"riž","amount":100,"unit":"g"},{"name":"jajce","amount":1,"unit":"kos"},{"name":"čebula","amount":1,"unit":"kos"},{"name":"paradižnikova passata","amount":700,"unit":"ml"},{"name":"mleta sladka paprika","amount":1,"unit":"žlička"},{"name":"sladkor","amount":1,"unit":"žlička"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Paprikam odreži vrh in odstrani semena.', 'Meso zmešaj z opranim surovim rižem, jajcem, drobno sesekljano čebulo, papriko in soljo.', 'Paprike napolni z mesno zmesjo, a ne do vrha, ker riž nabrekne.', 'V širšem loncu zavri passato s 500 ml vode in sladkorjem.', 'V omako zloži paprike in jih pokrito kuhaj na nizkem ognju 60 minut.'],
  36, 166, true, null
from public.categories where slug = 'glavne-jedi';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'rizota-z-jurcki', 'Rižota z jurčki', 'Kremasta rižota s posušenimi jurčki in parmezanom. Potrebuje potrpežljivo mešanje.', id, 40, 'srednja', 4, null,
  '[{"name":"riž za rižoto","amount":320,"unit":"g"},{"name":"suhi jurčki","amount":30,"unit":"g"},{"name":"čebula","amount":1,"unit":"kos"},{"name":"belo vino","amount":100,"unit":"ml"},{"name":"zelenjavna osnova","amount":1200,"unit":"ml"},{"name":"maslo","amount":40,"unit":"g"},{"name":"parmezan","amount":60,"unit":"g"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Jurčke namoči v 200 ml tople vode za 20 minut, nato jih sesekljaj; vode ne zavrzi.', 'Na polovici masla prepraži čebulo, dodaj riž in ga praži, da postekleni.', 'Zalij z vinom in mešaj, da izpari.', 'Dodaj jurčke in postopoma prilivaj vročo osnovo ter vodo od gob; mešaj 18 minut.', 'Odstavi, vmešaj preostalo maslo in nariban parmezan ter pusti stati 2 minuti.'],
  31, 143, true, null
from public.categories where slug = 'vegetarijansko';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'spageti-aglio-olio', 'Špageti aglio e olio', 'Klasika za lene večere: samo testenine, česen, olje in kanček pekočega.', id, 20, 'lahka', 2, null,
  '[{"name":"špageti","amount":200,"unit":"g"},{"name":"česen","amount":4,"unit":"stroki"},{"name":"oljčno olje","amount":5,"unit":"žlic"},{"name":"čili","amount":1,"unit":"kos"},{"name":"peteršilj","amount":0.5,"unit":"šopka"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Špagete skuhaj v obilici osoljene vode po navodilih na embalaži.', 'Medtem česen nareži na tanke lističe, čili pa na kolobarje.', 'Na olju na nizki temperaturi počasi praži česen in čili, da česen postane zlat.', 'Odcejene špagete stresi v ponev, dodaj zajemalko vode od kuhanja in premešaj.', 'Potresi s peteršiljem in takoj postrezi.'],
  24, 103, true, null
from public.categories where slug = 'vegetarijansko';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'zelenjavni-curry-s-cicariko', 'Zelenjavni curry s čičeriko', 'Dišeč curry s kokosovim mlekom, čičeriko in špinačo. Najboljši z basmati rižem.', id, 35, 'lahka', 4, null,
  '[{"name":"čičerika (kuhana)","amount":400,"unit":"g"},{"name":"kokosovo mleko","amount":400,"unit":"ml"},{"name":"sladki krompir","amount":1,"unit":"kos"},{"name":"mlada špinača","amount":100,"unit":"g"},{"name":"čebula","amount":1,"unit":"kos"},{"name":"curry v prahu","amount":2,"unit":"žlici"},{"name":"svež ingver","amount":2,"unit":"cm"},{"name":"basmati riž","amount":250,"unit":"g"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Na olju prepraži čebulo in nariban ingver, dodaj curry in praži še minuto.', 'Dodaj na kocke narezan sladki krompir in čičeriko ter zalij s kokosovim mlekom.', 'Kuhaj 15 minut, da se krompir zmehča.', 'Vmešaj špinačo in jo kuhaj le toliko, da oveni; posoli.', 'Postrezi z rižem, skuhanim po navodilih.'],
  27, 122, true, null
from public.categories where slug = 'vegetarijansko';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'kuhani-skutni-struklji', 'Kuhani skutni štruklji', 'Tradicionalni slovenski štruklji s skuto, zaviti v krpo in kuhani. Zahtevajo nekaj spretnosti.', id, 120, 'zahtevna', 6, null,
  '[{"name":"moka","amount":300,"unit":"g"},{"name":"jajce","amount":1,"unit":"kos"},{"name":"olje","amount":2,"unit":"žlici"},{"name":"mlačna voda","amount":150,"unit":"ml"},{"name":"skuta","amount":500,"unit":"g"},{"name":"kisla smetana","amount":200,"unit":"g"},{"name":"jajca (za nadev)","amount":2,"unit":"kos"},{"name":"drobtine","amount":50,"unit":"g"},{"name":"maslo","amount":60,"unit":"g"},{"name":"sol","amount":1,"unit":"žlička"}]'::jsonb,
  array['Iz moke, jajca, olja, vode in ščepca soli zamesi mehko testo in ga pusti počivati 30 minut.', 'Skuto zmešaj s kislo smetano, jajci in soljo.', 'Testo na pomokanem prtu razvaljaj in razvleci na tanko.', 'Namaži nadev, testo s pomočjo prta zvij in zavij v namočeno krpo; konca zaveži.', 'Štrukelj kuhaj v vreli osoljeni vodi 40 minut.', 'Nareži ga na kose in prelij z na maslu opečenimi drobtinami.'],
  19, 91, true, null
from public.categories where slug = 'vegetarijansko';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'krompirjeva-solata', 'Krompirjeva solata', 'Domača krompirjeva solata s čebulo in bučnim oljem, kot spremljava k vsem mesnim jedem.', id, 35, 'lahka', 4, null,
  '[{"name":"krompir","amount":800,"unit":"g"},{"name":"rdeča čebula","amount":1,"unit":"kos"},{"name":"jabolčni kis","amount":3,"unit":"žlice"},{"name":"bučno olje","amount":3,"unit":"žlice"},{"name":"goveja ali zelenjavna juha","amount":100,"unit":"ml"},{"name":"drobnjak","amount":0.5,"unit":"šopka"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Krompir skuhaj v lupini, da je mehak, nato ga olupi še toplega.', 'Nareži ga na tanke rezine in prelij s toplo juho.', 'Dodaj na tanke rezine narezano čebulo, kis, olje in sol ter nežno premešaj.', 'Pusti stati vsaj 15 minut, da se okusi povežejo, in potresi z drobnjakom.'],
  22, 97, true, null
from public.categories where slug = 'solate-in-priloge';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'grska-solata', 'Grška solata', 'Sveža solata s paradižnikom, kumarami, olivami in feta sirom.', id, 15, 'lahka', 4, null,
  '[{"name":"paradižniki","amount":3,"unit":"kos"},{"name":"kumara","amount":1,"unit":"kos"},{"name":"zelena paprika","amount":1,"unit":"kos"},{"name":"rdeča čebula","amount":0.5,"unit":"kos"},{"name":"olive","amount":80,"unit":"g"},{"name":"feta sir","amount":150,"unit":"g"},{"name":"oljčno olje","amount":4,"unit":"žlice"},{"name":"origano","amount":1,"unit":"žlička"}]'::jsonb,
  array['Paradižnike in kumaro nareži na večje kose, papriko in čebulo pa na tanke kolobarje.', 'Zelenjavo zloži v skledo in dodaj olive.', 'Na vrh položi kos feta sira.', 'Pokapaj z oljčnim oljem in potresi z origanom.'],
  16, 67, true, null
from public.categories where slug = 'solate-in-priloge';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'pecena-zelenjava-z-zelisci', 'Pečena zelenjava z zelišči', 'Pisana pečena zelenjava, ki je lahko priloga ali lahek obrok.', id, 50, 'lahka', 4, null,
  '[{"name":"bučka","amount":1,"unit":"kos"},{"name":"rdeča paprika","amount":1,"unit":"kos"},{"name":"korenje","amount":2,"unit":"kos"},{"name":"rdeča čebula","amount":1,"unit":"kos"},{"name":"jajčevec","amount":1,"unit":"kos"},{"name":"oljčno olje","amount":4,"unit":"žlice"},{"name":"timijan","amount":1,"unit":"žlička"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Pečico segrej na 210 °C.', 'Vso zelenjavo nareži na podobno velike kose.', 'Zelenjavo v skledi premešaj z oljem, soljo in timijanom.', 'Razporedi jo po pekaču v eni plasti in peci 35 minut; na polovici jo obrni.'],
  14, 60, true, null
from public.categories where slug = 'solate-in-priloge';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'kuskus-solata-s-papriko', 'Kuskus solata s papriko', 'Hitra solata za malico ali piknik, ki zdrži v hladilniku do dva dni.', id, 20, 'lahka', 4, null,
  '[{"name":"kuskus","amount":200,"unit":"g"},{"name":"rdeča paprika","amount":1,"unit":"kos"},{"name":"kumara","amount":1,"unit":"kos"},{"name":"meta","amount":0.5,"unit":"šopka"},{"name":"limona","amount":1,"unit":"kos"},{"name":"oljčno olje","amount":3,"unit":"žlice"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Kuskus prelij z 250 ml vrele osoljene vode, pokrij in pusti stati 5 minut.', 'Kuskus razrahljaj z vilicami in ga ohladi.', 'Papriko in kumaro nareži na majhne kocke, meto pa sesekljaj.', 'Vse zmešaj s kuskusom, dodaj limonin sok in olje ter posoli.'],
  11, 44, true, null
from public.categories where slug = 'solate-in-priloge';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'orehova-potica', 'Orehova potica', 'Praznična potica s kvašenim testom in bogatim orehovim nadevom.', id, 240, 'zahtevna', 12, null,
  '[{"name":"moka","amount":500,"unit":"g"},{"name":"kvas","amount":20,"unit":"g"},{"name":"mleko","amount":250,"unit":"ml"},{"name":"sladkor","amount":80,"unit":"g"},{"name":"maslo","amount":80,"unit":"g"},{"name":"rumenjaki","amount":3,"unit":"kos"},{"name":"mleti orehi","amount":400,"unit":"g"},{"name":"med","amount":100,"unit":"g"},{"name":"sladka smetana","amount":150,"unit":"ml"},{"name":"cimet","amount":1,"unit":"žlička"}]'::jsonb,
  array['Kvas raztopi v mlačnem mleku z žličko sladkorja in pusti, da vzhaja.', 'Zamesi testo iz moke, kvasa, preostalega sladkorja, stopljenega masla in rumenjakov; vzhaja naj 1 uro.', 'Za nadev orehe prelij z vročo smetano in primešaj med ter cimet.', 'Testo razvaljaj v pravokotnik, namaži nadev in tesno zvij.', 'Zvitek položi v namaščen model za potico in pusti vzhajati še 45 minut.', 'Peci 60 minut na 170 °C; po 30 minutah jo pokrij s peki papirjem.'],
  47, 230, true, null
from public.categories where slug = 'sladice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'jabolcni-zavitek', 'Jabolčni zavitek', 'Tanko vlečeno testo, polno jabolk, rozin in cimeta.', id, 90, 'zahtevna', 8, null,
  '[{"name":"vlečeno testo","amount":1,"unit":"zavitek"},{"name":"jabolka","amount":1200,"unit":"g"},{"name":"sladkor","amount":100,"unit":"g"},{"name":"cimet","amount":2,"unit":"žlički"},{"name":"rozine","amount":60,"unit":"g"},{"name":"drobtine","amount":60,"unit":"g"},{"name":"maslo","amount":80,"unit":"g"},{"name":"sladkor v prahu","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Jabolka olupi in naribaj ali nareži na tanke lističe.', 'Jabolka zmešaj s sladkorjem, cimetom in rozinami.', 'Drobtine popraži na polovici masla.', 'Liste testa namaži s stopljenim maslom, potresi z drobtinami in razporedi jabolčni nadev.', 'Testo zvij, položi na pekač in peci 45 minut na 180 °C.', 'Ohlajen zavitek potresi s sladkorjem v prahu.'],
  34, 160, true, null
from public.categories where slug = 'sladice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'cokoladni-mousse', 'Čokoladni mousse', 'Lahka, zračna čokoladna krema iz samo treh sestavin. Pred serviranjem se mora ohladiti.', id, 30, 'srednja', 4, null,
  '[{"name":"temna čokolada","amount":150,"unit":"g"},{"name":"jajca","amount":3,"unit":"kos"},{"name":"sladka smetana","amount":200,"unit":"ml"},{"name":"sladkor","amount":1,"unit":"žlica"}]'::jsonb,
  array['Čokolado stopi nad soparo in jo malo ohladi.', 'Ločeno stepi smetano in iz beljakov s sladkorjem trd sneg.', 'V čokolado vmešaj rumenjake, nato nežno primešaj smetano.', 'Na koncu z lopatko previdno vmešaj sneg, da mousse ostane zračen.', 'Razdeli v kozarčke in hladi vsaj 3 ure.'],
  28, 129, true, null
from public.categories where slug = 'sladice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'prekmurska-gibanica', 'Prekmurska gibanica', 'Plastovita sladica z makom, skuto, orehi in jabolki. Projekt za cel popoldan.', id, 180, 'zahtevna', 12, null,
  '[{"name":"krhko testo","amount":300,"unit":"g"},{"name":"vlečeno testo","amount":2,"unit":"zavitka"},{"name":"mleti mak","amount":250,"unit":"g"},{"name":"skuta","amount":500,"unit":"g"},{"name":"mleti orehi","amount":250,"unit":"g"},{"name":"jabolka","amount":800,"unit":"g"},{"name":"sladkor","amount":250,"unit":"g"},{"name":"jajca","amount":2,"unit":"kos"},{"name":"sladka smetana","amount":300,"unit":"ml"},{"name":"maslo","amount":150,"unit":"g"}]'::jsonb,
  array['Pripravi štiri nadeve: makovega, skutnega (z jajci in sladkorjem), orehovega in jabolčnega.', 'Z razvaljanim krhkim testom obloži dno globljega pekača.', 'Nadeve nalagaj v vrstnem redu mak, skuta, orehi, jabolka; med vsako plast položi list vlečenega testa, pokapan z maslom in smetano.', 'Zaporedje ponovi še enkrat in zaključi z listom testa, ki ga prelij s smetano.', 'Peci 75 minut na 180 °C in gibanico pred rezanjem ohladi.'],
  39, 191, true, null
from public.categories where slug = 'sladice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'francoski-toast-z-jagodami', 'Francoski toast z jagodami', 'Rezine kruha, namočene v jajčno-mlečno zmes in zapečene na maslu, s svežimi jagodami.', id, 20, 'lahka', 2, null,
  '[{"name":"kruh (star dan)","amount":4,"unit":"rezine"},{"name":"jajca","amount":2,"unit":"kos"},{"name":"mleko","amount":120,"unit":"ml"},{"name":"cimet","amount":0.5,"unit":"žličke"},{"name":"maslo","amount":20,"unit":"g"},{"name":"jagode","amount":200,"unit":"g"},{"name":"javorjev sirup","amount":2,"unit":"žlici"}]'::jsonb,
  array['V plitvi posodi razžvrkljaj jajca z mlekom in cimetom.', 'Rezine kruha na vsaki strani za nekaj sekund namoči v zmes.', 'V ponvi stopi maslo in kruh peci 2–3 minute na vsaki strani, da je zlato rjav.', 'Postrezi z narezanimi jagodami in pokapaj s sirupom.'],
  23, 101, true, null
from public.categories where slug = 'zajtrk';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'saksuka', 'Šakšuka', 'Jajca, poširana v pikantni omaki iz paradižnika in paprike. Postrezi kar v ponvi.', id, 30, 'srednja', 3, null,
  '[{"name":"jajca","amount":5,"unit":"kos"},{"name":"pelati","amount":400,"unit":"g"},{"name":"rdeča paprika","amount":1,"unit":"kos"},{"name":"čebula","amount":1,"unit":"kos"},{"name":"česen","amount":2,"unit":"stroka"},{"name":"mleta kumina","amount":1,"unit":"žlička"},{"name":"mleta sladka paprika","amount":1,"unit":"žlička"},{"name":"oljčno olje","amount":2,"unit":"žlici"},{"name":"peteršilj","amount":0.5,"unit":"šopka"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Na olju prepraži sesekljano čebulo in na trakove narezano papriko, da se zmehčata.', 'Dodaj česen, kumino in papriko ter praži pol minute.', 'Vmešaj pelate in omako kuhaj 10 minut, da se zgosti; posoli.', 'Z žlico naredi jamice in vanje ubij jajca.', 'Pokrij in kuhaj 6–8 minut, da beljaki zakrknejo, rumenjaki pa ostanejo mehki. Potresi s peteršiljem.'],
  19, 86, true, null
from public.categories where slug = 'zajtrk';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'smoothie-skleda-z-banano', 'Smoothie skleda z banano in borovnicami', 'Gost sadni smoothie, ki ga ješ z žlico, z dodatki po izbiri.', id, 10, 'lahka', 1, null,
  '[{"name":"zamrznjena banana","amount":1,"unit":"kos"},{"name":"zamrznjene borovnice","amount":100,"unit":"g"},{"name":"navadni jogurt","amount":150,"unit":"g"},{"name":"ovseni kosmiči","amount":2,"unit":"žlici"},{"name":"chia semena","amount":1,"unit":"žlička"},{"name":"kokosovi kosmiči","amount":1,"unit":"žlica"}]'::jsonb,
  array['Banano, borovnice in jogurt zmešaj v blenderju v gosto kremo.', 'Prelij v skledo.', 'Okrasi s kosmiči, chia semeni in kokosom ter takoj postrezi.'],
  9, 35, true, null
from public.categories where slug = 'zajtrk';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'omleta-s-sirom-in-sunko', 'Omleta s sirom in šunko', 'Puhasta omleta s topljenim sirom, ki je na mizi v manj kot četrt ure.', id, 15, 'lahka', 1, null,
  '[{"name":"jajca","amount":3,"unit":"kos"},{"name":"šunka","amount":50,"unit":"g"},{"name":"trdi sir (nariban)","amount":40,"unit":"g"},{"name":"mleko","amount":2,"unit":"žlici"},{"name":"maslo","amount":10,"unit":"g"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Jajca z mlekom in soljo razžvrkljaj z vilicami.', 'V ponvi stopi maslo in vlij jajca.', 'Ko se spodnja stran strdi, na polovico omlete potresi šunko in sir.', 'Omleto prepogni, pokrij za minuto, da se sir stopi, in postrezi.'],
  15, 61, true, null
from public.categories where slug = 'zajtrk';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'domaci-kruh-s-semeni', 'Domači kruh s semeni', 'Hrustljav polnozrnati kruh s sončničnimi in bučnimi semeni. Za ljubitelje peke.', id, 180, 'zahtevna', 10, null,
  '[{"name":"polnozrnata pšenična moka","amount":300,"unit":"g"},{"name":"bela moka","amount":200,"unit":"g"},{"name":"suhi kvas","amount":7,"unit":"g"},{"name":"mlačna voda","amount":350,"unit":"ml"},{"name":"sol","amount":2,"unit":"žlički"},{"name":"sončnična semena","amount":50,"unit":"g"},{"name":"bučna semena","amount":40,"unit":"g"},{"name":"med","amount":1,"unit":"žlička"}]'::jsonb,
  array['V vodi raztopi med in kvas ter pusti stati 10 minut.', 'Dodaj obe moki in sol ter gneti 10 minut, da dobiš gladko, rahlo lepljivo testo.', 'Vgneti semena, pokrij in pusti vzhajati 1 uro, da se podvoji.', 'Oblikuj hlebec, ga položi v namaščen model in pusti vzhajati še 40 minut.', 'Peci 40 minut na 220 °C; prvih 10 minut na dno pečice postavi posodo z vodo.', 'Kruh pred rezanjem ohladi na rešetki.'],
  13, 60, true, null
from public.categories where slug = 'zajtrk';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'ricet', 'Ričet', 'Gosta enolončnica iz ješprenja, fižola in prekajenega mesa. Prava zimska jed.', id, 120, 'srednja', 6, null,
  '[{"name":"ješprenj","amount":200,"unit":"g"},{"name":"fižol (kuhan)","amount":400,"unit":"g"},{"name":"prekajena svinjska krača","amount":500,"unit":"g"},{"name":"korenje","amount":2,"unit":"kos"},{"name":"peteršiljeva korenina","amount":1,"unit":"kos"},{"name":"čebula","amount":1,"unit":"kos"},{"name":"lovorjev list","amount":2,"unit":"kos"},{"name":"peteršilj","amount":0.5,"unit":"šopka"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Kračo kuhaj v 2,5 litra vode 1 uro.', 'Ješprenj operi in ga dodaj v lonec skupaj z lovorjem.', 'Dodaj na kocke narezano korenje, korenino in čebulo ter kuhaj 40 minut, da se ješprenj zmehča.', 'Krači odstrani kost, meso nareži in ga vrni v lonec skupaj s fižolom.', 'Kuhaj še 10 minut, posoli in potresi s peteršiljem.'],
  25, 113, true, null
from public.categories where slug = 'juhe-in-enolocnice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'piscancja-juha-z-zelenjavo', 'Piščančja juha z zelenjavo', 'Lahka, a nasitna juha s koščki piščanca in veliko zelenjave. Dobra, ko te stiska prehlad.', id, 75, 'lahka', 6, null,
  '[{"name":"piščančja bedra","amount":600,"unit":"g"},{"name":"korenje","amount":3,"unit":"kos"},{"name":"zelena","amount":0.25,"unit":"kos"},{"name":"por","amount":1,"unit":"kos"},{"name":"grah","amount":100,"unit":"g"},{"name":"zvezdice za juho","amount":80,"unit":"g"},{"name":"sol","amount":null,"unit":"po okusu"},{"name":"peteršilj","amount":0.5,"unit":"šopka"}]'::jsonb,
  array['Piščanca zalij z 2 litroma hladne vode, zavri in odstrani peno.', 'Kuhaj 40 minut, nato meso vzemi iz juhe in ga oberi s kosti.', 'V juho dodaj na kolobarje narezano korenje, zeleno in por ter kuhaj 15 minut.', 'Dodaj grah, zvezdice in meso ter kuhaj še 8 minut.', 'Posoli in potresi s peteršiljem.'],
  20, 86, true, null
from public.categories where slug = 'juhe-in-enolocnice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'gobova-kremna-juha', 'Gobova kremna juha', 'Gozdna juha iz šampinjonov in suhih jurčkov s kančkom smetane.', id, 50, 'srednja', 4, null,
  '[{"name":"šampinjoni","amount":500,"unit":"g"},{"name":"suhi jurčki","amount":15,"unit":"g"},{"name":"krompir","amount":1,"unit":"kos"},{"name":"čebula","amount":1,"unit":"kos"},{"name":"maslo","amount":30,"unit":"g"},{"name":"zelenjavna osnova","amount":900,"unit":"ml"},{"name":"kisla smetana","amount":100,"unit":"g"},{"name":"timijan","amount":0.5,"unit":"žličke"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Jurčke namoči v kozarcu tople vode za 15 minut.', 'Na maslu prepraži čebulo, dodaj narezane šampinjone in praži, da izpari tekočina.', 'Dodaj na kocke narezan krompir, jurčke z vodo, timijan in osnovo ter kuhaj 20 minut.', 'Juho zmešaj s paličnim mešalnikom; nekaj koščkov gob lahko prej odložiš za okras.', 'Vmešaj kislo smetano in posoli.'],
  17, 75, true, null
from public.categories where slug = 'juhe-in-enolocnice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'minestrone', 'Minestrone', 'Italijanska zelenjavna juha s testeninami in fižolom. Odlična za porabo zelenjave.', id, 50, 'lahka', 6, null,
  '[{"name":"bučka","amount":1,"unit":"kos"},{"name":"korenje","amount":2,"unit":"kos"},{"name":"steblasta zelena","amount":2,"unit":"stebli"},{"name":"čebula","amount":1,"unit":"kos"},{"name":"pelati","amount":400,"unit":"g"},{"name":"beli fižol (kuhan)","amount":250,"unit":"g"},{"name":"kratke testenine","amount":100,"unit":"g"},{"name":"zelenjavna osnova","amount":1500,"unit":"ml"},{"name":"parmezan","amount":40,"unit":"g"},{"name":"oljčno olje","amount":2,"unit":"žlici"}]'::jsonb,
  array['Na olju prepraži sesekljano čebulo, korenje in zeleno.', 'Dodaj na kocke narezano bučko in pelate ter praži 5 minut.', 'Zalij z osnovo in kuhaj 20 minut.', 'Dodaj fižol in testenine ter kuhaj, dokler testenine niso mehke.', 'Postrezi z naribanim parmezanom.'],
  12, 48, true, null
from public.categories where slug = 'juhe-in-enolocnice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'dunajski-zrezek', 'Dunajski zrezek', 'Tanko potolčen panirani zrezek, ocvrt do hrustljavega. Postrezi z limono in krompirjevo solato.', id, 40, 'srednja', 4, null,
  '[{"name":"svinjski ali telečji zrezki","amount":4,"unit":"kos"},{"name":"moka","amount":80,"unit":"g"},{"name":"jajca","amount":2,"unit":"kos"},{"name":"drobtine","amount":150,"unit":"g"},{"name":"olje za cvrtje","amount":400,"unit":"ml"},{"name":"limona","amount":1,"unit":"kos"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Zrezke med dvema folijama potolči na debelino približno 4 mm in jih posoli.', 'Pripravi tri krožnike: moko, razžvrkljana jajca in drobtine.', 'Vsak zrezek povaljaj v moki, jajcih in drobtinah; drobtin ne pritiskaj premočno.', 'Olje segrej na 170 °C in zrezke cvri 2–3 minute na vsaki strani.', 'Odcedi na papirnati brisački in postrezi z rezinami limone.'],
  48, 221, true, null
from public.categories where slug = 'glavne-jedi';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'mesne-kroglice-v-paradiznikovi-omaki', 'Mesne kroglice v paradižnikovi omaki', 'Sočne kroglice, dušene v gosti paradižnikovi omaki. Postrezi s testeninami ali pirejem.', id, 60, 'srednja', 4, null,
  '[{"name":"mleto meso","amount":600,"unit":"g"},{"name":"jajce","amount":1,"unit":"kos"},{"name":"drobtine","amount":40,"unit":"g"},{"name":"česen","amount":3,"unit":"stroki"},{"name":"peteršilj","amount":0.5,"unit":"šopka"},{"name":"paradižnikova passata","amount":700,"unit":"ml"},{"name":"čebula","amount":1,"unit":"kos"},{"name":"origano","amount":1,"unit":"žlička"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Meso zmešaj z jajcem, drobtinami, polovico česna, peteršiljem in soljo.', 'Z mokrimi rokami oblikuj kroglice velikosti oreha.', 'Kroglice opeci na olju z vseh strani in jih odloži.', 'V isti posodi prepraži čebulo in preostali česen, prilij passato in dodaj origano.', 'Vrni kroglice v omako in jih pokrito duši 25 minut.'],
  30, 132, true, null
from public.categories where slug = 'glavne-jedi';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'piscancja-bedra-z-medom-in-gorcico', 'Piščančja bedra z medom in gorčico', 'Hrustljava pečena bedra v sladko-pikantni glazuri. Skoraj brez dela.', id, 60, 'lahka', 4, null,
  '[{"name":"piščančja bedra","amount":8,"unit":"kos"},{"name":"med","amount":3,"unit":"žlice"},{"name":"dijonska gorčica","amount":2,"unit":"žlici"},{"name":"sojina omaka","amount":2,"unit":"žlici"},{"name":"česen","amount":2,"unit":"stroka"},{"name":"oljčno olje","amount":1,"unit":"žlica"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Pečico segrej na 200 °C.', 'Zmešaj med, gorčico, sojino omako, strt česen in olje.', 'Bedra rahlo posoli, položi v pekač s kožo navzgor in jih premaži z glazuro.', 'Peci 45 minut; na polovici jih še enkrat premaži s sokom iz pekača.'],
  27, 122, true, null
from public.categories where slug = 'glavne-jedi';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'spageti-bolognese', 'Špageti bolognese', 'Mesna omaka, ki se kuha počasi, da postane bogata in gosta.', id, 75, 'srednja', 4, null,
  '[{"name":"špageti","amount":400,"unit":"g"},{"name":"mleto goveje meso","amount":500,"unit":"g"},{"name":"čebula","amount":1,"unit":"kos"},{"name":"korenje","amount":1,"unit":"kos"},{"name":"steblasta zelena","amount":1,"unit":"steblo"},{"name":"pelati","amount":800,"unit":"g"},{"name":"rdeče vino","amount":100,"unit":"ml"},{"name":"paradižnikova mezga","amount":1,"unit":"žlica"},{"name":"parmezan","amount":50,"unit":"g"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Čebulo, korenje in zeleno drobno nasekljaj in na olju počasi praži 8 minut.', 'Dodaj meso in ga praži, dokler ne porjavi.', 'Prilij vino in počakaj, da izpari, nato dodaj mezgo in pelate.', 'Omako pokrito kuhaj na nizkem ognju vsaj 45 minut; posoli.', 'Skuhaj špagete, jih premešaj z omako in postrezi s parmezanom.'],
  45, 203, true, null
from public.categories where slug = 'glavne-jedi';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'tortilje-s-piscancem-in-papriko', 'Tortilje s piščancem in papriko', 'Hitre mehiške tortilje s popečenim piščancem, papriko in kislo smetano.', id, 30, 'lahka', 4, null,
  '[{"name":"piščančje prsi","amount":500,"unit":"g"},{"name":"tortilje","amount":8,"unit":"kos"},{"name":"rdeča paprika","amount":1,"unit":"kos"},{"name":"rumena paprika","amount":1,"unit":"kos"},{"name":"rdeča čebula","amount":1,"unit":"kos"},{"name":"začimbe za fajitas","amount":2,"unit":"žlici"},{"name":"kisla smetana","amount":150,"unit":"g"},{"name":"limeta","amount":1,"unit":"kos"}]'::jsonb,
  array['Piščanca nareži na trakove in ga potresi z začimbami.', 'V vroči ponvi ga opeci 5 minut in ga odloži.', 'V isti ponvi na hitro popeci na trakove narezano papriko in čebulo.', 'Vrni piščanca v ponev in pokapaj z limetinim sokom.', 'Tortilje segrej in jih napolni z nadevom ter kislo smetano.'],
  22, 92, true, null
from public.categories where slug = 'glavne-jedi';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'zelenjavna-lazanja', 'Zelenjavna lazanja', 'Plasti testenin, pečene zelenjave in bešamela, zapečene s sirom.', id, 90, 'zahtevna', 6, null,
  '[{"name":"listi za lazanjo","amount":250,"unit":"g"},{"name":"bučka","amount":2,"unit":"kos"},{"name":"jajčevec","amount":1,"unit":"kos"},{"name":"rdeča paprika","amount":1,"unit":"kos"},{"name":"paradižnikova passata","amount":500,"unit":"ml"},{"name":"mleko","amount":700,"unit":"ml"},{"name":"maslo","amount":50,"unit":"g"},{"name":"moka","amount":50,"unit":"g"},{"name":"mozzarella","amount":200,"unit":"g"},{"name":"muškatni orešček","amount":1,"unit":"ščep"}]'::jsonb,
  array['Zelenjavo nareži na kocke in jo na olju dušaj 10 minut; primešaj passato.', 'Za bešamel na maslu prepraži moko, postopoma prilivaj mleko in mešaj, da se zgosti; začini z muškatom.', 'V pekač izmenično nalagaj omako, liste lazanje in bešamel.', 'Zaključi z bešamelom in natrgano mozzarello.', 'Peci 40 minut na 180 °C in pred rezanjem pusti stati 10 minut.'],
  21, 92, true, null
from public.categories where slug = 'vegetarijansko';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'falafel-z-jogurtovo-omako', 'Falafel z jogurtovo omako', 'Hrustljave kroglice iz čičerike in zelišč s svežo omako iz jogurta in kumare.', id, 60, 'srednja', 4, null,
  '[{"name":"suha čičerika (namočena čez noč)","amount":250,"unit":"g"},{"name":"čebula","amount":1,"unit":"kos"},{"name":"česen","amount":2,"unit":"stroka"},{"name":"peteršilj","amount":1,"unit":"šopek"},{"name":"mleta kumina","amount":1,"unit":"žlička"},{"name":"moka","amount":2,"unit":"žlici"},{"name":"olje za cvrtje","amount":500,"unit":"ml"},{"name":"grški jogurt","amount":200,"unit":"g"},{"name":"kumara","amount":0.5,"unit":"kos"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Namočeno čičeriko dobro odcedi; ne kuhaj je.', 'V sekljalniku jo zmelji s čebulo, česnom, peteršiljem, kumino in soljo v grobo zmes; primešaj moko.', 'Oblikuj kroglice in jih postavi v hladilnik za 20 minut.', 'Cvri jih v vročem olju 3–4 minute, da so zlato rjave.', 'Za omako zmešaj jogurt z naribano kumaro in ščepcem soli.'],
  16, 69, true, null
from public.categories where slug = 'vegetarijansko';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'pica-margerita', 'Pica margerita', 'Domača pica s tankim testom, paradižnikom, mozzarello in baziliko.', id, 120, 'srednja', 2, null,
  '[{"name":"moka tip 00","amount":300,"unit":"g"},{"name":"suhi kvas","amount":4,"unit":"g"},{"name":"mlačna voda","amount":190,"unit":"ml"},{"name":"sol","amount":1,"unit":"žlička"},{"name":"oljčno olje","amount":2,"unit":"žlici"},{"name":"pelati","amount":200,"unit":"g"},{"name":"mozzarella","amount":200,"unit":"g"},{"name":"bazilika","amount":1,"unit":"šopek"}]'::jsonb,
  array['Kvas raztopi v vodi, dodaj moko, sol in olje ter gneti 10 minut.', 'Testo pokrij in pusti vzhajati 1 uro.', 'Pečico segrej na najvišjo temperaturo (vsaj 250 °C) skupaj s pekačem.', 'Testo razdeli na dva dela in ga z rokami raztegni v tanek krog.', 'Namaži zmečkane pelate, dodaj natrgano mozzarello in peci 8–10 minut.', 'Pečeno pico obloži s svežo baziliko.'],
  42, 193, true, null
from public.categories where slug = 'vegetarijansko';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'ocvrti-sir-s-tatarsko-omako', 'Ocvrti sir s tatarsko omako', 'Klasika slovenskih gostiln: hrustljava zunanjost in raztopljen sir v notranjosti.', id, 25, 'lahka', 2, null,
  '[{"name":"trdi sir (debele rezine)","amount":4,"unit":"kos"},{"name":"moka","amount":50,"unit":"g"},{"name":"jajca","amount":2,"unit":"kos"},{"name":"drobtine","amount":100,"unit":"g"},{"name":"olje za cvrtje","amount":300,"unit":"ml"},{"name":"majoneza","amount":4,"unit":"žlice"},{"name":"kisle kumarice","amount":2,"unit":"kos"},{"name":"kapre","amount":1,"unit":"žlička"}]'::jsonb,
  array['Rezine sira (debele vsaj 1 cm) povaljaj v moki, jajcih in drobtinah.', 'Postopek z jajci in drobtinami ponovi, da sir med cvrtjem ne izteče.', 'Cvri v vročem olju približno minuto na vsaki strani.', 'Za omako majonezi primešaj drobno sesekljane kumarice in kapre.'],
  35, 147, true, null
from public.categories where slug = 'vegetarijansko';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'ajdova-kasa-z-gobami', 'Ajdova kaša z gobami', 'Domača ajdova kaša z gozdnimi gobami in čebulo. Preprosta in hranljiva.', id, 40, 'lahka', 4, null,
  '[{"name":"ajdova kaša","amount":250,"unit":"g"},{"name":"gozdne gobe ali šampinjoni","amount":300,"unit":"g"},{"name":"čebula","amount":1,"unit":"kos"},{"name":"česen","amount":2,"unit":"stroka"},{"name":"zelenjavna osnova","amount":600,"unit":"ml"},{"name":"maslo","amount":30,"unit":"g"},{"name":"peteršilj","amount":0.5,"unit":"šopka"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Kašo operi in jo na suhi ponvi na kratko popraži.', 'Zalij z osnovo, pokrij in kuhaj na nizkem ognju 15 minut.', 'Na maslu prepraži čebulo, dodaj narezane gobe in česen ter praži 8 minut.', 'Gobe vmešaj v kašo, posoli in potresi s peteršiljem.'],
  10, 38, true, null
from public.categories where slug = 'vegetarijansko';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'krompirjev-pire', 'Krompirjev pire', 'Gladek, masleni pire, ki se poda k skoraj vsaki glavni jedi.', id, 30, 'lahka', 4, null,
  '[{"name":"moknat krompir","amount":1000,"unit":"g"},{"name":"mleko","amount":200,"unit":"ml"},{"name":"maslo","amount":60,"unit":"g"},{"name":"muškatni orešček","amount":1,"unit":"ščep"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Krompir olupi, nareži na enake kose in ga skuhaj v osoljeni vodi do mehkega.', 'Odcedi ga in pusti v loncu minuto, da izpari odvečna voda.', 'Mleko z maslom segrej.', 'Krompir pretlači in postopoma vmešaj toplo mleko; začini z muškatom in soljo.'],
  26, 117, true, null
from public.categories where slug = 'solate-in-priloge';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'fizolova-solata-z-bucnim-oljem', 'Fižolova solata z bučnim oljem', 'Štajerska solata iz fižola in rdeče čebule, prelita z bučnim oljem.', id, 15, 'lahka', 4, null,
  '[{"name":"rjavi fižol (kuhan)","amount":500,"unit":"g"},{"name":"rdeča čebula","amount":1,"unit":"kos"},{"name":"bučno olje","amount":3,"unit":"žlice"},{"name":"jabolčni kis","amount":2,"unit":"žlici"},{"name":"sol","amount":null,"unit":"po okusu"},{"name":"črni poper","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Fižol odcedi in ga speri pod hladno vodo.', 'Čebulo nareži na tanke kolobarje.', 'Fižol in čebulo začini s kisom, soljo in poprom.', 'Tik pred serviranjem prelij z bučnim oljem.'],
  11, 45, true, null
from public.categories where slug = 'solate-in-priloge';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'zeljna-solata-z-jogurtovim-prelivom', 'Zeljna solata z jogurtovim prelivom', 'Hrustljava solata iz belega zelja in korenja z lahkim jogurtovim prelivom.', id, 20, 'lahka', 6, null,
  '[{"name":"belo zelje","amount":500,"unit":"g"},{"name":"korenje","amount":2,"unit":"kos"},{"name":"navadni jogurt","amount":150,"unit":"g"},{"name":"majoneza","amount":2,"unit":"žlici"},{"name":"jabolčni kis","amount":1,"unit":"žlica"},{"name":"sladkor","amount":1,"unit":"žlička"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Zelje na tanko naribaj, posoli in ga z rokami pregneti, da se zmehča.', 'Dodaj naribano korenje.', 'Zmešaj jogurt, majonezo, kis in sladkor.', 'Preliv vmešaj v solato in jo pred serviranjem ohladi.'],
  8, 30, true, null
from public.categories where slug = 'solate-in-priloge';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'rizi-bizi', 'Riži-biži', 'Dušen riž z grahom, priljubljena priloga k mesu in ribam.', id, 30, 'lahka', 4, null,
  '[{"name":"riž","amount":250,"unit":"g"},{"name":"grah (zamrznjen)","amount":200,"unit":"g"},{"name":"čebula","amount":0.5,"unit":"kos"},{"name":"maslo","amount":20,"unit":"g"},{"name":"zelenjavna osnova","amount":550,"unit":"ml"},{"name":"sol","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Na maslu prepraži drobno sesekljano čebulo.', 'Dodaj riž in ga praži minuto.', 'Zalij z vročo osnovo, posoli, pokrij in kuhaj 12 minut.', 'Vmešaj grah in kuhaj še 5 minut, da riž vpije tekočino.'],
  14, 56, true, null
from public.categories where slug = 'solate-in-priloge';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'tiramisu', 'Tiramisu', 'Italijanska sladica s piškoti, namočenimi v kavo, in kremo iz mascarponeja.', id, 40, 'srednja', 8, null,
  '[{"name":"piškoti savoiardi","amount":300,"unit":"g"},{"name":"mascarpone","amount":500,"unit":"g"},{"name":"jajca","amount":4,"unit":"kos"},{"name":"sladkor","amount":100,"unit":"g"},{"name":"močna kava (ohlajena)","amount":300,"unit":"ml"},{"name":"kakav v prahu","amount":2,"unit":"žlici"}]'::jsonb,
  array['Rumenjake s sladkorjem penasto umešaj in primešaj mascarpone.', 'Beljake stepi v trd sneg in ga nežno vmešaj v kremo.', 'Piškote na hitro pomakaj v kavo in jih zloži na dno posode.', 'Prekrij s polovico kreme, ponovi plast piškotov in zaključi s kremo.', 'Čez noč ohladi v hladilniku in pred serviranjem posipaj s kakavom.'],
  50, 240, true, null
from public.categories where slug = 'sladice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'cokoladni-piskoti', 'Čokoladni piškoti', 'Mehki piškoti s koščki čokolade, zunaj hrustljavi, znotraj žvečljivi.', id, 35, 'lahka', 20, null,
  '[{"name":"moka","amount":250,"unit":"g"},{"name":"maslo","amount":125,"unit":"g"},{"name":"rjavi sladkor","amount":150,"unit":"g"},{"name":"jajce","amount":1,"unit":"kos"},{"name":"pecilni prašek","amount":1,"unit":"žlička"},{"name":"temna čokolada","amount":150,"unit":"g"},{"name":"vanilijev sladkor","amount":1,"unit":"vrečka"},{"name":"sol","amount":1,"unit":"ščep"}]'::jsonb,
  array['Pečico segrej na 180 °C.', 'Mehko maslo penasto umešaj s sladkorjem, nato dodaj jajce in vanilijev sladkor.', 'Primešaj moko, pecilni prašek, sol in na koščke narezano čokolado.', 'Z žlico oblikuj kupčke na pekač, z razmikom, ker se razlezejo.', 'Peci 10–12 minut; sredina naj ostane mehka.'],
  32, 144, true, null
from public.categories where slug = 'sladice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'panna-cotta-z-jagodno-omako', 'Panna cotta z jagodno omako', 'Nežna smetanova krema z vanilijo in sveže kuhano jagodno omako.', id, 25, 'lahka', 4, null,
  '[{"name":"sladka smetana","amount":500,"unit":"ml"},{"name":"sladkor","amount":60,"unit":"g"},{"name":"želatina v lističih","amount":3,"unit":"kos"},{"name":"vanilijev strok","amount":1,"unit":"kos"},{"name":"jagode","amount":250,"unit":"g"},{"name":"sladkor (za omako)","amount":2,"unit":"žlici"}]'::jsonb,
  array['Želatino namoči v hladni vodi.', 'Smetano s sladkorjem in semeni vanilije segrej, a ne zavri.', 'Odstavi, vmešaj ožeto želatino in razdeli v kozarčke.', 'Hladi vsaj 4 ure.', 'Za omako jagode s sladkorjem kuhaj 5 minut in jih pretlači; prelij čez strjeno kremo.'],
  18, 79, true, null
from public.categories where slug = 'sladice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'bananin-kruh', 'Bananin kruh', 'Sočen kolač iz prezrelih banan. Najboljši način za porabo rjavih banan.', id, 70, 'lahka', 10, null,
  '[{"name":"zrele banane","amount":3,"unit":"kos"},{"name":"moka","amount":220,"unit":"g"},{"name":"rjavi sladkor","amount":100,"unit":"g"},{"name":"jajci","amount":2,"unit":"kos"},{"name":"stopljeno maslo","amount":80,"unit":"g"},{"name":"soda bikarbona","amount":1,"unit":"žlička"},{"name":"cimet","amount":1,"unit":"žlička"},{"name":"orehi","amount":50,"unit":"g"}]'::jsonb,
  array['Pečico segrej na 175 °C in model za kruh obloži s peki papirjem.', 'Banane z vilicami pretlači v kašo.', 'Primešaj jajci, maslo in sladkor.', 'Dodaj moko, sodo, cimet in sesekljane orehe ter premešaj le toliko, da se poveže.', 'Peci 55 minut oziroma dokler zobotrebec ne pride ven suh.'],
  24, 110, true, null
from public.categories where slug = 'sladice';

insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)
select 'kremna-rezina', 'Kremna rezina', 'Visoka vanilijeva krema in stepena smetana med dvema plastema listnatega testa.', id, 120, 'zahtevna', 12, null,
  '[{"name":"listnato testo","amount":2,"unit":"zavitka"},{"name":"mleko","amount":1000,"unit":"ml"},{"name":"jajca","amount":6,"unit":"kos"},{"name":"sladkor","amount":180,"unit":"g"},{"name":"moka","amount":80,"unit":"g"},{"name":"vanilijev sladkor","amount":2,"unit":"vrečki"},{"name":"sladka smetana","amount":500,"unit":"ml"},{"name":"sladkor v prahu","amount":null,"unit":"po okusu"}]'::jsonb,
  array['Listnato testo speci po navodilih na embalaži, eno ploščo nareži na kvadrate.', 'Rumenjake umešaj s sladkorjem, moko in vanilijevim sladkorjem ter primešaj kozarec mleka.', 'Preostalo mleko zavri, vmešaj rumenjakovo zmes in kuhaj, da se zgosti.', 'V vročo kremo vmešaj trd sneg iz beljakov in jo prelij čez celo ploščo testa v modelu.', 'Ko se krema ohladi, nanjo namaži stepeno smetano in položi kvadrate testa.', 'Hladi čez noč, potresi s sladkorjem v prahu in reži z ostrim nožem.'],
  37, 174, true, null
from public.categories where slug = 'sladice';
