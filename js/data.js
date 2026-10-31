/*
 * Los Multiversos de Bruno — contenido de los cuentos.
 * Todos los textos son originales, escritos para esta app.
 * Marcadores entre llaves ({aliado}, {villano}, {meta}...) los completa el generador.
 * Si el marcador empieza con mayúscula ({Villano}), el valor se escribe con mayúscula inicial.
 * Regla de estilo: {meta} y {objeto} siempre son singulares y se evitan pronombres
 * o adjetivos que dependan de su género.
 */
(function (root, factory) {
  var data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.BrunoData = data;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var TRAITS = {
    valentia: { label: 'Valentía', emoji: '🦁', badge: 'Corazón Valiente', ending: 'El final del corazón valiente' },
    amistad: { label: 'Amistad', emoji: '💛', badge: 'Amigo de Todos los Mundos', ending: 'El final del nuevo amigo' },
    ingenio: { label: 'Ingenio', emoji: '💡', badge: 'Cerebro Brillante', ending: 'El final del plan genial' },
    honestidad: { label: 'Honestidad', emoji: '🌟', badge: 'Palabra de Oro', ending: 'El final de la palabra verdadera' },
    equipo: { label: 'Trabajo en equipo', emoji: '🛡️', badge: 'Capitán de Equipo', ending: 'El final del gran equipo' }
  };

  var COMPANIONS = {
    amy: { name: 'Amy', emoji: '🔨', desc: 'Valiente, rapidísima y con su martillo siempre listo. Primero actúa y después pregunta (a veces).' },
    perlita: { name: 'Perlita', emoji: '🫧', desc: 'La guardiana de las perlas-portal. Curiosa, cuidadosa y llena de datos rarísimos del multiverso.' }
  };

  var PEARL_COLORS = ['dorada', 'turquesa', 'violeta', 'color fuego', 'plateada', 'verde esmeralda', 'celeste cielo', 'rosa chicle'];

  var OBJECTS = [
    { objeto: 'la Brújula Cantora', unObjeto: 'una brújula que tarareaba bajito', poderObjeto: 'canta más fuerte cuanto más cerca estás de lo que buscás',
      usoObjeto: 'La brújula empezó a cantar una melodía alegre y la aguja señaló un sendero escondido entre las rocas, que nadie había visto. Lo siguieron cantando con ella y llegaron sanos y salvos al otro lado.' },
    { objeto: 'el Yo-yo Rebotador', unObjeto: 'un yo-yo plateado', poderObjeto: 'se engancha en cualquier cosa y siempre vuelve a tu mano',
      usoObjeto: 'Bruno lanzó el yo-yo, que voló como una flecha y se enganchó en una rama del otro lado. Ataron una soga y cruzaron colgados, uno por uno, como en una tirolesa.' },
    { objeto: 'la Linterna de las Sombras Amables', unObjeto: 'una linterna chiquita', poderObjeto: 'hace que las sombras muestren caminos secretos',
      usoObjeto: 'Bruno encendió la linterna y las sombras de los árboles se estiraron hasta formar un puente oscuro pero firme, que solo se veía con esa luz. Cruzaron pisando sombras.' },
    { objeto: 'la Mochila Sin Fondo', unObjeto: 'una mochila remendada', poderObjeto: 'guarda cualquier cosa, por grande que sea',
      usoObjeto: 'Bruno metió la mano en la mochila y, después de sacar una media, un paraguas y un pato de goma, encontró una escalera larguísima. La acostaron de lado a lado y la usaron de puente.' },
    { objeto: 'la Tiza Mágica', unObjeto: 'una tiza de todos los colores', poderObjeto: 'hace real lo que dibujás, durante un minuto',
      usoObjeto: 'Bruno dibujó en el aire un puente con barandas y todo. Durante un minuto exacto el puente fue de verdad, y cruzaron corriendo mientras Perlita contaba los segundos.' },
    { objeto: 'el Silbato de los Ecos', unObjeto: 'un silbato de madera', poderObjeto: 'lleva tu voz hasta cualquier rincón del mundo',
      usoObjeto: 'Bruno sopló el silbato y su llamado viajó lejos, lejísimo, hasta que respondió un pájaro gigante y amable que bajó a buscarlos y los cruzó volando.' },
    { objeto: 'el Monóculo de Ver Verdades', unObjeto: 'un monóculo redondo con marco dorado', poderObjeto: 'muestra lo que es verdad y lo que es un truco',
      usoObjeto: 'Bruno miró a través del monóculo y se le escapó una risa: el precipicio era un truco pintado. El piso seguía ahí, firme. Cruzaron caminando mientras los demás no lo podían creer.' },
    { objeto: 'la Bufanda Planeadora', unObjeto: 'una bufanda larguísima a rayas', poderObjeto: 'se abre como un par de alas cuando hace falta volar',
      usoObjeto: 'Bruno revoleó la bufanda, que se abrió como dos alas a rayas. Se agarraron todos de las puntas, tomaron carrera y cruzaron planeando como una cometa gigante.' },
    { objeto: 'el Reloj de Arena Paciente', unObjeto: 'un relojito de arena', poderObjeto: 'detiene el tiempo durante tres respiraciones',
      usoObjeto: 'Bruno dio vuelta el reloj de arena y todo se detuvo: hasta unas piedras que caían quedaron flotando en el aire. Las usaron como escalones y cruzaron justo antes de la tercera respiración.' },
    { objeto: 'la Pelota Imantada', unObjeto: 'una pelota de goma con rayas', poderObjeto: 'atrae cualquier cosa de metal',
      usoObjeto: 'Bruno tiró la pelota, que se pegó con un ¡clanc! a una baranda de metal del otro lado. Con una soga atada a la pelota armaron un pasamanos y cruzaron colgados, riéndose.' }
  ];

  var OPENINGS = [
    'Era sábado a la tarde y Bruno, que tenía diez años y una imaginación del tamaño de una galaxia, estaba armando una nave espacial con cajas de cartón cuando la perla del estante empezó a brillar. —¡Bruno! —gritó una vocecita—. ¡Es una emergencia multiversal! Era Perlita, la guardiana de las perlas-portal, flotando con su bolsita de perlas de todos los colores. Detrás de ella apareció Amy, con el martillo al hombro y cara de «vamos ya».',
    'Bruno acababa de terminar la tarea de matemática (con la última cuenta revisada dos veces, porque él era así) cuando escuchó un tintineo debajo de la cama. Se asomó y vio una luz {colorPerla}. —Hola, Bruno —dijo Perlita, sacudiéndose el polvo—. Perdón por entrar por abajo de la cama: los portales salen donde quieren. Amy salió detrás, haciendo girar su martillo: —Te necesitamos. Y es urgente.',
    'Esa noche había tormenta y Bruno no podía dormir. Contaba relámpagos cuando, en vez de un rayo, por la ventana entró una perla {colorPerla} dando vueltas como un trompo. La perla se abrió como una puerta redonda y de adentro saltaron Perlita y Amy. —Bruno, sos el único que puede ayudarnos —dijo Perlita, muy seria. Amy asintió: —Traé tu valentía. El martillo lo pongo yo.',
    'En el recreo, mientras todos jugaban a la pelota, Bruno encontró en el arenero una perla {colorPerla}, tibia como un pancito recién hecho. Apenas la tocó, el patio se quedó quieto como en una foto. Solo él, Amy y Perlita podían moverse. —Tranquilo —sonrió Perlita—, acá el tiempo nos espera. Tenemos una misión. —Y es de las difíciles —agregó Amy—. Mis favoritas.',
    'Bruno estaba leyendo un libro de dinosaurios cuando las letras de la página empezaron a moverse y formaron un mensaje: «BRUNO: TE ESPERAMOS DEL OTRO LADO». De la página saltó una perla {colorPerla} y, detrás, como si bajaran por un tobogán, cayeron Amy y Perlita sobre la alfombra. —Perdón por el aterrizaje —dijo Perlita—. Hay problemas en el multiverso.',
    'Bruno se estaba haciendo un licuado de banana cuando la licuadora empezó a girar al revés y de adentro salió una burbuja... con Perlita adentro. —¡Puaj, banana! —se rió ella, limpiando una perla {colorPerla}. Amy entró por la puerta del patio como si hubiera estado esperando: —¿Listo, Bruno? El equipo está completo.',
    'Bruno había jurado que esa tarde iba a ordenar su cuarto. Iba por la mitad (es decir, había juntado tres medias) cuando el placard se iluminó de una luz {colorPerla}. Las puertas se abrieron solas y salieron Amy, con su martillo, y Perlita, con su bolsita de perlas tintineando. —El orden puede esperar —dijo Amy—. El multiverso, no.',
    'Bruno estaba en el patio pateando penales contra la pared cuando la pelota, en vez de rebotar, atravesó el ladrillo como si fuera agua. Del agujero salió rodando una perla {colorPerla} y, detrás, asomaron dos caras conocidas: Amy y Perlita. —Linda patada —dijo Amy—. Ahora vení: hay un mundo que te necesita.',
    'Bruno se despertó un domingo bien temprano porque alguien le hacía cosquillas en la nariz. Era Perlita, flotando sobre la almohada con una perla {colorPerla} en las manos. —Shhh —susurró—, no despiertes a nadie. Amy espiaba por la ventana, martillo en mano. —Desayunamos después —dijo—. Primero, la aventura.'
  ];

  var ARRIVALS = [
    'Perlita levantó la perla {colorPerla}, sopló sobre ella como si fuera una vela de cumpleaños y el mundo dio una vuelta carnero. Cuando Bruno abrió los ojos, estaban en {mundo}.',
    'Los tres se tomaron de las manos. La perla {colorPerla} giró, zumbó, hizo ¡plop! y, un segundo después, Bruno sentía un aire nuevo en la cara: habían llegado a {mundo}.',
    'Atravesaron el portal como quien se tira por un tobogán de luz. Bruno aterrizó de pie, Amy de rodillas y Perlita flotando, porque ella nunca aterriza. Estaban en el medio de {mundo}.',
    'Perlita hizo rodar la perla {colorPerla} por el piso y se abrió un agujero redondo lleno de estrellas. —Saltamos a la cuenta de tres —dijo Amy—. Uno... —¡Tres! —gritó Bruno, y saltó primero. Así llegaron a {mundo}.'
  ];

  var OBJECT_LINES = [
    '{Aliado} le entregó a Bruno {unObjeto}. —Es {objeto} —le explicó—: {poderObjeto}. Te puede servir. Bruno se guardó el regalo en el bolsillo como si fuera un tesoro.',
    'Antes de salir, {aliado2} le dio a Bruno {unObjeto}. —Se llama {objeto} y {poderObjeto}. Te va a hacer falta. Perlita silbó, admirada: —Eso es magia de la buena.',
    'En el piso, entre unas hojas, Bruno encontró {unObjeto}. Perlita dio un saltito en el aire: —¡Es {objeto}! Dicen que {poderObjeto}. ¡No es casualidad que haya aparecido justo ahora!'
  ];

  // Justo antes de cada decisión: Amy y Perlita opinan, pero el que decide es Bruno.
  var HUDDLES = [
    'Amy ya tenía el martillo en alto, lista para cualquier cosa. Perlita, en cambio, se mordía el labio, pensando. Las dos miraron a Bruno: cuando había que decidir, la última palabra era de Bruno.',
    '—Yo voto por algo con martillo —dijo Amy. —Yo voto por algo con cuidado —dijo Perlita. Bruno se rió: entre las dos ideas siempre había un camino, y encontrarlo era la especialidad de Bruno.',
    'Bruno cerró los ojos un segundo para pensar. Amy y Perlita se quedaron calladitas, porque sabían que cuando Bruno pensaba así, algo bueno estaba por salir.',
    'Perlita le susurró a Bruno: —Mis perlas brillan más cuando confiás en vos. Amy le apoyó una mano en el hombro: —Lo que decidas, Bruno, estamos con vos.',
    '—Bruno, ¿plan? —preguntó Amy, dando saltitos de impaciencia. Perlita sacó su libreta para anotar la idea, fuera cual fuera. Bruno miró a su alrededor y empezó a pensar.',
    'Bruno respiró hondo. Sintió la mano de Amy de un lado y el brillo tibio de Perlita del otro. Con un equipo así, pensó Bruno, no había problema sin solución.',
    'Perlita hizo girar una perla entre los dedos, nerviosa. Amy apretó el martillo. Y Bruno, el más tranquilo de los tres, dijo: —Tengo algunas ideas. A ver cuál nos sirve.',
    '—Esto es justo para vos, Bruno —dijo Perlita. Amy asintió con tanta fuerza que casi se le cae el martillo: —Vos pensás, Bruno, y yo te sigo.'
  ];

  var PROMPTS = ['¿Qué hace Bruno?', '¿Qué decidís, Bruno?', 'Bruno tiene que elegir...', '¿Cuál es tu plan, Bruno?', 'Te toca, Bruno: ¿qué hacés?'];

  var BANTER = [
    '—¿Sabían que en el multiverso hay un mundo donde llueven medialunas? —dijo Perlita mientras caminaban. —¿Y por qué no vamos ahí? —preguntó Amy. —Porque las medialunas te persiguen para que te las comas. Es agotador. Bruno se rió tanto que tuvo que pararse a respirar.',
    'Amy caminaba adelante, revoleando el martillo. —Si aparece algo raro, yo primero —dijo. —Amy, la última vez que dijiste eso le diste un martillazo a un buzón —le recordó Perlita. —¡Parecía un robot! Bruno no dijo nada, pero sonrió: le encantaba su equipo.',
    'Perlita contaba sus perlas en voz baja: —Roja, azul, dorada, turquesa... y la de emergencia, que no hay que usar nunca. —¿Y qué hace la de emergencia? —preguntó Bruno. —No sé —dijo Perlita—. Por eso no hay que usarla nunca.',
    '—Bruno, ¿vos tenés miedo alguna vez? —preguntó Amy de repente. Bruno lo pensó. —Sí. Pero el miedo es como un perro que ladra: si lo mirás de frente, se calla un poco. Amy se quedó pensando en eso un largo rato y después dijo: —Voy a usar esa frase.',
    'En el camino, Perlita le enseñó a Bruno a escuchar las perlas: cada una sonaba distinto si la acercabas a la oreja. La dorada sonaba a cascabel, la violeta a lluvia y la verde a grillos de noche. —Cuando sea grande quiero ser guardián de perlas —dijo Bruno. —Ya sos un poco —le respondió Perlita.',
    'Amy practicaba golpes de martillo contra el aire: ¡fum, fum, fum! —Así —le explicó a Bruno—: con las dos manos, firme, y mirando siempre lo que querés proteger, no lo que querés romper. Bruno pensó que era el mejor consejo que le habían dado en toda la semana.',
    'Perlita flotaba al lado de Bruno haciendo preguntas sin parar: —¿En tu mundo hay escuela? ¿Y recreo? ¿Y alfajores? ¿Qué es un alfajor? Bruno le prometió que, al terminar la misión, le iba a convidar uno. Perlita anotó la promesa en una servilleta, por las dudas.',
    '{Aliado} le preguntó a Amy de dónde había sacado un martillo tan grande. —Es un secreto —dijo Amy—. Pero te cuento algo: no pesa nada cuando lo usás para defender a un amigo. Bruno sabía que era verdad: la había visto levantarlo como si fuera una pluma.',
    '—Dato del multiverso número cuarenta y siete —anunció Perlita—: en algún mundo, los gatos son los que sacan a pasear a las personas. —¿Y quién junta lo que hacen las personas en la vereda? —preguntó Bruno. Amy se tentó tanto que se le cayó el martillo.'
  ];

  var TRAVEL = [
    'Caminaron un largo rato por {lugar2}. Bruno iba mirando todo: cada piedra, cada sombra, cada ruidito. Un buen explorador, pensaba, es el que se da cuenta de las cosas que los demás no ven.',
    'El camino hacia {lugar2} subía y bajaba como una montaña rusa. {Aliado} iba adelante mostrando el camino y contando historias de {mundo} que hacían reír a todos.',
    'Para llegar a {lugar2} tuvieron que cruzar un arroyo saltando de piedra en piedra. Perlita, que flotaba, no tenía ese problema, y les iba avisando cuáles piedras estaban flojas.',
    'Pararon a descansar a la sombra de un árbol y compartieron lo que tenían en los bolsillos: dos caramelos, una galletita un poco rota y medio alfajor. Bruno repartió todo en partes iguales, y supo mejor que un banquete.',
    'Mientras avanzaban hacia {lugar2}, Bruno armaba el plan en su cabeza como cuando arma un rompecabezas: primero los bordes, después el centro. Amy lo miraba de reojo: cuando Bruno ponía esa cara, algo bueno se le estaba ocurriendo.'
  ];

  var TWISTS = [
    'Justo cuando estaban por llegar, Perlita frenó en seco: una de sus perlas se había puesto gris. —Esto quiere decir que {villano} está usando una perla robada —dijo—. Hay que apurarse, pero sin hacer locuras. Bruno apretó {objeto} en la mano y asintió.',
    'En ese momento, {objeto} empezó a vibrar en el bolsillo de Bruno y, de golpe, en el aire apareció un dibujo hecho de luz: ¡un mapa del escondite de {villano}, con una entrada secreta marcada con una cruz!',
    'Entonces pasó algo inesperado: {extra} llegó corriendo, sin aire. —¡Esperen! ¡Descubrí algo! {Villano} puso una alarma que suena si alguien entra por la puerta principal. Bruno sonrió: —Entonces no vamos a entrar por la puerta principal.',
    'Amy se detuvo de golpe y se puso colorada. —Tengo que confesar algo —dijo—: tengo un poquito de miedo. Bruno le apretó la mano: —Yo también. Pero lo tenemos juntos. Perlita se sumó al apretón y, de pronto, el miedo se achicó hasta caber en un bolsillo.',
    'Perlita encontró en el piso una pluma, una tuerca y un caramelo. —Pistas —dijo, como una detective—. {Villano} pasó por acá hace muy poco. Y por el caramelo, diría que tiene hambre. Bruno se guardó el caramelo: quizás le iba a servir.',
    'De repente se hizo de noche en un segundo, como si alguien hubiera apagado el cielo. Perlita levantó su perla más brillante como una linterna. —Es un truco de {villano} para asustarnos —dijo Bruno—. Y no nos vamos a asustar. Amy hizo girar el martillo: —Para nada. Para nada de nada.',
    'Antes de seguir, {aliado} llevó a Bruno a un costado. —Escuchame —le dijo—: pase lo que pase, ya hiciste más de lo que cualquiera hubiera hecho. Bruno sintió algo calentito en el pecho, como cuando su familia lo abraza, y siguió adelante con más fuerza.',
    'Un pajarito mensajero aterrizó en el hombro de Bruno con una nota atada a la pata: «Sé que vienen. Los espero. Firma: {villano}». Amy frunció el ceño. Perlita tragó saliva. Bruno dobló la nota y dijo: —Bueno. Por lo menos sabemos que nos tiene en cuenta.'
  ];

  var CELEBRATIONS = [
    'Esa noche hubo una fiesta enorme. {Aliado} y {aliado2} bailaron con Amy, {extra} preparó algo riquísimo y Perlita hizo fuegos artificiales con perlas de colores que dibujaron en el cielo la cara de Bruno.',
    'Todos rodearon a Bruno para darle las gracias. {Aliado} le dio un abrazo, {aliado2} le chocó los cinco y {extra} le regaló un recuerdo para que nunca se olvidara de {mundo}.',
    'Para festejar armaron un picnic gigante en {lugar}. Hubo juegos, risas y un brindis con jugo de naranja. —¡Por Bruno! —gritó {aliado}. —¡Por el equipo! —corrigió Bruno, y todos levantaron los vasos.',
    '{Aliado} se subió a un cajón y anunció a los cuatro vientos: —¡Bruno es, desde hoy, ciudadano de honor de {mundo}! Todos aplaudieron y Bruno se puso colorado como un tomate. Un tomate muy contento, eso sí.'
  ];

  var RETURNS = [
    'Cuando llegó la hora de volver, Perlita sacó la perla {colorPerla}. Bruno saludó a todos con la mano y, en un parpadeo, estaba otra vez en su casa, como si no hubiera pasado el tiempo. Afuera todo seguía igual. Pero él sabía que había salvado un mundo.',
    'La perla {colorPerla} los llevó de vuelta. Bruno apareció en su cuarto con el pelo despeinado y una sonrisa que no le cabía en la cara. Amy le guiñó un ojo y Perlita le dijo bajito: —Hasta la próxima, héroe.',
    'Volvieron por el mismo portal por el que habían llegado. Antes de despedirse, Perlita le dejó a Bruno una perla chiquita en la mano: —Para cuando quieras volver. Bruno la guardó en su cajón de tesoros, al lado de sus figuritas favoritas.'
  ];

  var CLOSINGS = [
    'Y así fue como Bruno, con diez años y un corazón gigante, salvó {mundo}. ¿Y la próxima aventura? Esa la va a elegir Bruno.',
    'Esa noche, ya en la cama, Bruno se quedó mirando el techo. En algún rincón del multiverso, alguien ya contaba la historia del chico de diez años que lo había resuelto todo: la historia de Bruno.',
    'Y colorín colorado, este cuento de Bruno se ha terminado... por ahora. Porque las aventuras siempre vuelven a buscar a Bruno.',
    'Desde ese día, en {mundo} hay una estatua chiquita de un chico de diez años con cara de estar pensando un plan. Abajo dice: «Bruno, el héroe». Y Bruno, cada vez que se acuerda, se ríe.'
  ];

  var MEMORY_LINES = [
    'De regreso, Amy no paraba de contarles a todos la vez que Bruno {m0}.',
    'Mientras volvían, Perlita anotaba en su libreta de aventuras: «Hoy Bruno {m0}». Lo subrayó dos veces.'
  ];
  var MEMORY_LINES_2 = [
    '—¡Y no se olviden de cuando Bruno {m1}! —agregaba Perlita, con los ojos brillantes.',
    '—Y después Bruno {m1} —siguió Amy—. ¡Eso no lo hace cualquiera!'
  ];

  var LESSONS = {
    valentia: [
      '—¿Sabés qué fue lo más valiente que hiciste? —le preguntó Amy antes de despedirse—. No fue no tener miedo. Fue tenerlo y animarte igual. Bruno guardó esas palabras como quien guarda una piedra brillante en el bolsillo.',
      'Perlita le dio a Bruno una perla nueva, rojo fuego. —Es la Perla del Coraje —le dijo—. Solo aparece cuando alguien se anima a hacer lo correcto aunque le tiemblen las piernas. Hoy apareció por vos.'
    ],
    amistad: [
      '{Aliado} le dio un abrazo fuerte: —Llegaste como visitante y te vas como amigo. Y los amigos de verdad siempre vuelven. Bruno sonrió: sabía que tenía razón.',
      'Mientras guardaba sus perlas, Perlita le contó a Bruno que cada amigo nuevo hace brillar una perla un poquito más. Esa noche, la bolsita de Perlita brillaba como nunca: Bruno había hecho muchos amigos.'
    ],
    ingenio: [
      'Amy le dio un golpecito suave en la frente: —Este es tu martillo, Bruno. El más poderoso de todos. Bruno se rió, pero entendió: pensar bien también es una forma de ser fuerte.',
      '{Aliado} le dijo: —Otros habrían usado la fuerza. Vos usaste la cabeza. Y una cabeza bien usada abre más puertas que cualquier llave.'
    ],
    honestidad: [
      'Perlita le mostró que la perla más brillante de su bolsita era transparente como el agua. —Es la Perla de la Verdad —dijo—. Brilla cuando alguien dice la verdad aunque sea difícil. Hoy brilló por vos.',
      '{Aliado} le dijo: —Decir la verdad a veces cuesta, pero mirá todo lo que lograste con ella. Bruno pensó que era cierto: la verdad le había abierto puertas que ningún truco habría abierto.'
    ],
    equipo: [
      'Mientras volvían, Bruno se dio cuenta de algo: ninguno lo podría haber logrado solo. Ni Amy con su martillo, ni Perlita con sus perlas, ni él con sus ideas. Juntos, en cambio, eran imparables.',
      'Amy levantó el martillo, Perlita una perla y Bruno la mano, y los tres los juntaron en el medio. —¡Equipo Multiverso! —gritaron. Ninguno lo dijo, pero los tres pensaron lo mismo: lo mejor de la aventura había sido vivirla juntos.'
    ]
  };

  var CHAPTER_TITLES = [
    ['El llamado de las perlas', 'Una misión para Bruno', 'Rumbo a {mundo}'],
    ['La primera prueba', 'Problemas en el camino', 'Un camino con sorpresas'],
    ['Lo que nadie esperaba', 'Cara a cara con {villano}', 'El escondite de {villano}'],
    ['El gran final', 'Misión cumplida', 'De vuelta a casa']
  ];

  /* ---------- Multiverso ---------- */
  var MULTIVERSE = {
    portals: [
      'Pero había más: mientras escapaba, {villano} chocó contra la bolsita de Perlita y abrió sin querer un portal hacia {mundoB}. Ahora los dos mundos estaban mezclados: en {lugar} aparecían cosas de {mundoB} y, para colmo, {villano} se había hecho socio de {villanoB}. De pronto, {aliadoB} cayó del cielo justo al lado de Bruno. —¿Dónde estoy? —preguntó, mareado—. Bueno, no importa: ¡yo también ayudo!',
      'De golpe, el cielo se rajó como una cáscara de huevo y por la grieta empezó a asomar {mundoB}. —¡Un multiverso cruzado! —exclamó Perlita, sacando una lupa—. {Villano} escapó para allá y se juntó con {villanoB}. Por la grieta asomó la cabeza {aliadoB}: —¡Hola! ¿Ustedes también están buscando a esos dos?',
      'Perlita sacó una perla que nunca había usado, de dos colores mezclados. —Esta abre un multiverso —explicó—: dos mundos en uno. {Villano} se escondió en {mundoB} con la ayuda de {villanoB}, y solo podemos seguirlo si unimos los dos mundos. Sopló y, de repente, frente a Bruno estaba {aliadoB}, al lado de {aliado}, los dos con cara de no entender nada.'
    ],
    crossovers: [
      '{AliadoB} y {aliado} se miraron de arriba abajo. —Nunca vi a nadie como vos —dijeron al mismo tiempo, y se largaron a reír. Perlita anotó: «Los mundos se llevan bien».',
      'Cada tanto, el piso cambiaba: un paso era de {mundo} y el siguiente de {mundoB}. Bruno aprendió a caminar mirando bien dónde pisaba, y {aliadoB} lo imitaba, divertido.',
      '{AliadoB} le preguntó a Bruno cómo era su mundo. —Normal —dijo Bruno—. Hay escuela, hay plaza, hay milanesas. —¿Qué es una milanesa? —preguntaron {aliadoB} y {aliado} a la vez. Bruno prometió explicarles cuando terminara la misión.',
      'Perlita revisó la perla de dos colores: titilaba cada vez más rápido. —Bruno, tenemos que cerrar el portal antes de que los mundos se peguen para siempre —avisó. {AliadoB} tragó saliva y Amy apretó el martillo.'
    ],
    closings: [
      'Al ver que su socio se había rendido, {villanoB} también se dio por vencido y prometió portarse mejor, por lo menos hasta el martes. Perlita juntó las perlas, sopló sobre ellas y el portal doble se cerró con un ¡plop! suave. {AliadoB} saludó desde el otro lado: —¡Vuelvan cuando quieran!',
      '{VillanoB}, que se había quedado solo, levantó las manos: —Está bien, está bien, me vuelvo a mi mundo. Perlita cerró el multiverso con un nudo de luz, y cada cosa volvió a su lugar. Antes de irse, {aliadoB} abrazó a Bruno: —Fue el mejor lío de mi vida.'
    ]
  };

  /* ---------- Desafíos genéricos (cualquier mundo) ---------- */
  var GENERIC_CHALLENGES = [
    {
      id: 'g-puerta',
      situation: 'De pronto apareció una puerta enorme en el medio de {lugar2}, sin ninguna pared alrededor, con una cerradura en forma de sonrisa. Una voz salió de la cerradura: —Solo pasa quien responda: ¿qué tiene dientes pero no muerde? {Aliado} se rascó la cabeza. Amy levantó el martillo: —¿Y si la abrimos a la fuerza?',
      options: [
        { emoji: '🧠', label: 'Pensar la respuesta', trait: 'ingenio',
          outcome: 'Bruno pensó en voz alta: «Dientes... no muerde... ¿un serrucho? ¿Un ajo?». Y de pronto se acordó de algo que usaba todas las mañanas. —¡El peine! —dijo. La cerradura se rió con ganas: —¡Correcto! Y la puerta se abrió con un rechinido alegre.',
          memory: 'resolvió el acertijo de la puerta sonriente' },
        { emoji: '🙋', label: 'Admitir que no sabe y pedir una pista', trait: 'honestidad',
          outcome: 'Bruno dijo la verdad: —No sé la respuesta. ¿Me das una pista? La cerradura se quedó sorprendida: nadie se lo había pedido nunca. —Te la pasás por la cabeza todas las mañanas. —¡El peine! —gritaron Bruno y Perlita juntos. La puerta se abrió, contenta de que alguien hubiera sido sincero.',
          memory: 'pidió una pista con sinceridad a una puerta que hablaba' },
        { emoji: '🤝', label: 'Pensarla en equipo', trait: 'equipo',
          outcome: 'Bruno juntó a todos en ronda: —Cada uno dice algo que tenga dientes. {Aliado} dijo «un tiburón», Amy dijo «un cierre» y Perlita dijo «un peine». —¡Eso! —saltó Bruno—. El peine tiene dientes y no muerde. La puerta se abrió y todos se chocaron los cinco.',
          memory: 'resolvió un acertijo en equipo' }
      ]
    },
    {
      id: 'g-precipicio',
      situation: 'El camino se cortaba de golpe en un precipicio, y del otro lado se veía {lugar2}. No había puente, ni soga, ni nada. Abajo, muy abajo, corría un río que sonaba como una risa lejana. Perlita miró a Bruno: —Me parece que llegó el momento de usar {objeto}.',
      options: [
        { emoji: '✨', label: 'Usar {objeto}', trait: 'ingenio',
          outcome: 'Bruno sacó {objeto} y se acordó de su poder: {poderObjeto}. {UsoObjeto} —¡Sabía que iba a servir! —dijo Perlita, aplaudiendo.',
          memory: 'usó {objeto} para cruzar un precipicio' },
        { emoji: '🔭', label: 'Explorar el borde y buscar un paso', trait: 'valentia',
          outcome: 'Bruno se animó a caminar por el borde, despacito y sin mirar para abajo, hasta que encontró un tronco gigante caído de lado a lado. Lo cruzó primero, para probar que era firme, y después guió a los demás. Amy le dijo: —Eso fue muy valiente. Y yo de valientes sé.',
          memory: 'encontró un paso secreto al borde de un precipicio' },
        { emoji: '🤝', label: 'Armar un puente entre todos', trait: 'equipo',
          outcome: 'Bruno propuso juntar todo lo que tuvieran: ramas, sogas, el martillo de Amy y hasta la cinta del pelo de Perlita. {Aliado} sostenía, Amy martillaba, Perlita ataba y Bruno dirigía. En diez minutos tenían un puentecito que crujía un poco pero aguantaba, y cruzaron uno por uno.',
          memory: 'construyó un puente con todo el equipo' }
      ]
    },
    {
      id: 'g-pompon',
      situation: 'En {lugar2} encontraron una criatura chiquita, peluda y redonda como un pompón, que lloraba sentada en una piedra. —Me perdí —sollozó—, y nadie me ayuda porque todos están apurados. Amy miró a Bruno: ellos también estaban apurados. Muy apurados.',
      options: [
        { emoji: '💛', label: 'Ayudarla aunque estén apurados', trait: 'amistad',
          outcome: 'Bruno se agachó: —Nosotros te ayudamos. Le preguntaron cómo era su casa (redonda, con una puerta amarilla) y la acompañaron hasta allá. La mamá pompón, agradecida, les regaló una semilla luminosa que alumbraba como una lamparita, ideal para los caminos oscuros.',
          memory: 'ayudó a un pompón perdido aunque estaba apurado' },
        { emoji: '🗺️', label: 'Dibujarle un mapa para volver', trait: 'ingenio',
          outcome: 'Bruno le preguntó qué había cerca de su casa: un árbol con forma de jirafa y un arroyo que cantaba. Con un palito dibujó en la tierra un mapa con todos esos lugares, y el pompón, feliz, se lo aprendió de memoria. Antes de irse rodando, le contó a Bruno un atajo que solo conocen los pompones.',
          memory: 'le dibujó un mapa a un pompón perdido' },
        { emoji: '🧑‍🤝‍🧑', label: 'Pedirle a {aliado} que la acompañe', trait: 'equipo',
          outcome: 'Bruno pensó que podían repartirse las tareas: {aliado} conocía muy bien {mundo} y podía acompañar al pompón, mientras los demás seguían con la misión. {Aliado} aceptó encantado. Más tarde volvió con una sorpresa: la familia del pompón les mandaba caramelos que daban energía.',
          memory: 'organizó al equipo para ayudar a un pompón perdido' }
      ]
    },
    {
      id: 'g-burbujas',
      situation: 'Un viento loco empezó a soplar en {lugar2} y con él llegó una nube de burbujas gigantes. Cada burbuja que tocaba a alguien lo levantaba por el aire. ¡{Aliado} ya estaba flotando a dos metros del piso, pataleando!',
      options: [
        { emoji: '🦁', label: 'Saltar a rescatar a {aliado}', trait: 'valentia',
          outcome: 'Bruno no lo dudó: trepó a una roca, saltó y agarró a {aliado} del zapato. La burbuja no podía con los dos y empezó a bajar despacito hasta que, ¡plop!, reventó y cayeron sobre el pasto blandito. —Gracias, Bruno —dijo {aliado}, con la cara llena de espuma.',
          memory: 'rescató a {aliado} de una burbuja voladora' },
        { emoji: '🔨', label: 'Reventar burbujas con Amy', trait: 'equipo',
          outcome: 'Bruno le gritó a Amy: —¡Yo te digo cuáles, vos las reventás! Bruno señalaba y Amy saltaba: ¡plop!, ¡plop!, ¡plop! En un minuto no quedaba ni una burbuja, y {aliado} bajó despacito, como una pluma.',
          memory: 'reventó burbujas gigantes junto con Amy' },
        { emoji: '🍃', label: 'Buscar dónde no llega el viento', trait: 'ingenio',
          outcome: 'Bruno vio que las burbujas seguían al viento, y que detrás de una roca grande el viento no llegaba. —¡Todos atrás de la roca! —gritó. Perlita tiró de {aliado} con un collar de perlas y lo bajó. Esperaron ahí, apretados y riéndose, hasta que el viento se fue con todas las burbujas.',
          memory: 'protegió a todos de un viento de burbujas' }
      ]
    }
  ];

  var GENERIC_CLIMAXES = [
    {
      id: 'g-portal-falso',
      situation: 'Por fin encontraron a {villano}, a punto de escapar con {meta} por un portal que había fabricado con una perla falsa. El portal hacía ruido de licuadora y titilaba de colores raros. —¡Llegaron tarde! —se rió {villano}—. ¡Me voy a un mundo donde nadie me encuentre!',
      options: [
        { emoji: '💡', label: 'Cambiar la perla falsa por una de verdad', trait: 'ingenio',
          outcome: 'Bruno vio que el portal titilaba porque la perla falsa estaba rajada. —Perlita, ¿tenés una perla que lleve... de vuelta acá mismo? Perlita sonrió: claro que tenía. En un descuido, Bruno cambió una perla por la otra, y cuando {villano} saltó al portal... ¡apareció otra vez al lado de Bruno! Mareado y confundido, terminó entregando {meta}.' },
        { emoji: '🛡️', label: 'Rodear el portal con todo el equipo', trait: 'equipo',
          outcome: 'Bruno hizo una seña y todos se pusieron alrededor del portal: Amy de un lado, {aliado} del otro, Perlita arriba y él adelante. —No hay salida —le dijo Bruno a {villano}—. Pero podemos hablar. {Villano}, rodeado, bajó los hombros y entregó {meta}. El portal falso se apagó con un último ruido de licuadora.' },
        { emoji: '🗣️', label: 'Avisarle la verdad: ese portal está roto', trait: 'honestidad',
          outcome: 'Bruno le dijo la verdad: —Ese portal está roto. Si saltás, vas a terminar en cualquier lado, solo y lejos de todos. {Villano} miró el portal, que sonaba cada vez peor, y dudó. —¿Por qué me avisás? —Porque aunque hiciste algo mal, no quiero que te pase nada. {Villano} se quedó callado un rato largo y le entregó {meta}.' }
      ]
    }
  ];

  /* ---------- Mundos ---------- */
  var WORLDS = [
    {
      id: 'hongos',
      name: 'el Reino Champiñón',
      short: 'Reino Champiñón',
      emoji: '🍄',
      tagline: 'Mario y Luigi, tubos verdes y bloques sorpresa',
      colors: ['#ff5d5d', '#ffb347'],
      hosts: ['Mario', 'Luigi'],
      extras: ['Toad', 'la Princesa Peach', 'Yoshi'],
      villain: 'Bowser',
      places: ['las Colinas de Bloques Sorpresa', 'el Bosque de Tubos Verdes', 'el Puente de las Nubes Esponjosas', 'el Castillo de la Princesa'],
      flavor: [
        'Había hongos tan grandes como edificios, tubos verdes que salían del pasto como plantas y bloques flotando en el aire con signos de pregunta. Todo olía a pasto recién cortado y a aventura.',
        'El cielo era azul de dibujito, con nubes que sonreían, y a lo lejos se veía un castillo con banderas rojas. Cada vez que alguien saltaba sonaba un ¡boing! que daba ganas de saltar de nuevo.'
      ],
      missions: [
        { id: 'estrella', title: 'El misterio de la Estrella Saltarina', meta: 'la Estrella Saltarina',
          setup: 'Mario y Luigi los recibieron con caras largas. —Nadie puede saltar —explicó Mario, intentando dar un brinco que no lo levantó ni un centímetro—. Bowser se llevó la Estrella Saltarina, la que le da el ¡boing! a todo el reino. Sin ella no podemos subir a los tubos ni cruzar los puentes. Luigi miró a Bruno con esperanza: —Perlita dice que sos el mejor resolviendo problemas. ¿Nos ayudás?',
          resolution: 'La Estrella Saltarina volvió al cielo del reino y, en un segundo, todos empezaron a saltar: Toad, la Princesa Peach, Yoshi y hasta los hongos más viejitos. ¡Boing, boing, boing!' },
        { id: 'chispa', title: 'El gran apagón de los bloques sorpresa', meta: 'la Chispa de las Sorpresas',
          setup: 'Los bloques con signo de pregunta estaban grises y apagados. —Les pegamos y no sale nada —dijo Luigi, frotándose la cabeza—. Ni una moneda, ni un hongo, nada. Mario señaló el horizonte: —Bowser construyó una aspiradora gigante y se chupó la Chispa de las Sorpresas. Bruno, necesitamos tu cabeza... pero para pensar, no para golpear bloques.',
          resolution: 'La Chispa de las Sorpresas volvió a los bloques, que se encendieron uno por uno como luces de Navidad. Cuando Bruno golpeó el primero, salió una lluvia de monedas que sonó como una canción.' },
        { id: 'copa', title: 'La Copa Champiñón perdida', meta: 'la Copa Champiñón',
          setup: 'Era el día de la gran carrera del reino, pero la Copa Champiñón había desaparecido del podio. En su lugar había una nota con letra garabateada: «Si quieren la copa, vengan a buscarla. Firma: B.» —B de Bowser —suspiró Mario—. Siempre firma igual. Luigi le pasó a Bruno un casco: —Sin copa no hay carrera, y sin carrera el reino se pone muy triste.',
          resolution: 'La Copa Champiñón volvió al podio justo a tiempo. La carrera fue la más divertida de la historia, y Bruno, Amy y Perlita la miraron desde el palco de honor, gritando como locos en cada curva.' },
        { id: 'campana', title: 'El Hongo Abuelo que no quería despertar', meta: 'la Campana del Amanecer',
          setup: 'En el centro del reino vivía el Hongo Abuelo, tan grande que su sombrero daba sombra a todo el pueblo. Pero se había quedado dormido y, mientras dormía, se iba achicando. —Solo la Campana del Amanecer puede despertarlo —dijo Luigi—, y Bowser se la llevó porque el ruido no lo dejaba dormir la siesta. Mario se acomodó la gorra: —Bruno, si no la recuperamos, el pueblo se queda sin techo.',
          resolution: 'La Campana del Amanecer sonó ¡talán, talán! y el Hongo Abuelo abrió un ojo, después el otro, y se estiró hasta volver a su tamaño de siempre. —¿Me perdí de algo? —bostezó. Todos se rieron.' }
      ],
      challenges: [
        { id: 'h-tubo',
          situation: 'El camino terminaba en un tubo verde enorme. El problema: el tubo estaba resfriado. Cada tanto hacía ¡ACHÚS! y escupía para afuera todo lo que entraba, incluso a un Toad que salió volando y aterrizó en un arbusto. —Por ahí se llega más rápido —dijo Mario—, pero así no hay forma. Todos miraron a Bruno.',
          options: [
            { emoji: '💨', label: 'Entrar justo después de un estornudo', trait: 'valentia',
              outcome: 'Bruno contó los segundos entre estornudo y estornudo: siete. —¡Ahora! —gritó, y se tiró de cabeza al tubo apenas sonó el ¡ACHÚS! Amy saltó detrás, y Perlita detrás de Amy. Bajaron por el tubo como por un tobogán y salieron del otro lado antes del siguiente estornudo. Desde afuera, Mario aplaudía con las dos manos.',
              memory: 'se tiró de cabeza a un tubo resfriado' },
            { emoji: '🍵', label: 'Curarle el resfrío al tubo', trait: 'amistad',
              outcome: 'Bruno pensó que, si él estuviera resfriado, querría un tecito. Le pidió a Luigi agua caliente y a la Princesa Peach unas hojas de menta de su jardín, y entre todos le dieron al tubo un té gigante. El tubo hizo glu, glu, suspiró aliviado y dejó de estornudar. —Gracias, chico —dijo con voz de cañería—. Pasen, pasen.',
              memory: 'le preparó un té gigante a un tubo resfriado' },
            { emoji: '🚀', label: 'Usar el estornudo como cañón', trait: 'ingenio',
              outcome: 'A Bruno se le ocurrió algo loco: —¿Y si en vez de entrar usamos el estornudo como cañón? Se pararon los tres en la boca del tubo, agarrados de las manos, y cuando llegó el ¡ACHÚS! salieron disparados por arriba del bosque hasta aterrizar justo donde querían ir. Perlita, despeinada, dijo: —Fue el viaje más rápido de mi vida.',
              memory: 'convirtió un estornudo en un cañón' }
          ] },
        { id: 'h-puente',
          situation: 'Para seguir había que cruzar el Puente de las Nubes Esponjosas, hecho de bloques que aparecían y desaparecían. ¡Pum!, había bloque; ¡pum!, no había más. Abajo se veía un colchón de nubes, pero nadie quería averiguar si era blandito. —Yo lo cruzo corriendo —dijo Amy, que siempre quería cruzar todo corriendo.',
          options: [
            { emoji: '🔍', label: 'Descubrir el patrón de los bloques', trait: 'ingenio',
              outcome: 'Bruno se sentó a mirar. Rojo, azul, rojo, azul... ¡los bloques desaparecían en orden! —Los rojos duran tres segundos y los azules cinco —anunció—. Pisamos solo los azules. Perlita anotó todo en una servilleta y cruzaron sin un solo resbalón. Luigi, que les tenía miedo a las alturas, cruzó con los ojos cerrados siguiendo la voz de Bruno.',
              memory: 'descubrió el secreto del puente de bloques' },
            { emoji: '🤝', label: 'Cruzar todos juntos de la mano', trait: 'equipo',
              outcome: 'Bruno propuso armar una cadena: Mario adelante, porque saltaba mejor; Amy atrás, porque era la más fuerte; y él en el medio, guiando. Cada vez que un bloque desaparecía, la cadena se sostenía igual. Así, saltito a saltito, llegaron al otro lado sin que nadie se cayera.',
              memory: 'armó una cadena de manos para cruzar el puente' },
            { emoji: '🦖', label: 'Llamar a Yoshi para que los cruce', trait: 'amistad',
              outcome: 'Bruno se acordó de que Yoshi tenía un salto larguísimo. Silbó con todas sus fuerzas y Yoshi llegó corriendo, contento de que alguien lo necesitara. Uno por uno los cruzó de un salto, con patadita en el aire incluida. —Te debo una fruta enorme —le dijo Bruno, y Yoshi le dio un lengüetazo de la emoción.',
              memory: 'cruzó el puente en el lomo de Yoshi' }
          ] },
        { id: 'h-goombas',
          situation: 'En el bosque les cerró el paso un montón de Goombas, esos honguitos marrones de ceño fruncido. Estaban todos amontonados, mirando para cualquier lado y chocándose entre ellos. —Cuidado —susurró Mario—, son de la banda de Bowser. Pero Bruno notó algo: el Goomba más chiquito tenía los ojos llenos de lágrimas.',
          options: [
            { emoji: '💬', label: 'Preguntarles qué les pasa', trait: 'amistad',
              outcome: 'Bruno se acercó despacito y preguntó: —¿Están bien? El Goomba más chiquito se largó a llorar: Bowser los había mandado a vigilar, pero se habían perdido y extrañaban su casa. Bruno, con ayuda de Perlita y una perla que alumbraba, les mostró el camino de vuelta. Antes de irse, los Goombas les contaron un atajo secreto.',
              memory: 'ayudó a unos Goombas perdidos a volver a casa' },
            { emoji: '🦘', label: 'Saltar por arriba de todos', trait: 'valentia',
              outcome: 'Bruno tomó carrera, pisó una piedra, después un tronco, y saltó por arriba de los Goombas como si fueran charcos. Amy lo siguió dando una vuelta en el aire con martillo y todo. Los Goombas quedaron tan sorprendidos que se sentaron a aplaudir.',
              memory: 'saltó por arriba de una banda de Goombas' },
            { emoji: '🗣️', label: 'Decirles la verdad: vienen a ayudar', trait: 'honestidad',
              outcome: 'Bruno levantó las manos y habló fuerte y claro: —No venimos a pelear. Venimos a arreglar lo que hizo Bowser, que a ustedes también los perjudica. Los Goombas se miraron. Era cierto: sin un reino feliz, ellos tampoco la pasaban bien. Se hicieron a un lado y uno hasta les deseó suerte.',
              memory: 'convenció a los Goombas diciendo la verdad' }
          ] },
        { id: 'h-bloque',
          situation: 'En el medio del camino flotaba un bloque sorpresa gigante, del tamaño de una casa, con un signo de pregunta que titilaba. —Nadie sabe qué tiene adentro —dijo Toad—. Puede ser algo buenísimo... o una trampa de Bowser. Perlita le acercó una perla: brillaba, señal de que adentro había algo importante.',
          options: [
            { emoji: '🔨', label: 'Abrirlo en equipo con Amy y Mario', trait: 'equipo',
              outcome: 'Bruno tuvo una idea: Mario lo subió a sus hombros y desde ahí Bruno marcó el punto exacto donde golpear. Amy hizo girar su martillo tres veces y le dio ¡PAF! justo en el centro. Del bloque salió un hongo dorado que les dio energía a todos y, además, un mapa con los escondites de Bowser.',
              memory: 'abrió el bloque gigante junto a Amy y Mario' },
            { emoji: '👂', label: 'Escuchar el bloque antes de abrirlo', trait: 'ingenio',
              outcome: 'Bruno apoyó la oreja en el bloque. Adentro se oía un ruido de engranajes: ¡era una trampa de Bowser! Buscó con cuidado y encontró una puertita trasera. La trampa era un reloj de juguete que tiraba confites; Bruno lo desarmó, y entre las piezas encontró una llavecita con forma de corona, que guardó por las dudas.',
              memory: 'descubrió que el bloque gigante era una trampa' },
            { emoji: '🙋', label: 'Decir «no sé» y pedir consejo', trait: 'honestidad',
              outcome: 'Bruno fue sincero: —No tengo idea de qué hacer. ¿Alguien sabe algo de bloques gigantes? La Princesa Peach sonrió: los bloques gigantes se abren con una adivinanza. Le dijo una y Bruno, pensando en voz alta con Perlita, la resolvió. El bloque se abrió solo, como un regalo, y Toad gritó: —¡Bien ahí, Bruno!',
              memory: 'se animó a decir «no sé» y pidió consejo' }
          ] }
      ],
      climaxes: [
        { id: 'h-castillo',
          situation: 'Al final llegaron al castillo de Bowser, una fortaleza con forma de caparazón gigante y ventanas que echaban humito. Bowser estaba en la terraza, con {meta} adentro de una jaula de hierro, y se reía tan fuerte que temblaban las tejas. —¡Ja! ¿Un chico de diez años viene a desafiarme? Bruno tragó saliva. Amy apretó el martillo. Perlita le susurró: —Vos decidís, Bruno. Confiamos en vos.',
          options: [
            { emoji: '🦁', label: 'Desafiar a Bowser a una competencia de saltos', trait: 'valentia',
              outcome: 'Bruno dio un paso adelante: —No vengo a pelear. Vengo a desafiarte a una competencia de saltos. Si gano, devolvés {meta}. Bowser, que jamás rechazaba un desafío, aceptó. Saltaron sobre bloques, sobre tubos y sobre nubes. Bowser era fuerte, pero pesado; Bruno era liviano y no se rendía. En el último salto, Bruno tocó la bandera del castillo un segundo antes. Bowser, refunfuñando pero cumpliendo su palabra, abrió la jaula.' },
            { emoji: '💡', label: 'Lograr que Bowser abra la jaula sin darse cuenta', trait: 'ingenio',
              outcome: 'Bruno vio que la jaula tenía una cerradura con forma de corona. —Bowser —dijo—, apuesto a que no sos capaz de abrir esa jaula con los ojos cerrados. —¡Claro que soy capaz! —rugió Bowser, y para demostrarlo cerró los ojos y abrió la cerradura... ¡clic! En ese instante, Bruno y Perlita sacaron {meta} y Amy dejó en su lugar un ananá. Cuando Bowser abrió los ojos, se quedó mirando el ananá sin entender nada.' },
            { emoji: '💛', label: 'Preguntarle a Bowser por qué lo hizo', trait: 'amistad',
              outcome: 'Bruno respiró hondo y preguntó: —¿Por qué lo hiciste? Bowser se quedó callado. Nadie le había preguntado eso nunca. —Porque... nunca me invitan a nada —gruñó al final—. Siempre soy el malo. Bruno pensó un momento y le propuso algo: devolver {meta} y, a cambio, ser invitado especial en la próxima fiesta del reino. Bowser abrió la jaula y, por primera vez en años, sonrió sin querer asustar a nadie.' }
          ] },
        { id: 'h-bowsertron',
          situation: 'En la cima de la montaña, Bowser los esperaba arriba de una máquina enorme llena de tuercas, palancas y lucecitas: el Bowsertrón. En el centro de la máquina, como si fuera una pila, brillaba {meta}. —¡Con esto voy a ser el rey de todo! —rugió Bowser, y la máquina empezó a caminar como un robot gigante, haciendo temblar el piso. Mario y Luigi miraron a Bruno.',
          options: [
            { emoji: '🛡️', label: 'Repartir tareas: cada uno a una pata', trait: 'equipo',
              outcome: 'Bruno organizó al equipo en un segundo: —¡Mario y Luigi, a las patas de la izquierda! ¡Amy, a las de la derecha! ¡Perlita, conmigo arriba! Mientras los demás les hacían cosquillas a las patas con plumas de un nido abandonado, la máquina se tambaleó de la risa (las máquinas de Bowser eran muy cosquillosas). Bruno trepó hasta el centro y sacó {meta} con cuidado. El Bowsertrón se apagó con un suspiro, y Bowser quedó sentado arriba, cruzado de brazos.' },
            { emoji: '🦁', label: 'Trepar hasta el centro de la máquina', trait: 'valentia',
              outcome: 'Bruno no lo pensó dos veces: corrió, se agarró de un caño, trepó por una escalera de tuercas y esquivó una palanca que pasó zumbando. Amy y Perlita le gritaban ánimo desde abajo. Arriba, Bowser se dio vuelta justo cuando Bruno estiraba la mano y... ¡lo logró! Sacó {meta} y la máquina se quedó dura como una estatua. Bowser, por primera vez, miró a Bruno con respeto.' },
            { emoji: '💡', label: 'Buscar el botón de apagado', trait: 'ingenio',
              outcome: 'Bruno pensó: «Toda máquina tiene un botón de apagado». Le pidió a Perlita que iluminara las patas con una perla y ahí estaba: un botoncito rojo con un cartel que decía «NO TOCAR». Mientras Amy distraía a Bowser con un baile ridículo, Bruno se escabulló y apretó el botón. ¡Pfffff! La máquina se desinfló como un globo y {meta} rodó hasta las manos de Bruno.' }
          ] }
      ]
    },
    {
      id: 'veloz',
      name: 'el Mundo Veloz de Sonic',
      short: 'Mundo Veloz',
      emoji: '💨',
      tagline: 'Sonic, Tails, anillos dorados y rulos gigantes',
      colors: ['#2f80ff', '#38e1ff'],
      hosts: ['Sonic', 'Tails'],
      extras: ['Knuckles', 'Cream'],
      villain: 'el Doctor Eggman',
      places: ['la Colina Verde de los Rulos', 'la Fábrica de Robots', 'la Playa de los Anillos', 'el Templo de las Esmeraldas'],
      homeLine: 'Amy respiró hondo y sonrió: —Mi mundo —dijo—. Acá aprendí a usar el martillo. Bruno, vas a ver qué lindo es.',
      flavor: [
        'Era un mundo donde todo iba rápido: las nubes pasaban a toda velocidad, las palmeras se mecían al ritmo de una música invisible y el camino hacía rulos gigantes, como una montaña rusa de pasto.',
        'Había anillos dorados flotando por todas partes, que sonaban ¡tling! cuando los tocabas, y a lo lejos salía humo gris de una fábrica con forma de huevo.'
      ],
      missions: [
        { id: 'anillo', title: 'El robo del Anillo Maestro', meta: 'el Anillo Maestro',
          setup: 'Sonic llegó frenando en seco, con humo en las zapatillas. —¡Qué bueno que vinieron! Eggman se robó el Anillo Maestro, el que hace girar todos los anillos del mundo. Sin él, los anillos se están poniendo opacos y la Colina Verde se quedó sin música. Tails agregó, moviendo sus dos colas: —Yo ya probé todo. Necesitamos un plan nuevo, y Amy dice que vos sos bueno con los planes.',
          resolution: 'El Anillo Maestro volvió a su lugar y todos los anillos del mundo se encendieron a la vez, ¡tling, tling, tling!, como un aplauso dorado. La Colina Verde volvió a tener música.' },
        { id: 'motor', title: 'El día en que Sonic caminó despacio', meta: 'el Motor del Viento',
          setup: 'Algo rarísimo pasaba: Sonic caminaba... ¡despacio! —Eggman inventó un rayo lentificador y se llevó el Motor del Viento, la máquina que le da velocidad a todo el mundo —explicó Tails—. Ahora hasta los conejos caminan en cámara lenta. Sonic suspiró, muy despacito: —Bruuuuno... neceeesitamos... tu ayuuuda.',
          resolution: 'Con el Motor del Viento de vuelta, el mundo recuperó su velocidad de golpe. Sonic dio tres vueltas alrededor de Bruno en un segundo, gritando de alegría, y lo dejó despeinado hasta la hora del baño.' },
        { id: 'llave', title: 'Los animalitos encerrados', meta: 'la Llave de las Cápsulas',
          setup: 'En la Playa de los Anillos ya no había pajaritos, ni ardillas, ni conejos. —Eggman los metió en cápsulas para usarlos como pilas de sus robots —dijo Sonic, enojado—. La única forma de abrirlas es con la Llave de las Cápsulas, y la tiene él. Tails le hizo a Bruno un pulgar arriba: —Con tu cabeza y nuestra velocidad, no podemos perder.',
          resolution: 'Bruno giró la Llave de las Cápsulas y, una por una, las cápsulas se abrieron. Salieron pajaritos, ardillas, conejos y hasta una tortuga que no entendía nada. Todos rodearon a Bruno para darle las gracias.' },
        { id: 'esmeralda', title: 'La esmeralda que desapareció', meta: 'la Esmeralda Gigante',
          setup: 'Knuckles, el guardián de la Esmeralda Gigante, estaba sentado en una piedra, muy triste. —Me quedé dormido un segundito —confesó— y cuando me desperté, la Esmeralda Gigante ya no estaba. Fue Eggman, seguro. Sonic le palmeó la espalda: —Tranquilo, Knuckles. Trajimos refuerzos. Y le guiñó un ojo a Bruno.',
          resolution: 'La Esmeralda Gigante volvió a su altar y brilló tan fuerte que toda la isla se iluminó de verde. Knuckles, emocionado, le dio a Bruno un abrazo que casi lo deja sin aire.' }
      ],
      challenges: [
        { id: 'v-rulo',
          situation: 'Tenían que pasar por un rulo gigante del camino: una vuelta completa en el aire. Sonic lo hacía sin despeinarse, pero Bruno no tenía zapatillas supersónicas. —Si no vas bien rápido, te quedás a mitad de camino —explicó Tails.',
          options: [
            { emoji: '🏃', label: 'Correr con todas sus fuerzas', trait: 'valentia',
              outcome: 'Bruno retrocedió bien lejos, respiró hondo y salió corriendo como nunca en su vida. Amy corría a su lado gritando «¡Vamos, vamos!». Al llegar al rulo, Sonic les dio un empujoncito desde atrás y ¡zum!, dieron la vuelta completa cabeza abajo. Bruno llegó al otro lado mareado, pero feliz.',
              memory: 'dio la vuelta a un rulo gigante corriendo' },
            { emoji: '✈️', label: 'Pedirle a Tails que los lleve volando', trait: 'amistad',
              outcome: 'Bruno le preguntó a Tails si podía ayudarlos. Tails sonrió, hizo girar sus dos colas como una hélice y levantó a Bruno; Sonic cargó a Perlita y Amy se agarró de la mochila de Bruno. Pasaron por arriba del rulo como un helicóptero de amigos.',
              memory: 'cruzó el rulo volando con Tails' },
            { emoji: '🛹', label: 'Armar una patineta con chatarra', trait: 'ingenio',
              outcome: 'Bruno vio tirados los pedazos de un robot viejo: ruedas, una tabla y un resorte. Con Tails armaron en cinco minutos una patineta con resorte turbo. Bruno se subió, Amy le dio un empujón con el martillo y salió disparado: subió el rulo, dio la vuelta y aterrizó como un campeón.',
              memory: 'armó una patineta turbo con chatarra' }
          ] },
        { id: 'v-robots',
          situation: 'Un batallón de robots de Eggman les cerró el paso. Eran redondos, hacían bip-bip y tenían cara de pocos amigos. —Intrusos detectados —dijo el robot más grande con voz de lata—. Procediendo a... a... error de sistema. Parecían un poco confundidos.',
          options: [
            { emoji: '🔨', label: 'Enfrentarlos con Amy, espalda contra espalda', trait: 'equipo',
              outcome: 'Bruno y Amy se pusieron espalda contra espalda. —Yo te aviso de dónde vienen y vos martillás —dijo Bruno. «¡Izquierda!», ¡PAF!; «¡Arriba!», ¡PAF! En dos minutos los robots estaban desarmados en el piso, y de adentro salieron pajaritos que estaban encerrados como pilas.',
              memory: 'desarmó robots con Amy, espalda contra espalda' },
            { emoji: '🤖', label: 'Hablar con el robot confundido', trait: 'amistad',
              outcome: 'Bruno se acercó al robot grande: —¿Qué te pasa? El robot hizo un bip triste: Eggman le había borrado la memoria y ya no sabía quién era. Bruno le puso un nombre, «Tuerca», y le explicó que podía elegir ser bueno. Tuerca lo pensó dos bips y dio la orden: —Batallón: dejen pasar a mi amigo Bruno.',
              memory: 'se hizo amigo de un robot llamado Tuerca' },
            { emoji: '🔢', label: 'Darles un problema imposible', trait: 'ingenio',
              outcome: 'Bruno levantó la mano: —Antes de atraparnos, resuelvan esto: ¿cuál es el último número que existe? Los robots empezaron a contar: un millón, dos millones, tres millones... Les salía humito de la cabeza. Mientras seguían contando, Bruno, Amy y Perlita pasaron caminando tranquilos entre ellos.',
              memory: 'confundió a un batallón de robots con un acertijo' }
          ] },
        { id: 'v-lago',
          situation: 'Para llegar a la fábrica había que cruzar un lago de agua turquesa. Sonic se puso pálido y le dijo a Bruno, bajito: —Yo... no sé nadar. Nunca se lo conté a nadie. Además, en el agua nadaba un pez-robot de Eggman con dientes de serrucho de juguete.',
          options: [
            { emoji: '🤫', label: 'Cuidar el secreto de Sonic y buscar otro camino', trait: 'amistad',
              outcome: 'Bruno le dijo a Sonic que no tenía nada de qué avergonzarse: todos tenemos algo que no sabemos hacer. Juntos recorrieron la orilla hasta encontrar unas piedras planas que formaban un camino. Cruzaron saltando, y Sonic, agradecido, le dijo: —Gracias por no reírte.',
              memory: 'ayudó a Sonic sin reírse de su miedo al agua' },
            { emoji: '🛶', label: 'Construir una balsa con Tails', trait: 'equipo',
              outcome: 'Bruno dibujó un plan en la arena y Tails lo entendió en un segundo: una balsa de troncos con un motor muy especial, las colas de Tails. Amy ató todo con lianas y Perlita iluminaba con una perla. Cruzaron el lago tan rápido que el pez-robot ni los vio pasar.',
              memory: 'construyó una balsa con motor de colas' },
            { emoji: '🐟', label: 'Engañar al pez-robot con un reflejo', trait: 'ingenio',
              outcome: 'Bruno se dio cuenta de que el pez-robot perseguía cualquier cosa que brillara. Le pidió a Perlita una perla y la usó para hacer rebotar un rayo de sol hacia la otra punta del lago. El pez salió nadando detrás del reflejo y, mientras tanto, ellos cruzaron por un tronco caído.',
              memory: 'engañó a un pez-robot con un reflejo' }
          ] },
        { id: 'v-puerta',
          situation: 'La puerta de la fábrica tenía un candado con contraseña y un cartel: «Solo para Eggman». Knuckles quería romperla de una piña. —Si la rompemos, suena la alarma —avisó Tails.',
          options: [
            { emoji: '🔐', label: 'Adivinar la contraseña', trait: 'ingenio',
              outcome: 'Bruno pensó: «¿Qué es lo que más le gusta a Eggman?». Probó EGGMAN: incorrecto. Probó ROBOT: incorrecto. Entonces notó que todo en la fábrica tenía forma de huevo y escribió HUEVO. ¡Clic! La puerta se abrió en silencio.',
              memory: 'adivinó la contraseña de la fábrica' },
            { emoji: '🔔', label: 'Tocar el timbre y decir la verdad', trait: 'honestidad',
              outcome: 'Bruno tocó el timbre. Una voz metálica preguntó: «¿Quién es?». Y Bruno, en vez de inventar algo, dijo la verdad: —Soy Bruno y vengo a devolver lo que no es de Eggman. Hubo un silencio y la puerta se abrió: era un robotito ayudante, cansado de las travesuras de su jefe. —Pasen —susurró—. Yo no los vi.',
              memory: 'tocó el timbre de la fábrica y dijo la verdad' },
            { emoji: '🦔', label: 'Entrar por el techo con ayuda de Sonic', trait: 'valentia',
              outcome: 'Bruno miró para arriba: había una ventana abierta en el techo. —Sonic, ¿me impulsás hasta allá? Sonic lo levantó, giró como un trompo y lo lanzó hacia arriba. Bruno se agarró del borde, entró y abrió la puerta desde adentro. Amy le chocó los cinco al pasar.',
              memory: 'entró a la fábrica por el techo' }
          ] }
      ],
      climaxes: [
        { id: 'v-nave',
          situation: 'En el corazón de la fábrica, el Doctor Eggman los esperaba arriba de su nave flotante, con {meta} adentro de un frasco de vidrio gigante. Se retorcía el bigote, encantado. —¡Bienvenidos a mi fábrica! Lástima que no van a salir hasta que yo quiera. De la nave se desplegaron unos brazos mecánicos. Sonic se preparó para correr, pero miró a Bruno: esta vez el plan lo tenía él.',
          options: [
            { emoji: '🦁', label: 'Saltar a la nave y agarrar el frasco', trait: 'valentia',
              outcome: 'Bruno corrió hacia la nave. Esquivó un brazo mecánico, saltó sobre otro y se impulsó en el hombro de Sonic para llegar arriba. Eggman apretaba botones sin saber cuál. Bruno agarró el frasco con las dos manos, se tiró hacia abajo y Amy lo atajó como una arquera. ¡{Meta} estaba a salvo!' },
            { emoji: '💡', label: 'Hacer que los brazos mecánicos se enreden', trait: 'ingenio',
              outcome: 'Bruno notó que los brazos mecánicos seguían a lo que se movía más rápido. —¡Sonic, corré en círculos alrededor de la nave! Sonic dio veinte vueltas en un segundo y los brazos, intentando atraparlo, se enredaron entre ellos como cables de auriculares. La nave quedó atada como un paquete. Bruno trepó tranquilo y abrió el frasco.' },
            { emoji: '🗣️', label: 'Proponerle a Eggman un trato sincero', trait: 'honestidad',
              outcome: 'Bruno levantó la mano: —Doctor, usted es un genio de verdad. ¿Para qué usa su genio en robar? Si devuelve {meta}, le propongo algo: que invente cosas para ayudar, y nosotros le contamos a todo el mundo lo genial que es. Eggman se quedó mudo: nadie le había dicho genio sin que él lo pidiera. Bajó la nave, abrió el frasco y murmuró: —Bueno... pero que conste que la idea fue mía.' }
          ] },
        { id: 'v-huevotron',
          situation: 'Eggman apareció adentro de un robot gigante con forma de huevo y patas de araña: el Huevotrón. Tenía {meta} en el pecho, como un corazón de metal. —¡Nadie es más veloz que mi Huevotrón! —gritó, y empezó a perseguirlos por toda la isla. Sonic corría adelante, Tails volaba arriba y Bruno, en el medio, pensaba.',
          options: [
            { emoji: '🛡️', label: 'Dividir al equipo y rodearlo', trait: 'equipo',
              outcome: 'Bruno gritó el plan: —¡Sonic, distraelo por adelante! ¡Tails, desde arriba! ¡Amy, a las patas! Cada uno hizo su parte y el Huevotrón no sabía a quién mirar. Giraba, se mareaba, giraba más... hasta que se enredó con sus propias patas. Bruno aprovechó y sacó {meta} del pecho del robot.' },
            { emoji: '🦁', label: 'Pararse frente al robot sin moverse', trait: 'valentia',
              outcome: 'Bruno hizo algo que nadie esperaba: se plantó en el medio del camino y no se movió. El Huevotrón frenó de golpe, porque Eggman, en el fondo, no quería lastimar a nadie. —¿Estás loco? —gritó Eggman por el parlante. —No —dijo Bruno—. Sé que usted no es tan malo. Eggman se quedó sin respuesta y, en ese segundo, Amy y Sonic sacaron {meta} del robot.' },
            { emoji: '💡', label: 'Llevarlo hasta el pantano de barro', trait: 'ingenio',
              outcome: 'Bruno se acordó de que cerca había un pantano de barro pegajoso. —¡Síganme! —gritó, y corrieron hacia allá. El Huevotrón los persiguió sin mirar el piso y ¡plaf!: se quedó pegado hasta las rodillas. Bruno, con ayuda de Perlita, sacó {meta} mientras Eggman protestaba porque se le había ensuciado la pintura nueva.' }
          ] }
      ]
    },
    {
      id: 'taller',
      name: 'el Taller de Gepeto',
      short: 'Taller de Gepeto',
      emoji: '🤥',
      tagline: 'Pinocho, Gepeto, relojes cucú y un pueblito junto al mar',
      colors: ['#c8873a', '#f5d08a'],
      hosts: ['Pinocho', 'Gepeto'],
      extras: ['Pepe Grillo', 'el Hada Azul'],
      villain: 'el Zorro Tramposo',
      places: ['el Pueblito de los Techos Rojos', 'el Bosque de los Árboles que Hablan', 'la Plaza del Teatro de Títeres', 'la orilla del Mar de la Ballena Dormida'],
      flavor: [
        'El taller olía a madera y a pegamento. Había relojes cucú que cantaban a destiempo, muñecos colgados del techo y un fueguito que calentaba una pava. Por la ventana se veía un pueblito de techos rojos al lado del mar.',
        'Todo estaba lleno de virutas de madera que se enrollaban como rulos dorados, y sobre la mesa había herramientas tan viejas que parecían saber contar historias.'
      ],
      missions: [
        { id: 'reloj', title: 'El reloj del pueblo que se detuvo', meta: 'la Llave del Gran Reloj',
          setup: 'Gepeto los recibió con los anteojos en la punta de la nariz. —¡Qué alegría! Necesitamos ayuda: el Gran Reloj del pueblo se detuvo y, si no marca la hora, nadie sabe cuándo abrir la panadería, ni cuándo empieza la escuela, ni cuándo es hora de dormir. Pinocho agregó, muy serio: —Y el Zorro Tramposo se llevó la Llave del Gran Reloj. Lo vi yo. Y es verdad, ¿eh? Mirá mi nariz: no creció ni un poquito.',
          resolution: 'Bruno metió la Llave del Gran Reloj en la cerradura, le dio tres vueltas y el reloj volvió a sonar: ¡tic, tac, talán! En todo el pueblo se abrieron las ventanas y la panadería, por fin, sacó el pan del horno.' },
        { id: 'cincel', title: 'La herramienta mágica de Gepeto', meta: 'el Cincel de las Maravillas',
          setup: 'Gepeto estaba preocupado: le faltaba el Cincel de las Maravillas, la herramienta con la que había tallado a Pinocho. —Sin él no puedo arreglar nada —dijo—, y mañana es la feria de juguetes del pueblo. Pinocho se puso colorado: —Yo... se lo presté al Zorro Tramposo, que me prometió devolverlo. Y no lo devolvió. Esta vez su nariz no creció ni un milímetro, porque decía la verdad.',
          resolution: 'Con el Cincel de las Maravillas de vuelta, Gepeto trabajó toda la noche, y a la mañana la feria tuvo los juguetes más lindos de su historia. El primero que talló fue un muñequito igualito a Bruno.' },
        { id: 'faro', title: 'La luz que se apagó en el puerto', meta: 'la Luz del Faro',
          setup: 'Esa noche el faro del pueblo estaba apagado y los barcos pesqueros no encontraban el camino de vuelta. —El Zorro Tramposo cambió la luz del faro por una piedra pintada y se llevó la de verdad —contó Gepeto, preocupadísimo—. Dicen que escapó en bote hacia la Ballena Dormida. Pinocho tomó la mano de Bruno: —Yo ya estuve adentro de una ballena. No es tan feo. Bueno, un poco sí.',
          resolution: 'La Luz del Faro volvió a girar en lo alto de la torre y, uno por uno, los barquitos pesqueros encontraron el camino a casa. Los pescadores hicieron sonar sus bocinas para saludar a Bruno.' },
        { id: 'deseos', title: 'La estrella de los deseos', meta: 'la Estrella de los Deseos',
          setup: 'Cada noche, la Estrella de los Deseos brillaba sobre el taller y cumplía un deseo bueno del pueblo. Pero esa noche el cielo estaba vacío. —El Zorro Tramposo la atrapó con una red de cazar mariposas —explicó Pepe Grillo, que lo había visto todo— y quiere usarla para desear ser rico. El Hada Azul apareció en un destello y miró a Bruno: —Un deseo robado nunca sale bien. Hay que devolverla al cielo.',
          resolution: 'Bruno abrió las manos y la Estrella de los Deseos subió despacito hasta su lugar en el cielo. Esa misma noche cumplió el deseo de una nena del pueblo: que su abuelo se curara del resfrío.' }
      ],
      challenges: [
        { id: 't-gato',
          situation: 'En el camino se cruzaron con el Gato, el compinche del Zorro Tramposo, que les habló con voz de miel: —El Zorro se fue para el norte, se los juro. Pinocho arrugó la nariz: —Yo sé mucho de mentiras... y esa me suena a mentira.',
          options: [
            { emoji: '🧐', label: 'Hacerle preguntas para descubrir la verdad', trait: 'ingenio',
              outcome: 'Bruno le hizo preguntas al Gato: «¿Para qué lado queda el norte?». El Gato señaló a la izquierda. «¿Y el sol, por dónde sale?». El Gato señaló... también a la izquierda, y se enredó solo. —El norte no es para ahí —dijo Bruno, mirando el sol—. Vamos para el otro lado. El Gato se fue maullando bajito, descubierto.',
              memory: 'descubrió la mentira del Gato con preguntas' },
            { emoji: '💬', label: 'Decirle que mentir no le conviene', trait: 'honestidad',
              outcome: 'Bruno miró al Gato a los ojos: —Si nos mentís, el Zorro se va a quedar con todo y vos con nada, como siempre. El Gato se quedó pensando. Era verdad: el Zorro nunca le daba su parte. —Está bien —maulló—. Se fue para el sur, por el camino de los molinos.',
              memory: 'convenció al Gato de decir la verdad' },
            { emoji: '🦗', label: 'Pedirle consejo a Pepe Grillo', trait: 'amistad',
              outcome: 'Bruno le preguntó a Pepe Grillo qué opinaba. El grillo, chiquito pero muy sabio, saltó al hombro de Bruno y le susurró: —Fijate en las huellas, no en las palabras. Bruno miró el piso: las huellas del Zorro iban justo para el lado contrario. Le agradeció a Pepe Grillo con una caricia en la cabeza... con un solo dedo, porque era muy chiquito.',
              memory: 'siguió el consejo de Pepe Grillo' }
          ] },
        { id: 't-bosque',
          situation: 'Entraron al Bosque de los Árboles que Hablan. Los árboles eran muy viejos y muy charlatanes, y estaban peleándose por quién tenía las hojas más lindas. Con tanto alboroto, las ramas se sacudían y tapaban el camino.',
          options: [
            { emoji: '🏆', label: 'Organizar un concurso de hojas', trait: 'ingenio',
              outcome: 'Bruno se subió a una piedra: —¡Hagamos un concurso! Cada árbol muestra sus hojas y Perlita es la jueza. Los árboles se quedaron quietos y orgullosos, mostrando sus ramas, y el camino quedó libre. Perlita, muy diplomática, declaró que todos habían empatado en el primer puesto.',
              memory: 'organizó un concurso de hojas en el bosque' },
            { emoji: '🫂', label: 'Escucharlos y ayudarlos a hacer las paces', trait: 'amistad',
              outcome: 'Bruno se sentó entre los árboles y les preguntó por qué se peleaban. Resultó que hacía años que nadie los visitaba y estaban aburridísimos. Bruno y Amy les contaron chistes, Pinocho les cantó una canción, y los árboles, contentos, levantaron sus ramas formando un arco para dejarlos pasar.',
              memory: 'hizo las paces entre los árboles del bosque' },
            { emoji: '🏃', label: 'Cruzar corriendo entre las ramas', trait: 'valentia',
              outcome: 'Bruno respiró hondo y salió corriendo entre las ramas que se sacudían. Se agachó, saltó una raíz, esquivó otra rama y llegó al otro lado con hojas en el pelo. Amy lo siguió corriendo las ramas con martillazos suaves, y Pinocho, que era de madera, pasó sin que los árboles lo notaran.',
              memory: 'cruzó corriendo el bosque de los árboles charlatanes' }
          ] },
        { id: 't-teatro',
          situation: 'En la plaza había un teatro de títeres. Su dueño, Comefuego, un señor de barba enorme, les cerró el paso: —Nadie cruza mi plaza sin dar un espectáculo. Pinocho tembló un poquito: una vez había trabajado para él y no le había ido muy bien.',
          options: [
            { emoji: '🎭', label: 'Dar un show con Amy y Perlita', trait: 'equipo',
              outcome: 'Bruno armó un show en dos minutos: Amy hacía malabares con su martillo, Perlita hacía aparecer perlas de colores en el aire y él contaba un cuento inventado en el momento. Al público le encantó tanto que Comefuego se secó una lágrima con la barba y los dejó pasar.',
              memory: 'dio un show inolvidable en la plaza de los títeres' },
            { emoji: '🛡️', label: 'Defender a Pinocho', trait: 'valentia',
              outcome: 'Bruno se paró delante de Pinocho: —Pinocho no tiene que actuar si no quiere. Comefuego frunció la barba... y estornudó. Siempre estornudaba cuando se emocionaba. —¡Ah, qué chico valiente! Así me gusta. ¡Pasen, pasen!',
              memory: 'defendió a Pinocho frente a Comefuego' },
            { emoji: '🗣️', label: 'Contarle la verdad sobre la misión', trait: 'honestidad',
              outcome: 'Bruno le explicó a Comefuego la verdad: estaban buscando {meta} para ayudar a todo el pueblo. Comefuego se rascó la barba: —¿El Zorro Tramposo? Ese me debe plata hace años. Vayan, y si lo ven, díganle que lo estoy esperando.',
              memory: 'le contó la verdad a Comefuego' }
          ] },
        { id: 't-ballena',
          situation: 'Llegaron a la orilla del mar. A lo lejos se veía la Ballena Dormida, grande como una isla, roncando tan fuerte que hacía olas. El camino seguía del otro lado de la bahía, y no había ningún barco.',
          options: [
            { emoji: '🪵', label: 'Construir un bote con Gepeto', trait: 'equipo',
              outcome: 'Bruno juntó maderas de la playa y Gepeto, con sus manos de artesano, armó un bote en un rato. Pinocho remaba, Amy hacía de timón y Perlita iluminaba. Bruno marcaba el ritmo: «¡Uno, dos! ¡Uno, dos!». Llegaron al otro lado con los brazos cansados y una sonrisa enorme.',
              memory: 'construyó un bote con Gepeto' },
            { emoji: '🐋', label: 'Despertar a la ballena con respeto', trait: 'valentia',
              outcome: 'Bruno se subió a una roca y le habló a la ballena, fuerte pero amable: —¡Señora Ballena, perdón que la despierte! La ballena abrió un ojo gigante. Bruno no se movió, aunque le temblaban las piernas. La ballena, sorprendida de que alguien le hablara con tanto respeto, los llevó en su lomo hasta la otra orilla.',
              memory: 'despertó con respeto a la Ballena Dormida' },
            { emoji: '🌊', label: 'Esperar a que baje la marea', trait: 'ingenio',
              outcome: 'Bruno vio unas marcas en las rocas: el agua subía y bajaba. —Si esperamos la marea baja, aparece un camino de arena —calculó. Se sentaron a jugar al veo-veo y, una hora después, el mar se retiró y apareció un camino. Cruzaron caminando y juntando caracoles.',
              memory: 'esperó la marea baja para cruzar la bahía' }
          ] }
      ],
      climaxes: [
        { id: 't-cueva',
          situation: 'Encontraron al Zorro Tramposo en una cueva llena de cosas robadas, contando monedas de chocolate. Tenía {meta} adentro de una caja con siete candados. —¡Ah, visitas! —dijo con una sonrisa llena de dientes—. Les vendo lo que buscan. Cuesta... todo lo que tengan. Pinocho miró a Bruno, nervioso. El Gato, al lado del Zorro, se limaba las uñas.',
          options: [
            { emoji: '💡', label: 'Desafiar al Zorro con un acertijo', trait: 'ingenio',
              outcome: 'Bruno le propuso un trato: si el Zorro resolvía un acertijo, se quedaba con todo; si no, devolvía la caja. —¿Qué cosa, cuanto más le sacás, más grande se hace? El Zorro pensó, se rascó, contó con los dedos... y nada. —Un pozo —dijo Bruno. El Zorro, que se las daba de vivo, no tuvo más remedio que cumplir el trato delante de todos.' },
            { emoji: '🗣️', label: 'Contarle al Gato la verdad sobre el Zorro', trait: 'honestidad',
              outcome: 'Bruno se dirigió al Gato: —¿Te diste cuenta de que el Zorro se queda siempre con todo y a vos no te da nada? Mirá: monedas para él, cáscaras para vos. El Gato miró los dos montoncitos y se le erizaron los bigotes. —¡Es verdad! —maulló, y le entregó a Bruno la llave de los candados. El Zorro, sin compinche, se quedó solo y sin plan.' },
            { emoji: '🦁', label: 'Agarrar la caja y salir corriendo', trait: 'valentia',
              outcome: 'Bruno vio su oportunidad: mientras el Zorro contaba monedas, saltó sobre la mesa, agarró la caja y salió corriendo. El Zorro corrió detrás, pero Amy le puso el martillo en el camino y el Zorro tropezó con una montaña de sus propias cosas robadas. Bruno no paró hasta llegar a la puerta, con el corazón como un tambor.' }
          ] },
        { id: 't-globo',
          situation: 'El Zorro Tramposo los esperaba en lo alto del campanario, con {meta} en una mano y un globo enorme atado a la cintura. —¡Me voy volando y nunca me van a encontrar! —se rió, y el globo empezó a subir. Gepeto se agarró la cabeza. Pinocho miró a Bruno: —¡Hacé algo!',
          options: [
            { emoji: '🪁', label: 'Enganchar el globo con un barrilete', trait: 'ingenio',
              outcome: 'Bruno vio un barrilete enganchado en la torre. Le pidió a Amy que lo soltara con un martillazo suave y lo hizo volar con el viento justo hacia el globo. El hilo se enroscó en la soga del globo y Bruno, Pinocho, Gepeto y Amy tiraron todos juntos, como en una cinchada, hasta bajarlo. El Zorro aterrizó en un carro de paja y {meta} cayó en las manos de Bruno.' },
            { emoji: '🤝', label: 'Pedir ayuda a todo el pueblo', trait: 'equipo',
              outcome: 'Bruno gritó con todas sus fuerzas: —¡Pueblo, necesitamos ayuda! En un minuto la plaza se llenó de gente: el panadero, la maestra, los chicos de la escuela. Bruno organizó a todos para sostener una sábana enorme, como una red. Perlita pinchó el globo con una aguja de Gepeto y el Zorro bajó despacito hasta caer, ¡fuf!, en la sábana. {Meta} quedó a salvo.' },
            { emoji: '💛', label: 'Ofrecerle al Zorro algo mejor', trait: 'amistad',
              outcome: 'Bruno le gritó: —¡Esperá! ¿De verdad querés vivir solo, escapándote siempre? En el pueblo hace falta alguien astuto que ayude a Gepeto a vender juguetes en la feria. El Zorro dudó. Nadie le había ofrecido un trabajo honesto nunca. Soltó un poco de aire del globo, bajó despacito y le entregó {meta} a Bruno, con las orejas gachas.' }
          ] }
      ]
    },
    {
      id: 'vecindad',
      name: 'la Vecindad del Chavo',
      short: 'Vecindad del Chavo',
      emoji: '🛢️',
      tagline: 'El Chavo, la Chilindrina, Quico y un patio lleno de misterios',
      colors: ['#29b36a', '#ffd23f'],
      hosts: ['el Chavo', 'la Chilindrina'],
      extras: ['Quico', 'Don Ramón', 'el Profesor Jirafales', 'Doña Florinda', 'Ñoño'],
      villain: 'el Bromista Misterioso',
      noGenericClimax: true,
      places: ['el patio de la vecindad', 'la escuelita del Profesor Jirafales', 'la fuente del patio', 'la azotea de los tendederos'],
      flavor: [
        'Era un patio con piletas de lavar ropa, macetas con plantas, una escalera que subía a los departamentos de arriba y, en un rincón, un barril de madera que era la casa favorita de un chico muy especial. Se escuchaban risas, una pelota rebotando y el ruido de una plancha.',
        'En la vecindad todos se conocían: los chicos jugaban en el patio, los grandes se asomaban por las ventanas y siempre había alguien cocinando algo rico que perfumaba toda la cuadra.'
      ],
      missions: [
        { id: 'tortas', title: 'El misterio de las tortas desaparecidas', meta: 'la Canasta de Tortas de Jamón',
          setup: 'El Chavo salió del barril con cara de preocupado. —¡Bruno! Qué bueno que viniste. Alguien se llevó la Canasta de Tortas de Jamón de la fiesta del patio. ¡Y era para todos! La Chilindrina, con sus colitas y los anteojos torcidos, agregó: —Dejó huellas de zapatos enormes y una capa negra enganchada en la ventana. Le dicen el Bromista Misterioso.',
          resolution: 'La Canasta de Tortas de Jamón volvió a la mesa del patio y la fiesta empezó de verdad. El Chavo se comió tres tortas, Quico cuatro, y Bruno, Amy y Perlita brindaron con agua de jamaica bien fresquita.' },
        { id: 'pelota', title: 'La pelota nueva de Quico', meta: 'la pelota nueva de Quico',
          setup: 'Quico lloraba a los gritos en el medio del patio, porque alguien se había llevado su pelota nueva, la que le habían regalado para su cumpleaños. —¡No fui yo! —dijo el Chavo, antes de que nadie preguntara nada. La Chilindrina le mostró a Bruno una nota: «Si quieren la pelota, sigan las pistas. Firma: el Bromista Misterioso».',
          resolution: 'La pelota nueva de Quico volvió a sus manos y, en vez de guardarla, por primera vez Quico la compartió: armaron un partido en el patio, chicos contra grandes, que terminó empatado y con Don Ramón tirado en el piso de la risa.' },
        { id: 'campana', title: 'Sin campana no hay recreo', meta: 'la Campana de la escuelita',
          setup: 'El Profesor Jirafales estaba desconsolado: la Campana de la escuelita había desaparecido, y sin campana no había recreo. —¡Ni recreo, ni salida, ni nada! —se lamentó la Chilindrina. El Chavo se rascó la cabeza: —Yo vi a alguien con capa negra corriendo por los techos. Era el Bromista Misterioso, seguro.',
          resolution: 'La Campana de la escuelita volvió a su lugar y, cuando sonó, todos los chicos salieron al recreo como si fuera el primer día del mundo. El Profesor Jirafales, emocionado, le regaló a Bruno una tiza dorada.' },
        { id: 'adornos', title: 'La fiesta de la vecindad', meta: 'la Caja de los Adornos',
          setup: 'Esa noche era la gran fiesta de la vecindad, pero la Caja de los Adornos, con las guirnaldas, los farolitos y la piñata, había desaparecido del depósito. Doña Florinda estaba indignada y Don Ramón buscaba debajo de cada maceta. —Fue el Bromista Misterioso —dijo el Chavo, muy seguro—. Dejó una pluma de su sombrero.',
          resolution: 'Con la Caja de los Adornos de vuelta, el patio se llenó de farolitos de colores. Hubo baile, hubo piñata y hubo un concurso de chistes que ganó, por amplia diferencia, Perlita.' }
      ],
      challenges: [
        { id: 'c-clotilde',
          situation: 'La siguiente pista estaba en la puerta del departamento 71, donde vivía Doña Clotilde. Los chicos de la vecindad le tenían un poco de miedo y le decían «la Bruja», aunque nunca le habían visto una escoba voladora. —Yo ahí no toco —dijo Quico, escondido detrás del Chavo.',
          options: [
            { emoji: '🚪', label: 'Tocar la puerta y saludar con respeto', trait: 'valentia',
              outcome: 'Bruno se acercó y tocó la puerta. Le temblaba un poco la mano, pero tocó igual. Doña Clotilde abrió con un delantal lleno de harina: estaba haciendo galletitas. —¡Qué chico tan educado! —dijo—. Sí, vi a alguien con capa: se fue para la escuelita. Y les dio una galletita a cada uno. Quico, después, pidió dos.',
              memory: 'tocó la puerta de Doña Clotilde aunque todos tenían miedo' },
            { emoji: '🌸', label: 'Llevarle una flor de regalo', trait: 'amistad',
              outcome: 'Bruno cortó una flor de una maceta (con permiso de Doña Florinda) y se la llevó a Doña Clotilde. Ella se emocionó tanto que se le cayeron los ruleros. —Hace años que nadie me trae una flor —dijo, y les contó todo lo que había visto desde su ventana: el Bromista había escondido algo en la fuente.',
              memory: 'le regaló una flor a Doña Clotilde' },
            { emoji: '🔎', label: 'Buscar la pista sin molestar', trait: 'ingenio',
              outcome: 'Bruno vio que la pista estaba pegada debajo del felpudo de Doña Clotilde. Con un palito de helado y mucho cuidado, la despegó sin hacer ruido. Decía: «Busquen donde el agua no moja». Bruno lo pensó un poquito: —¡La fuente vacía! —dijo, y todos lo miraron con admiración.',
              memory: 'encontró la pista escondida debajo del felpudo' }
          ] },
        { id: 'c-ramon',
          situation: 'Don Ramón estaba en el patio intentando arreglar una silla con un martillo, y cada vez que daba un martillazo se pegaba en el dedo. —¡Ay! Justo ahora —se quejaba—. Si me dan una mano, les cuento lo que vi anoche.',
          options: [
            { emoji: '🔨', label: 'Arreglar la silla junto con Amy', trait: 'equipo',
              outcome: 'Bruno sostuvo la silla, Amy clavó el clavo con un martillazo perfecto (era experta) y Perlita alumbraba. En un minuto la silla quedó como nueva. Don Ramón, feliz, les contó que había visto al Bromista Misterioso subir a la azotea con una escalera.',
              memory: 'arregló la silla de Don Ramón con Amy' },
            { emoji: '📏', label: 'Enseñarle el truco del peine', trait: 'ingenio',
              outcome: 'Bruno le mostró a Don Ramón un truco que le había enseñado su abuelo: sostener el clavo con un peine, así el dedo queda lejos del martillo. Don Ramón lo probó y ¡pum!, ni un dedo machucado. Tan contento quedó que les contó todo: el Bromista había dejado huellas de harina hasta la escalera.',
              memory: 'le enseñó a Don Ramón el truco del peine' },
            { emoji: '💬', label: 'Ser sincero: «no sé arreglar sillas»', trait: 'honestidad',
              outcome: 'Bruno fue sincero: —No sé arreglar sillas, Don Ramón, pero podemos buscar a alguien que sepa. Fueron a buscar al Profesor Jirafales, que de carpintería sabía muchísimo. Don Ramón, agradecido de que no le hicieran perder el tiempo, les contó todo lo que había visto.',
              memory: 'admitió que no sabía y buscó a alguien que supiera' }
          ] },
        { id: 'c-acusacion',
          situation: 'De repente, Quico señaló al Chavo: —¡Fue él! ¡Seguro que fue él! El Chavo se puso colorado: —¡No fui yo! Todos empezaron a discutir a los gritos. Bruno se dio cuenta de que, si se peleaban entre ellos, el Bromista Misterioso iba a ganar.',
          options: [
            { emoji: '⚖️', label: 'Buscar pruebas antes de acusar', trait: 'honestidad',
              outcome: 'Bruno levantó las manos: —No acusemos sin pruebas. Revisó las huellas: eran de zapatos enormes, y el Chavo andaba con unos zapatos viejitos y chiquitos. —No pudo ser él —dijo Bruno—. Quico le pidió perdón al Chavo, y el Chavo, generoso, lo perdonó enseguida.',
              memory: 'defendió al Chavo con pruebas' },
            { emoji: '🕵️', label: 'Convertirlos en detectives juntos', trait: 'equipo',
              outcome: 'Bruno propuso algo: —Quico y el Chavo, ustedes dos van a ser detectives juntos. Al principio se miraban de reojo, pero a los cinco minutos ya discutían quién era el detective jefe, que era su manera de ser amigos. Y juntos encontraron una pista nueva atrás de la pileta.',
              memory: 'convirtió a Quico y al Chavo en detectives' },
            { emoji: '😄', label: 'Hacerlos reír con un chiste', trait: 'amistad',
              outcome: 'Bruno contó el chiste más malo que sabía: —¿Qué le dice una iguana a su hermana gemela? ¡Somos iguanitas! Hubo un silencio... y después todos se rieron, hasta Quico. Con el enojo olvidado, se pusieron a buscar pistas todos juntos.',
              memory: 'cortó una pelea con un chiste de iguanas' }
          ] },
        { id: 'c-azotea',
          situation: 'La última pista llevaba a la azotea. Para subir había una escalera vieja de madera a la que le faltaban escalones, y Doña Florinda había prohibido usarla terminantemente. —Hay otra forma —dijo la Chilindrina—, pero hay que pedir permiso.',
          options: [
            { emoji: '🙋', label: 'Pedirle permiso a Doña Florinda', trait: 'honestidad',
              outcome: 'Bruno fue hasta la puerta de Doña Florinda y le explicó todo. Doña Florinda lo miró de arriba abajo: —¡Qué chico tan bien educado! Y les prestó la llave de la escalera del fondo, que era segura. Subieron sin ningún problema.',
              memory: 'pidió permiso a Doña Florinda' },
            { emoji: '🧱', label: 'Armar una escalera segura con cajones', trait: 'ingenio',
              outcome: 'Bruno juntó cajones de fruta vacíos de la verdulería y armó una escalera ancha abajo y finita arriba, como una pirámide. Amy la probó saltando: no se movía nada. Subieron uno por uno, con el Chavo sosteniendo los cajones de abajo.',
              memory: 'construyó una escalera de cajones' },
            { emoji: '🌳', label: 'Trepar el árbol del patio con el Chavo', trait: 'valentia',
              outcome: 'El Chavo conocía un secreto: las ramas del árbol del patio llegaban hasta la azotea. Bruno nunca había trepado tan alto, pero se agarró fuerte y subió detrás del Chavo, rama por rama, sin mirar para abajo. Arriba, el viento lo despeinó y se sintió el chico más valiente del barrio.',
              memory: 'trepó el árbol del patio hasta la azotea' }
          ] }
      ],
      climaxes: [
        { id: 'c-sabanas',
          situation: 'En la azotea, entre sábanas colgadas que flameaban como velas de barco, apareció el Bromista Misterioso: capa negra, antifaz y un sombrero con pluma. Tenía {meta} detrás de él. —¡Nunca sabrán quién soy! —dijo con una voz rara, como si hablara adentro de un balde.',
          options: [
            { emoji: '🧩', label: 'Descubrir quién es usando las pistas', trait: 'ingenio',
              outcome: 'Bruno juntó las pistas en su cabeza: huellas grandes (zapatos de un adulto), harina (alguien que ayuda en una panadería) y voz de balde (porque hablaba adentro de un balde de verdad). —Sos el chico nuevo de la panadería de la esquina, ¿no? —dijo. El Bromista se sacó el antifaz: era Tomás, que se acababa de mudar. —Quería que alguien me prestara atención —confesó, y devolvió {meta}. Bruno lo invitó a jugar con todos al día siguiente.' },
            { emoji: '💛', label: 'Invitarlo a jugar', trait: 'amistad',
              outcome: 'Bruno no lo atrapó ni lo retó. Le preguntó: —¿Querés jugar con nosotros? El Bromista se quedó quieto y, despacito, se sacó el antifaz: era Tomás, un chico nuevo del barrio que no conocía a nadie. —Hice todo esto porque nadie me hablaba —dijo bajito. Devolvió {meta} y esa misma tarde ya era el arquero del equipo del patio.' },
            { emoji: '🦁', label: 'Acercarse y pedirle que se saque el antifaz', trait: 'valentia',
              outcome: 'Bruno caminó hacia el Bromista, aunque las sábanas flameaban y esa voz rara daba un poco de impresión. —Sacate el antifaz —le pidió, firme—. Acá nadie te va a hacer nada. El Bromista dudó y se lo sacó: era Tomás, el chico nuevo del barrio. Le temblaba el labio. —Perdón. Quería que me conocieran. Devolvió {meta}, y Bruno le presentó a todos los de la vecindad, uno por uno.' }
          ] },
        { id: 'c-deposito',
          situation: 'Siguiendo las pistas llegaron al viejo depósito del fondo, donde nadie entraba desde hacía años. Adentro había un laberinto de muebles viejos y, en el centro, sobre una mesa, estaba {meta}. Pero cuando Bruno dio un paso, una voz gritó desde las sombras: —¡Alto! ¡El que se acerque se lleva una sorpresa de cotillón!',
          options: [
            { emoji: '🛡️', label: 'Entrar todos juntos de la mano', trait: 'equipo',
              outcome: 'Bruno tomó la mano del Chavo, el Chavo la de la Chilindrina, la Chilindrina la de Amy y Amy la de Perlita. —Juntos no nos asusta nada —dijo Bruno. Avanzaron por el laberinto, y la «sorpresa de cotillón» resultó ser una lluvia de papelitos. Detrás de los muebles estaba el Bromista: Tomás, un chico nuevo del barrio. Se rió con ellos, devolvió {meta} y se sumó a la cadena de manos.' },
            { emoji: '💡', label: 'Iluminar el depósito', trait: 'ingenio',
              outcome: 'Bruno pensó que las sombras dan miedo solo cuando no se ve nada. Buscó la llave de la luz y, como no la encontró, le pidió a Perlita su perla más brillante. ¡Flash! El depósito se iluminó y el Bromista quedó al descubierto, con un megáfono de juguete: era Tomás, el chico nuevo de la cuadra. —Bueno, me descubrieron —se rió. Devolvió {meta} y pidió perdón a todos.' },
            { emoji: '🗣️', label: 'Contestarle con la verdad', trait: 'honestidad',
              outcome: 'Bruno habló hacia la oscuridad: —No tengo miedo... bueno, un poquito sí, la verdad. Pero sé que no sos malo: te llevaste cosas, pero no rompiste nada. Hubo un silencio y de las sombras salió un chico con capa: Tomás, el nuevo de la cuadra. —Nadie me había hablado tan claro —dijo. Devolvió {meta}, y Bruno y él se dieron la mano.' }
          ] }
      ]
    },
    {
      id: 'puerto',
      name: 'el Puerto de Popeye',
      short: 'Puerto de Popeye',
      emoji: '⚓',
      tagline: 'Popeye, Olivia, espinaca y barcos en el muelle',
      colors: ['#1d4e89', '#4fc3f7'],
      hosts: ['Popeye', 'Olivia'],
      extras: ['Cocoliso', 'Pilón'],
      villain: 'Brutus',
      places: ['el muelle de los pescadores', 'la Isla de las Gaviotas', 'el faro rojo y blanco', 'la cubierta del barco de Popeye'],
      flavor: [
        'El puerto olía a sal y a espinaca recién cocinada. Las gaviotas daban vueltas sobre los barquitos, las sogas crujían y un faro rojo y blanco vigilaba el mar.',
        'Los barcos se mecían en el muelle como si estuvieran bailando, y a lo lejos se escuchaba la bocina de un remolcador que saludaba a todo el mundo.'
      ],
      missions: [
        { id: 'espinaca', title: 'La espinaca desaparecida', meta: 'el Cofre de las Latas de Espinaca',
          setup: 'Popeye estaba sentado en el muelle, triste, mirando un estante vacío. —Brutus se llevó el Cofre de las Latas de Espinaca —gruñó, cruzado de brazos—. Sin espinaca no tengo fuerza ni para levantar un ancla. Olivia, flaquita y decidida, le puso una mano en el hombro a Bruno: —Popeye dice que no necesita ayuda, pero sí la necesita. ¿Vienen con nosotros?',
          resolution: 'El Cofre de las Latas de Espinaca volvió al barco de Popeye. Popeye abrió una lata, se la comió de un bocado y sus brazos se inflaron como globos. —¡A esto le llamo un buen equipo! —dijo, y levantó a Bruno, a Amy y a Perlita al mismo tiempo, como si fueran plumitas.' },
        { id: 'ancla', title: 'El ancla y la tormenta', meta: 'el Ancla Dorada',
          setup: 'Unas nubes negras se acercaban por el horizonte y en el puerto todos corrían de un lado a otro. —¡Viene una tormenta y no tenemos el Ancla Dorada! —gritó Olivia—. Es la que mantiene quietos a todos los barcos cuando sopla el viento. Popeye apretó los puños: —La tiene Brutus. Quiere que los barcos se vayan flotando para quedarse con el puerto. Necesitamos un plan, grumete, y rápido.',
          resolution: 'El Ancla Dorada volvió a su lugar justo cuando empezaba la tormenta. El viento sopló y la lluvia cayó, pero ningún barco se movió ni un centímetro. Cuando salió el sol, apareció un arcoíris enorme sobre el puerto.' },
        { id: 'mapa', title: 'El tesoro de la Isla de las Gaviotas', meta: 'el Mapa del Abuelo Marinero',
          setup: 'Olivia los recibió agitando una botella vacía. —¡Había un mapa adentro! El Mapa del Abuelo Marinero, que dice dónde está el tesoro del puerto, para repartirlo entre todos los vecinos. ¡Y Brutus lo robó! Popeye se arremangó: —Ese tesoro es de todos. No vamos a dejar que Brutus se lo quede para él solo.',
          resolution: 'Con el Mapa del Abuelo Marinero en la mano, encontraron el tesoro enterrado en la Isla de las Gaviotas: un cofre lleno de semillas de todas las plantas del mundo, para que el puerto tuviera huertas para siempre. Lo repartieron entre todos los vecinos, y a Bruno le tocaron semillas de girasol.' },
        { id: 'regata', title: 'La gran regata del puerto', meta: 'el Timón de la Regata',
          setup: 'Era el día de la gran regata, la carrera de barcos más importante del año. Pero el Timón de la Regata, el trofeo para el ganador, había desaparecido, y alguien vio a Brutus escapar con él en su lancha. Olivia se cruzó de brazos: —Seguro lo quiere sin tener que correr. Popeye le guiñó un ojo a Bruno: —¿Navegamos, grumete?',
          resolution: 'El Timón de la Regata volvió al puerto y la carrera se hizo igual. Popeye, Olivia, Bruno, Amy y Perlita corrieron juntos en el mismo barco y llegaron segundos... pero fueron los que más se divirtieron, y eso no se lo quita nadie.' }
      ],
      challenges: [
        { id: 'p-pilon',
          situation: 'Pilón, el amigo de Popeye que siempre tenía hambre, estaba parado en el medio del muelle. —Les digo dónde está Brutus, con gusto —dijo—. Pero tengo la memoria en el estómago: con la panza vacía no me acuerdo de nada. ¿Alguien tiene una hamburguesa?',
          options: [
            { emoji: '🍪', label: 'Compartir su merienda con Pilón', trait: 'amistad',
              outcome: 'Bruno tenía en el bolsillo un alfajor que había traído de casa. Lo partió en dos y le dio la mitad a Pilón, que se lo comió con los ojos cerrados, como si fuera lo más rico del universo. —¡Ahora me acuerdo de todo! Brutus se fue para la Isla de las Gaviotas, en una lancha a motor.',
              memory: 'compartió su alfajor con Pilón' },
            { emoji: '🔎', label: 'Buscar pistas por su cuenta', trait: 'ingenio',
              outcome: 'Bruno miró el muelle con atención: había una mancha de aceite fresca y marcas de soga en un poste. —Acá estuvo atada una lancha a motor —razonó—, y las manchas van hacia el norte, hacia la Isla de las Gaviotas. Pilón lo miró con la boca abierta y hasta se olvidó del hambre por un rato.',
              memory: 'siguió las manchas de aceite del muelle' },
            { emoji: '💬', label: 'Hablarle con sinceridad', trait: 'honestidad',
              outcome: 'Bruno le dijo a Pilón la verdad: no tenían hamburguesas, pero necesitaban su ayuda de verdad, porque si no, todo el puerto iba a sufrir. Pilón se quedó pensando y suspiró: —Tenés razón, chico. A veces pienso más con la panza que con el corazón. Brutus se fue para la Isla de las Gaviotas.',
              memory: 'le habló con sinceridad a Pilón' }
          ] },
        { id: 'p-gaviotas',
          situation: 'Llegaron a la Isla de las Gaviotas, donde vivían miles de gaviotas que gritaban todas a la vez. Apenas pisaron la arena, las gaviotas los rodearon muy enojadas: creían que venían a llevarse sus huevos.',
          options: [
            { emoji: '🗿', label: 'Quedarse quieto como una estatua', trait: 'valentia',
              outcome: 'Bruno se quedó quieto como una estatua, aunque una gaviota le gritaba en la oreja. —Que nadie se mueva —susurró—. Si no las asustamos, se calman. Fue difícil, porque otra le picoteaba el cordón de la zapatilla, pero aguantó. Después de un minuto, las gaviotas se tranquilizaron y volvieron a sus nidos.',
              memory: 'aguantó quieto rodeado de gaviotas' },
            { emoji: '🐟', label: 'Compartir las sardinas de Olivia', trait: 'amistad',
              outcome: 'Olivia tenía una canasta con sardinas para el almuerzo. Bruno le preguntó si podían compartirlas, y las tiró lejos de los nidos. Las gaviotas, felices, se olvidaron de ellos. Una gaviota grande se quedó al lado de Bruno y, de agradecida, lo acompañó el resto de la aventura.',
              memory: 'se hizo amigo de una gaviota' },
            { emoji: '🪧', label: 'Escribir en la arena «Venimos en paz»', trait: 'ingenio',
              outcome: 'Bruno escribió en la arena, con letras gigantes: VENIMOS EN PAZ. No sabía si las gaviotas sabían leer, pero la más vieja se paró sobre las letras, las miró un rato largo... y les graznó algo a las demás. Todas se calmaron. Perlita no lo podía creer: —¡Sabían leer!',
              memory: 'les escribió un mensaje gigante a las gaviotas' }
          ] },
        { id: 'p-tormenta',
          situation: 'En el medio del mar, el viento empezó a soplar fuerte y el barquito se movía de un lado a otro como una hamaca. Las olas eran cada vez más altas. Popeye agarró el timón, pero sin su espinaca le costaba muchísimo.',
          options: [
            { emoji: '🧭', label: 'Tomar el timón junto a Popeye', trait: 'valentia',
              outcome: 'Bruno se puso al lado de Popeye y agarró el timón con las dos manos. —¡Fuerza, grumete! —gritó Popeye. Juntos, empujando contra el viento, mantuvieron el barco derecho, ola tras ola, hasta que salieron de la tormenta. Popeye le dio una palmada: —¡Tenés brazos de marinero, Bruno!',
              memory: 'manejó el timón en la tormenta junto a Popeye' },
            { emoji: '⚓', label: 'Repartir tareas a todo el equipo', trait: 'equipo',
              outcome: 'Bruno dio órdenes como un capitán: Olivia a las velas, Amy a sacar agua con un balde, Perlita a iluminar las olas con una perla, y él a avisarle a Popeye cuándo venía la ola grande. Cada uno hizo su parte, y el barquito cruzó la tormenta como un corcho valiente.',
              memory: 'fue el capitán del barco en la tormenta' },
            { emoji: '🌀', label: 'Buscar el ojo de la tormenta', trait: 'ingenio',
              outcome: 'Bruno se acordó de algo que había leído: en el medio de algunas tormentas hay un lugar tranquilo, el ojo. Miró las nubes, vio hacia dónde giraban y señaló: —¡Por allá! Navegaron hacia el centro y, de golpe, el mar quedó liso como un espejo y el sol asomó por un agujerito entre las nubes.',
              memory: 'encontró el ojo de la tormenta' }
          ] },
        { id: 'p-cocoliso',
          situation: 'De repente, Olivia gritó: —¡Cocoliso! El bebé se había escapado gateando, como siempre, y estaba adentro de una caja de madera que flotaba hacia los barcos grandes. Si no lo alcanzaban rápido, iba a terminar del otro lado del puerto.',
          options: [
            { emoji: '🏃', label: 'Correr de barco en barco para alcanzarlo', trait: 'valentia',
              outcome: 'Bruno corrió por el muelle, saltó a un barco, de ese a otro y de ahí a un bote de remos. Amy le avisaba: «¡Más a la izquierda!». Llegó justo cuando la caja chocaba suavecito contra una boya y alzó a Cocoliso, que se reía como si fuera el mejor juego del mundo.',
              memory: 'rescató a Cocoliso saltando de barco en barco' },
            { emoji: '🪝', label: 'Usar una soga con gancho', trait: 'ingenio',
              outcome: 'Bruno vio una soga con un gancho enrollada en el muelle. Midió la distancia con la vista, hizo girar la soga como un lazo de vaquero y la lanzó. ¡El gancho se enganchó en la caja al primer intento! Tiró despacito y trajo a Cocoliso, sano y salvo, a los brazos de Olivia.',
              memory: 'rescató a Cocoliso con una soga y un gancho' },
            { emoji: '🤝', label: 'Pedir ayuda a los pescadores', trait: 'equipo',
              outcome: 'Bruno les gritó a los pescadores del muelle, que conocían el agua mejor que nadie. Entre todos pusieron sus botes uno al lado del otro, como un puente. La caja de Cocoliso chocó suavecito contra el último bote y Bruno lo sacó en brazos. Los pescadores aplaudieron con sus gorras.',
              memory: 'armó un puente de botes con los pescadores' }
          ] }
      ],
      climaxes: [
        { id: 'p-barco',
          situation: 'Encontraron a Brutus en la cubierta de su barco, un barco negro con una bandera que tenía dibujada su propia cara. Tenía {meta} a su lado y se reía a carcajadas. —¡El puerto es mío! —tronó, sacando pecho—. ¿Qué va a hacer un chico flaquito contra Brutus? Popeye, sin espinaca, estaba débil. Todos miraron a Bruno.',
          options: [
            { emoji: '🥬', label: 'Conseguirle espinaca a Popeye', trait: 'ingenio',
              outcome: 'Bruno pensó rápido: «Popeye sin espinaca es como un auto sin nafta». Y vio que en una maceta del barco de Brutus... ¡había espinaca! Brutus la plantaba para que nadie más la tuviera. Bruno se escabulló con Perlita, cortó un manojo y se lo tiró a Popeye. Popeye se lo comió y sus brazos se inflaron. Brutus, con los ojos como platos, devolvió {meta} antes de que Popeye tuviera que hacer nada.' },
            { emoji: '🦁', label: 'Plantarse frente a Brutus', trait: 'valentia',
              outcome: 'Bruno se subió a un barril para quedar a la altura de Brutus y le dijo, mirándolo a los ojos: —No sos dueño del puerto. El puerto es de todos. Brutus se rió... pero después vio que detrás de Bruno estaban Amy, Perlita, Olivia, Popeye y todos los vecinos del muelle. Bajó la mirada, refunfuñó algo y devolvió {meta}.' },
            { emoji: '💛', label: 'Preguntarle a Brutus qué le pasa', trait: 'amistad',
              outcome: 'Bruno le preguntó: —¿Por qué siempre querés todo para vos? Brutus se quedó callado. —Porque nadie me elige nunca —dijo al final—. Todos quieren a Popeye. Bruno le propuso que se sumara a la tripulación del puerto, como ayudante del faro, para que todos lo conocieran de verdad. Brutus dudó, se rascó la barba y devolvió {meta}, sonriendo por primera vez.' }
          ] },
        { id: 'p-lancha',
          situation: 'Brutus escapaba en su lancha con {meta} y les llevaba mucha ventaja. Popeye remaba con todas sus fuerzas, pero no alcanzaba. —¡Nunca me van a agarrar! —gritaba Brutus desde lejos.',
          options: [
            { emoji: '🛡️', label: 'Remar todos al mismo ritmo', trait: 'equipo',
              outcome: 'Bruno se dio cuenta de que cada uno remaba a su manera y el bote iba en zigzag. —¡Todos al mismo tiempo! —gritó—. ¡Uno, dos! ¡Uno, dos! Popeye, Olivia, Amy y Perlita le siguieron el ritmo y el bote salió disparado como una flecha. Alcanzaron a Brutus, que se quedó tan sorprendido que entregó {meta} sin chistar.' },
            { emoji: '⛵', label: 'Hacer una vela con el pañuelo de Olivia', trait: 'ingenio',
              outcome: 'Bruno miró al cielo: el viento soplaba justo hacia donde iba Brutus. —¡Olivia, tu pañuelo grande! —pidió. Lo ataron a un remo parado y lo usaron de vela. El bote empezó a volar sobre el agua y Brutus no entendía cómo un bote de remos lo estaba alcanzando. Cuando lo rodearon, devolvió {meta}, avergonzado.' },
            { emoji: '🗣️', label: 'Gritarle la verdad a Brutus', trait: 'honestidad',
              outcome: 'Bruno se paró en la punta del bote y gritó con todas sus fuerzas: —¡Brutus! ¡Si te llevás {meta}, todo el puerto va a sufrir, y vos también vivís acá! El viento llevó sus palabras hasta la lancha. Brutus frenó y se quedó pensando. Era verdad: su casa también estaba en el puerto. Dio la vuelta y devolvió {meta}, sin decir nada pero con la cara colorada.' }
          ] }
      ]
    }
  ];

  var MODES = [
    { id: 'sorpresa', name: '¡Sorprendeme!', emoji: '🎲', tagline: 'Un mundo al azar... o un multiverso', colors: ['#ff6ec7', '#7b5cff'] },
    { id: 'multiverso', name: 'Multiverso', emoji: '🌀', tagline: 'Un portal mezcla dos mundos en la misma aventura', colors: ['#7b5cff', '#00e0c6'] }
  ];

  var LENGTHS = {
    corto: { label: 'Corto', emoji: '🐇', desc: '2 decisiones · unos 3 minutos', decisions: 2 },
    mediano: { label: 'Mediano', emoji: '🦊', desc: '3 decisiones · unos 6 minutos', decisions: 3 },
    largo: { label: 'Largo', emoji: '🐉', desc: '3 decisiones · capítulos · unos 10 minutos', decisions: 3 }
  };

  return {
    TRAITS: TRAITS,
    COMPANIONS: COMPANIONS,
    PEARL_COLORS: PEARL_COLORS,
    OBJECTS: OBJECTS,
    OPENINGS: OPENINGS,
    ARRIVALS: ARRIVALS,
    OBJECT_LINES: OBJECT_LINES,
    PROMPTS: PROMPTS,
    HUDDLES: HUDDLES,
    BANTER: BANTER,
    TRAVEL: TRAVEL,
    TWISTS: TWISTS,
    CELEBRATIONS: CELEBRATIONS,
    RETURNS: RETURNS,
    CLOSINGS: CLOSINGS,
    MEMORY_LINES: MEMORY_LINES,
    MEMORY_LINES_2: MEMORY_LINES_2,
    LESSONS: LESSONS,
    CHAPTER_TITLES: CHAPTER_TITLES,
    MULTIVERSE: MULTIVERSE,
    GENERIC_CHALLENGES: GENERIC_CHALLENGES,
    GENERIC_CLIMAXES: GENERIC_CLIMAXES,
    WORLDS: WORLDS,
    MODES: MODES,
    LENGTHS: LENGTHS
  };
});
