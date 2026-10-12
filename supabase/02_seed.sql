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
