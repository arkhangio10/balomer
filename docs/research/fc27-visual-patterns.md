# Balomer debe mostrar lo que FC 27 esconde

Lo que en octubre de 2026 se llama "FIFA 2027" es en realidad **EA SPORTS FC 27**. Electronic Arts lo lanzó el **25 de septiembre de 2026**, con acceso anticipado desde el 18 ([Sortiraparis](https://www.sortiraparis.com/en/what-to-do-in-paris/gaming/articles/349429-ea-sports-fc-27-release-date-cover-art-featuring-mbappe-and-bellingham-new-features-and-platforms); [EA Pitch Notes FC 27](https://www.ea.com/games/ea-sports-fc/fc-27/news/pitch-notes-fc27-gameplay-deep-dive)). EA perdió el nombre FIFA en 2023, y el único juego con esa marca en este ciclo, "FIFA World Cup: Launch Edition" de Netflix, recibió 1/5 en VGC ([VGC](https://www.videogameschronicle.com/review/fifa-world-cup-review/)), así que no sirve como referencia. FC 27 presenta el partido con un HUD **modular en el que casi todo se puede apagar**: un marcador con reloj y una franja desplegable, un radar 2D o 3D con colores a elección y un indicador sobre el jugador que **se desvanece a medida que baja su resistencia**. Frente a FC 26, sus únicos cambios visuales documentados son el color personalizado por compañero y los menús opacos de alto contraste ([EA Accessibility – FC 27](https://www.ea.com/able/resources/ea-sports-fc/fc-27)). En el tiro libre, el juego muestra la intención y oculta el cálculo. Hay una línea de trayectoria corta a propósito, un punto de contacto sobre el balón, una barra de potencia y una etiqueta con el tipo de disparo, pero no se muestran distancia, ángulo ni probabilidad ([EA Help](https://help.ea.com/en/articles/ea-sports-fc/free-kicks/)). Las transmisiones de TV hacen lo opuesto: dibujan sobre el césped el círculo de 9,15 m, la distancia al arco y la velocidad del remate ([PIERO Live](https://documentation.rossvideo.com/files/Brochures/Graphics%20Systems/PIERO/Piero_Live_Brochure.pdf)). Las métricas esperan detrás de la pausa, en pantallas con pestañas que combinan xG, posesión a lo largo del tiempo, mapas de calor y una calificación de 0 a 10 que se desglosa por grupos. No existe una barra de momentum. Para Balomer, la **gramática** se puede usar libremente porque son ideas y funciones: radar cenital, capas persistente, transitoria y de reporte, pestañas, desglose explicable y geometría del balón parado. El **arte, los nombres y las tipografías** de EA, de las ligas y de los proveedores de TV no se pueden usar. La oportunidad más clara es invertir la lógica del juego y mostrar los números que FC 27 esconde, admitiendo que una sola cámara fija no mide la altura del balón. Ninguna fuente de texto describe posiciones, colores ni tiempos de animación exactos del HUD de FC 27. Por eso conviene diseñar Balomer a partir de la función y no de capturas de pantalla, que además es lo más seguro legalmente.

## FC 27 apila módulos desactivables sobre el HUD que heredó de FC 26

FC 27 salió para PS5, PS4, Xbox Series X|S, Xbox One, PC, Switch y Switch 2. Su gran novedad es un modo de juego, The Grounds, no una nueva presentación del partido ([Khaleej Times](https://www.khaleejtimes.com/entertainment/gaming/ea-fc-27-launch-better-gameplay-new-mode); [EA SPORTS FC 27](https://www.ea.com/games/ea-sports-fc/fc-27)). La crítica lo resume como "una mejora, no una revolución" ([Operation Sports](https://www.operationsports.com/ea-fc-27-review-an-upgrade-not-a-revolution/)), y se divide sobre la interfaz. Insider Gaming dice que la UI y los menús "siguen siendo un desastre inconexo", con textos que a veces se superponen o desaparecen, y lo atribuye a que "el foco está en la jugabilidad" ([Insider Gaming](https://insider-gaming.com/reviews/ea-sports-fc-27-review/)). Operation Sports, en cambio, califica la presentación de "excelente" sin dar detalles. FC 27 no es un modelo de pulido visual. Lo que le sirve a Balomer es cómo organiza la información.

Esa organización se ve mejor en la documentación de accesibilidad de EA, que lista cada módulo del HUD como un interruptor independiente ([EA Accessibility – FC 27](https://www.ea.com/able/resources/ea-sports-fc/fc-27)). Los módulos son estos:

- **Score Clock**: marcador, reloj y escudo. Se puede apagar.
- **Score Clock Dropdown**: franja opcional bajo el marcador con "información extra".
- **Radar**: 2D, 3D o apagado, con un color para el equipo propio y otro para el rival.
- **Indicador del jugador controlado**: tiene tres tamaños y **se desvanece cuando cae la resistencia**. La novedad de FC 27 es que acepta un color distinto por compañero.
- **Otros elementos**: íconos de PlayStyles+ sobre la cabeza, marca del siguiente jugador al que se cambiará al defender, ayudas visuales de precisión en pases y tiros, una **trayectoria del tiro de esquina** y escenas en primera persona para tarjetas, balón parado, goles y atajadas.

La lista de FC 26 agrega las alineaciones que se desplazan al inicio del partido, las notificaciones de sugerencias tácticas, una "Tactical Chalkboard" y las "HyperMotion Insight Overlays" ([FIFPlay](https://www.fifplay.com/fc-26-game-settings/)). Dos rasgos llaman la atención. Primero, no hay barra de resistencia: **la variable continua se codifica en la opacidad de un marcador que ya existe**. Segundo, la comunidad competitiva recomienda apagar la franja desplegable, las alineaciones y los overlays para distraerse menos ([FUTWIZ](https://x.com/FUTWIZ/status/1837468152839430470)).

El único lenguaje visual documentado es el de la identidad de marca de 2023, no el del HUD. La dirigió Uncommon Creative Studio, Buck hizo el sistema de movimiento y F37 Foundry diseñó las tipografías ([It's Nice That](https://www.itsnicethat.com/news/uncommon-creative-studio-ea-sports-fc-graphic-design-130423)). La identidad tiene un **triángulo invertido** tomado del marcador que flota sobre cada jugador, una retícula isométrica y una paleta base **Boot Black y Chalk White** con acentos **Pitch Green y Forest Green**, sin valores hexadecimales publicados. Usa dos familias tipográficas propias: una sans inspirada en el giro de Cruyff y una serif inspirada en Marta ([Creative Boom](https://www.creativeboom.com/inspiration/uncommon-creates-triangle-based-identity-for-ea-sports-fc/)). Dentro del juego, los menús usan por defecto **mosaicos translúcidos**, y la opción High Contrast Menus los vuelve opacos ([EA Accessibility – FC 27](https://www.ea.com/able/resources/ea-sports-fc/fc-27)). Durante el partido, el marcador de las competiciones con licencia reproduce el paquete gráfico real de cada liga. FC 27 incluye la Premier League, la WSL, LALIGA, la Arkema Première Ligue y la NWSL "con presentación de transmisión de la liga" ([EA – FC 27 Authenticity](https://www.ea.com/games/ea-sports-fc/fc-27/news/fc-27-authenticity)). Un aviso de empleo de EA, citado por un agregador, describe el trabajo de UI como replicar overlays de transmisión auténticos ([designproject.io](https://designproject.io/jobs/technical-interface-designer-ea-sports-fc-at-electronic-arts-kpwb46)). Así, la estética del marcador cambia según la competición y pertenece a cada liga.

Juntando estas piezas sale un modelo de tres capas útil para Balomer:

- **Capa persistente**: marcador y reloj.
- **Capa transitoria por evento**: franja desplegable, notificaciones y alineaciones al inicio.
- **Capa cinemática**: escenas en primera persona, repeticiones y celebraciones.

Balomer ya tiene equivalentes directos de las dos primeras: el radar y el panel de estadísticas, y las alertas de los minutos 15, 30, 60 y 75. La capa cinemática la reemplaza con los reportes de medio tiempo y final, porque el video nunca sale del dispositivo local. Hay un vacío que conviene declarar. Ninguna fuente consultada da la posición, el tamaño, la forma, los colores ni las curvas de animación del marcador o del radar de FC 27, ni de sus gráficos de sustitución, VAR y repetición. Por conocimiento previo de la serie, el marcador suele ir arriba a la izquierda y el radar abajo al centro, pero esto **no se verificó**.

## El tiro libre de FC 27 enseña la intención y oculta el cálculo

La gramática del balón parado no cambia desde **FIFA 23**, cuando EA quitó la retícula circular y puso en su lugar una línea de trayectoria ([Charlie INTEL](https://www.charlieintel.com/fifa-23/fifa-23-set-pieces-free-kicks-corners-penalties-188966/)). Tiene tres entradas y cada una da su propia respuesta visual:

- **Stick izquierdo**: orienta la **línea de dirección**.
- **Stick derecho**: elige el **punto de contacto** del botín con el balón. Ese punto define el efecto, la altura y la curva, y muestra una **etiqueta con el tipo de disparo**, como "curler" o "knuckleball".
- **Botón de tiro**: mantenerlo y soltarlo carga la **potencia**.

Un panel muestra además los atributos del cobrador. La guía oficial vigente lo explica en cinco pasos: elegir al cobrador, apuntar, decidir el contacto, fijar la potencia y "ver la trayectoria y ajustar el siguiente intento" ([EA Help](https://help.ea.com/en/articles/ea-sports-fc/free-kicks/)). Si se golpea el balón abajo y de costado, se eleva y se curva por encima de la barrera. Si se golpea arriba, va raso y puede pasar por debajo ([FUT.GG](https://fut.gg/news/fifa-23-guide-how-to-take-free-kicks)).

Lo decisivo es lo que el juego no muestra. La vista previa cubre **solo los primeros metros del vuelo** ([FUT.GG](https://fut.gg/news/fifa-23-guide-how-to-take-free-kicks)). La única forma de alargarla es el PlayStyle Dead Ball, que la extiende, o Dead Ball+, que la lleva al máximo ([EA Help](https://help.ea.com/en/articles/ea-sports-fc/free-kicks/); [FUTBIN](https://www.futbin.com/27/playstyles/dead-ball)). EA plantea el aprendizaje como ensayo y error. Según su guía, la combinación correcta "depende de tu distancia y ángulo respecto del arco", es decir, algo que el jugador debe juzgar, no un valor que aparezca en pantalla ([EA Help](https://help.ea.com/en/articles/ea-sports-fc/free-kicks/)). Ninguna fuente indica que FC 27 ni las ediciones anteriores muestren la distancia al arco o a la barrera, el ángulo, la velocidad o la probabilidad de gol, ni en el partido, ni en la práctica, ni en las repeticiones. Es una decisión de diseño: **al ocultar la física, leer la curva se vuelve la habilidad que el jugador debe dominar**.

Los cambios recientes refinan el sistema, pero no lo reinventan:

- **FC 26** eliminó el Timed Finishing, la segunda pulsación que las guías usaban para afinar el disparo, porque era difícil de equilibrar. A cambio ajustó las trayectorias de tiro libre ([EA Pitch Notes FC 26](https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive)). Por eso es probable que los consejos de la "zona verde" de las guías de FC 25 ya no sirvan, aunque ninguna fuente lo dice explícitamente para el balón parado.
- **FC 27, tiros de esquina**: después de elegir el destino, **la cámara se mueve hacia el área** y abre una ventana breve para mover a los atacantes. Para eso existe un comando nuevo, Avoidance (R1/RB). Los jugadores ya no se acomodan solos y los centros caen más en el espacio que en un compañero ([EA Pitch Notes FC 27](https://www.ea.com/games/ea-sports-fc/fc-27/news/pitch-notes-fc27-gameplay-deep-dive)).
- **FC 27, práctica**: estrenó una sesión dedicada a practicar tiros libres ([FIFPlay](https://www.fifplay.com/fc-27-practice-arena/)).
- **Sin confirmar**: Red Bull menciona "mejoras de precisión en tiros libres", pero las notas oficiales de EA no las incluyen ([Red Bull](https://www.redbull.com/au-en/ea-fc-27-most-exciting-improvements)).
- **Penales**: usan un **anillo de compostura** que se agranda y se achica, y el remate más preciso sale cuando el anillo está en su punto más pequeño. Esto está documentado para FIFA 23 y FC 24, pero no hay fuentes sobre FC 25 a 27 ([Charlie INTEL](https://www.charlieintel.com/fifa-23/fifa-23-set-pieces-free-kicks-corners-penalties-188966/)).

### La televisión sí calcula, y lo dibuja sobre el césped

Las transmisiones miden y muestran. Los sistemas de realidad aumentada calibran la cámara con las líneas de la cancha y dibujan gráficos anclados al césped:

- **Ross Video PIERO** incluye entre sus efectos el **círculo de tiro libre**, la **distancia al arco**, un arco cenital del arco y "velocidad y distancia". Su algoritmo de seguimiento, desarrollado con BBC R&D, hace que los gráficos "sigan pegados al juego cuando la cámara se mueve" ([PIERO Live](https://documentation.rossvideo.com/files/Brochures/Graphics%20Systems/PIERO/Piero_Live_Brochure.pdf); [PIERO Broadcast](https://documentation.rossvideo.com/files/Brochures/Graphics%20Systems/PIERO/Piero_Broadcast_Brochure.pdf)).
- **Vizrt Viz Arena** ofrece "líneas de fuera de lugar y distancia de tiro libre" ([Vizrt](https://routing.vizrt.com/products/viz-arena-update/)).

El círculo representa una regla del juego: los rivales deben quedar a **9,15 m** del balón hasta que esté en juego ([The FA – Regla 13](https://www.thefa.com/-/media/files/thefaportal/governance-docs/laws-of-the-game/2026-27/law-13---free-kicks.ashx)). Las cifras en vivo vienen del seguimiento óptico. Second Spectrum registra posiciones **25 veces por segundo** para la Premier League ([Trusted Reviews](https://www.trustedreviews.com/news/premier-league-tv-coverage-set-for-real-time-stats-revolution-thanks-to-skeletal-tracking-tech-4277923)). La Bundesliga publica dos métricas con AWS:

- **Shot Speed**: mide la velocidad máxima justo después del golpe y la destaca cuando el remate supera los **100 km/h** ([SVG](https://www.sportsvideo.org/2023/11/03/dfl-aws-add-new-shot-speed-stat-to-bundesliga-match-facts/)).
- **Set Piece Threat**: compara el peligro de un equipo en tiros libres y de esquina con el promedio de la liga, y se muestra **antes** del cobro ([Bundesliga.com](https://www.bundesliga.com/en/bundesliga/news/dfl-and-aws-add-set-piece-threat-and-skill-match-facts-19067)).

No se encontró ningún gráfico emitido en vivo, confirmado, con el xG de un tiro libre ni con la distancia de la barrera en metros.

Balomer trabaja con una cámara fija, una homografía del plano del césped y coordenadas 2D. Con eso puede producir cinco elementos deterministas, que el agente nunca tendría que inventar:

1. El **círculo de 9,15 m** dibujado en el radar alrededor del balón.
2. La **distancia al arco** desde el punto del cobro.
3. El **ángulo** que cubren los postes desde ese punto.
4. La **distancia medida hasta la barrera**, comparada con 9,15 m.
5. Un **trazo posterior** del recorrido del balón, construido con posiciones pasadas como propone el artículo Smart Director ([arXiv 2201.04024](https://arxiv.org/pdf/2201.04024)), no una predicción.

A esto se puede sumar una tasa de peligro en balón parado frente a una línea base propia, mostrada antes del cobro. Hay dos matices. Primero, un estudio de 1624 tiros libres de la Bundesliga no encontró ventaja estadística para la defensa cuando la barrera estaba a menos de 9,15 m ([BISp SURF](https://www.bisp-surf.de/Record/PU201612008805)). La distancia de la barrera es un dato vistoso, pero su valor táctico es discutible. Segundo, una homografía del suelo **no mide la altura**. No se puede reconstruir con honestidad el arco del balón sobre la barrera, y cualquier velocidad es la de su proyección sobre el césped, limitada además por los cuadros por segundo de la cámara. Conviene rotularla como "velocidad horizontal aproximada" u omitirla.

## Las métricas de FC 27 esperan detrás de la pausa, ordenadas en pestañas

Durante el juego, FC muestra muy pocos números:

- **Calificación en vivo**: la única confirmada aparece junto a la barra de nombre, en los modos en que se controla a un solo futbolista (Clubs y Player Career de FC 26) ([EA Pitch Notes FC 26](https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive)).
- **PlayStyles+**: sus íconos **brillan** cuando se activan (misma fuente).
- **Resistencia**: se ve en el desvanecimiento del indicador.
- **HyperMotion Insight Overlays**: gráficos de realidad aumentada que aparecen "durante las pausas del juego" ([fifauteam FC 25](https://fifauteam.com/fc-25-stats-match-facts-performance/); [FIFPlay](https://www.fifplay.com/fc-26-game-settings/)). Descienden de las repeticiones de FIFA 23, que superponían xG, potencia y distancia del disparo ([EA FIFA 23](https://ea.com/games/fifa/fifa-23/hypermotion2)).

Ninguna edición tiene una barra de momentum ni un contador de xG en vivo. Las gráficas de momentum conocidas son de Sofascore, Flashscore y Veo, no de EA. Por ejemplo, la de Flashscore dibuja una barra por minuto cuya altura es la probabilidad de gol de ese minuto ([Sofascore](https://www.sofascore.com/es/news/how-sofascores-attack-momentum-changed-sport-analysis); [Flashscore](https://www.flashscore.com/news/momentum/W82o7eCa/)). Las notas oficiales de FC 27 no tratan la presentación de estadísticas, y una guía de la comunidad afirma que no se anunciaron cambios ([fifauteam FC 27](https://fifauteam.com/fc-27-stats/)).

El análisis vive en dos pantallas que se abren desde la pausa y al final del partido: **Match Facts**, por equipo, y **Performance**, por jugador. Ambas se dividen en pestañas (Resumen, Posesión, Tiro, Pase, Defensa, Eventos y, para jugadores, Arquero) que se recorren con L1/LB y R1/RB ([fifauteam FC 27](https://fifauteam.com/fc-27-stats/)).

En Match Facts ([fifauteam FC 25](https://fifauteam.com/fc-25-stats-match-facts-performance/)):

- **Resumen**: posesión, tiempo de recuperación del balón, tiros, **goles esperados**, pases, entradas, intercepciones, faltas, tiros de esquina y cuatro medidas de líneas superadas.
- **Posesión**: incluye la **posesión a lo largo del tiempo**, la única serie temporal del juego, y mapas de calor de posesión total, ganada y perdida.
- **Tiro y Pase**: desglosan por tipo, distancia y dirección, y usan **mapas por zonas** en vez de marcar cada tiro como un punto.

En Performance, el Resumen empieza con el **Jugador del Partido** y la calificación, y compara cada estadística **con el promedio del equipo**: distancia recorrida, distancia en sprint y un mapa de calor de posición, entre otras. Las pestañas siguientes agregan xG sin penales, asistencias esperadas y pases bajo presión ([fifauteam FC 27](https://fifauteam.com/fc-27-stats/)). Esta estructura nació con la renovación de FIFA 22, que además introdujo el xG ([RealSport101](https://realsport101.com/article/fifa-22-deeper-match-analysis-will-revamp-your-player-performance-gameplay-pitch-notes)).

El patrón más valioso es la explicabilidad. Desde FC 26, la calificación de 0 a 10 depende del **rol activo**: un creador de juego y un volante mixto en la misma posición se califican distinto. La calificación se arma con grupos ponderados (arquero, defensa, regate, tiro, pase y resultados del equipo), y la pantalla de Performance muestra cuánto aporta cada grupo al total ([EA Pitch Notes FC 26](https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive)). La alianza de EA con Stats Perform (Opta), anunciada en 2023, alimenta las valoraciones de los jugadores y los PlayStyles, no las estadísticas del partido. Las etiquetas de esas estadísticas son genéricas, como "Expected Goals" ([SVG Europe](https://www.svgeurope.org/blog/headlines/electronic-arts-turn-to-stats-perform-to-bring-real-world-data-into-fc24/)).

La tabla siguiente traduce cada patrón al caso de Balomer. La columna derecha es inferencia propia, basada en las restricciones del proyecto: solo coordenadas, D-pad, el agente redacta texto y nunca genera números.

| Patrón de FC 27 | Qué resuelve | Versión para Balomer |
|---|---|---|
| Marcador fijo con franja desplegable | Jerarquía entre lo permanente y lo puntual | Barra compacta fija con una franja inferior para las alertas de minuto |
| Radar 2D con colores a elección | Lectura táctica rápida | El radar es el producto; cada equipo ocupa una posición fija de la paleta |
| Indicador que se desvanece con la resistencia | Variable continua sin agregar otra barra | La `opacity` del punto codifica, por ejemplo, la confianza del seguimiento |
| Overlays de datos solo en las pausas | Números que no distraen | Métricas dentro de las alertas de 15', 30', 60' y 75', y en el medio tiempo |
| Pestañas con el Resumen primero | Exploración bajo demanda | Reporte de medio tiempo con pestañas que se recorren con D-pad izquierda y derecha |
| Posesión a lo largo del tiempo | Única línea de tiempo del juego | "Territorio por minuto" en barras divergentes, un diferenciador que FC no tiene |
| Calificación por rol con desglose | Explicar el número | Cada recomendación muestra la métrica que la respalda |
| Comparación con el promedio del equipo | Contexto sin datos de referencia externos | Comparación con el primer tiempo o con una línea base propia |
| Mapas por zonas y mapas de calor | Dónde ocurrió | Mapa de calor por celdas (por ejemplo, 12×8) con 4 o 5 tonos discretos |

Lo que Balomer no debe copiar es la calificación individual de 0 a 10 ni el xG. Sin un modelo de eventos propio, ninguno de los dos se puede justificar solo con coordenadas. Si algún día se muestra un xG, debe venir de un modelo propio, estar rotulado como tal y no sugerir que equivale al de Opta.

## La ley protege el arte y los nombres, no el radar ni la barra de posesión

Esta sección resume fuentes legales y no es asesoría legal.

**Estados Unidos.** Las ideas, las reglas y los métodos de operación son libres:

- En *Lotus v. Borland*, una jerarquía de menús se consideró un "método de operación" que no se puede proteger.
- En *Apple v. Microsoft*, el tribunal separó la interfaz en sus elementos y descartó los que no se pueden proteger. Donde la protección era "delgada", exigió que la copia fuera prácticamente idéntica para considerarla infracción ([WilmerHale](http://www.wilmerhale.com/insights/publications/protecting-a-companys-graphical-user-interface-may-6-2002)).
- En *Incredible Technologies v. Virtual Technologies*, se negó la medida cautelar aunque el demandado había visto y copiado el material, porque los elementos eran funcionales ([WSGR](https://www.wsgr.com/publications/PDFSearch/IncrediblevGlobalVRappeal.pdf)).

El límite lo marca *Tetris Holding v. Xio Interactive* (2012). Las reglas del juego eran libres, pero copiar toda su apariencia audiovisual infringió los derechos de autor y la imagen comercial (*trade dress*). El color y el estilo de las piezas eran "adornos arbitrarios" sin relación con su función ([Loeb & Loeb](https://www.loeb.com/en/insights/publications/2012/06/tetris-holding-llc-v-xio-interactive-inc)).

**Unión Europea.** El caso *BSA* (C-393/09) admite que una interfaz gráfica se proteja como obra si es una creación intelectual propia de su autor. Excluye los componentes que solo se distinguen por su función técnica ([Fieldfisher](https://www.fieldfisher.com/en/insights/graphical-user-interfaces-can-be-protected-by-copyright-rules-european-court)).

**Marcas y tipografías.** Las marcas protegen nombres y logotipos ([USPTO](https://www.uspto.gov/trademarks/basics/trademark-patent-copyright)). En Estados Unidos, el diseño de una tipografía en general no se puede registrar, pero el software de la fuente sí está protegido ([National Law Review](https://natlawreview.com/node/89245/printable/pdf)). Además, las patentes de diseño pueden cubrir íconos y tipografías ([WilmerHale](http://www.wilmerhale.com/insights/publications/protecting-a-companys-graphical-user-interface-may-6-2002)).

| Patrón | Decisión | Motivo |
|---|---|---|
| Radar cenital 2D con puntos por equipo, línea defensiva, bloque (envolvente convexa o rectángulo), barra de posesión, mapa de calor por celdas, posiciones medias | Usar | Son tipos de gráfico y convenciones de análisis, es decir, ideas y funciones ([Vizrt Viz Libero](https://www.vizrt.com/products/viz-libero-teams/)) |
| Círculo de 9,15 m, distancia y ángulo al arco | Usar | Geometría que viene de las Reglas de Juego |
| Capas persistente, transitoria y de reporte; pestañas; foco con D-pad; alertas temporizadas; desglose de una calificación | Usar la estructura y dibujar todo desde cero | Patrones de interacción y métodos de operación |
| Panel de estadísticas lateral o en forma de "L" | Usar con estilo propio | Convención genérica de las transmisiones ([Broadcast Now](https://www.broadcastnow.co.uk/broadcasting/premier-league-productions-to-deliver-data-zone-broadcasts/5186505.article)) |
| Triángulo invertido como marcador, paleta Boot Black y Chalk White con los verdes de EA, retícula isométrica | Evitar | Es la identidad de marca de EA SPORTS FC |
| Tipografías de F37 para EA FC, o fuentes de transmisión sin licencia para incrustarlas | Evitar | Son fuentes a medida o con licencia ([F37 Foundry](https://f37foundry.com/custom-fonts/eafc)) |
| Nombres como EA SPORTS FC, FIFA, PlayStyles, Dead Ball, HyperMotion, Tactical Chalkboard, Match Facts, Match Momentum, Attack Momentum, Set Piece Threat, Shot Speed, Opta | No usarlos como nombres de funciones | Son marcas o nombres de producto |
| Capturas o clips de FC 27 o de transmisiones en la app, el README, el video de entrega o las diapositivas | Evitar | Son obras audiovisuales protegidas |
| Recrear el conjunto visual de FC 27 o de un canal, por ejemplo la paleta y las barras de Sky Sports | Evitar | Riesgo de copiar la apariencia completa y la imagen comercial, como en *Tetris* |

"Match Facts" es inglés genérico, pero usar una etiqueta propia evita parecer una imitación. No se verificó si "Match Momentum" es una marca registrada. Lo práctico es definir tokens de diseño propios para Balomer: un tablero oscuro, posiciones fijas de color para cada equipo, una pareja tipográfica propia y un lenguaje de formas propio. También conviene guardar en `docs/` una nota corta de procedencia del diseño, que liste las convenciones usadas como ideas genéricas y los recursos creados desde cero o con licencia abierta. Esa nota sirve además para el mini desafío de código abierto. Las licencias de candidatas como Inter, Barlow o Roboto **no se verificaron**. Quedan dos vacíos legales. No se encontró jurisprudencia sobre paquetes gráficos de transmisiones deportivas ni sobre HUDs de juegos deportivos. Tampoco se investigaron la normativa peruana, la Decisión 351 de la Comunidad Andina ni las reglas de propiedad intelectual del hackathon, que conviene revisar antes de enviar el proyecto.

## En un televisor, cada patrón prestado pasa por 96 píxeles de margen y 300 ms de entrada

Las guías de Fire TV, de 2020 y escritas para Fire OS, siguen siendo la referencia de diseño de Amazon ([Amazon Fire TV Design and UX Guidelines](https://developer.amazon.com/docs/fire-tv/design-and-user-experience-guidelines.html)):

- **Lienzo**: diseñar para 1920×1080.
- **Margen**: no poner nada interactivo ni texto en el 5% exterior de cada borde. En 1080p eso equivale a **96 px a los lados y 54 px arriba y abajo**.
- **Texto**: al menos 14sp, unos **28 px a 1080p**.
- **Color**: colores menos saturados y tonos fríos, porque el televisor exagera la saturación.

La página de foco de Vega, de septiembre de 2026, pide marcar el foco con un **cambio físico** (un borde, un cambio de tamaño o un elemento adicional) y no solo con color u opacidad, porque los cambios físicos siguen viéndose en el modo de alto contraste ([Vega Focus Management](https://developer.amazon.com/docs/vega/0.24/focus-management.html)). Si las animaciones se limitan a `transform` y `opacity`, la solución es un anillo dibujado de antemano cuya `opacity` aparece, junto con un `transform: scale`. Sirven como guía los valores por defecto de Android TV: 1,05 para elementos pequeños y 1,025 para paneles grandes ([Android TV Focus](https://developer.android.com/design/ui/tv/guides/styles/focus-system)). Animar `borderWidth` rompería la restricción.

En Vega, `useNativeDriver` es obligatorio para las animaciones de tipo `timing()` ([Vega Animated](https://developer.amazon.com/docs/react-native-vega/0.83/animated.html)). `hasTVPreferredFocus` y `TVFocusGuideView` o `setFocusRoot` sirven para dar el foco inicial y mantenerlo dentro del reporte de medio tiempo abierto. Quedan tres cosas por verificar en la documentación de Vega antes de fijar tamaños en código: si Vega usa como unidad de diseño píxeles (1920×1080) o dp (960×540), qué fuente del sistema trae y si las funciones de suavizado funcionan igual que en React Native.

Android TV recomienda evitar los fondos blancos, probar en el modo de imagen Estándar y no usar degradados, porque se ven en bandas en el televisor. Esto favorece rellenos sólidos y mapas de calor por celdas ([Android TV Color](https://developer.android.com/design/ui/tv/guides/foundations/color-on-tv)). Para los equipos, la paleta Okabe-Ito, pensada para personas con daltonismo, ofrece la pareja **naranja `#E69F00` contra celeste `#56B4E9`** ([ConceptViz](https://conceptviz.app/es/blog/okabe-ito-palette-hex-codes-complete-reference)). Un cálculo propio de esta investigación, no publicado, con la fórmula de contraste de WCAG y una simulación de daltonismo, da para ambos colores más de 8:1 sobre `#0E1116` y una buena separación entre ellos en los tres tipos de daltonismo. Sin embargo, su luminancia es casi idéntica, así que hace falta una segunda señal que no dependa del color. Por ejemplo, un equipo con puntos rellenos y el otro con anillos, como exige WCAG 1.4.1 ([WCAG 2.2](https://www.w3.org/TR/WCAG22/)). Conviene evitar el rojo contra el verde y asignar a cada equipo una posición fija de la paleta en lugar del color real de su camiseta, mostrando ese color solo como una pequeña muestra junto al nombre. Las propias opciones de accesibilidad de FC 27 sirven de lista de control: paneles opacos de respaldo, colores de equipo personalizables y filtros para daltonismo con intensidad ajustable.

Para el movimiento, Nielsen Norman Group recomienda duraciones de 100 a 500 ms ([NN/g](https://www.nngroup.com/articles/animation-duration/)):

- **Entrada**: unos 300 ms con desaceleración al final (ease-out).
- **Salida**: un poco más corta, de 200 a 250 ms.
- **Animaciones frecuentes**: cuanto más seguido aparecen, más breves deben ser.

Los rótulos inferiores de las transmisiones suelen durar entre 3 y 7 segundos ([Riverside](https://riverside.com/video-editor/video-editing-glossary/lower-third)). La guía de subtítulos de la BBC calcula entre 160 y 180 palabras por minuto, unos 0,3 s por palabra ([Clevercast](https://clevercast.com/bbc-subtitling-guidelines)). WCAG 2.2.2 exige poder pausar u ocultar el contenido que se mueve solo durante más de 5 segundos, y WCAG 2.3.1 prohíbe más de tres destellos por segundo ([WCAG 2.2](https://www.w3.org/TR/WCAG22/)). La tabla siguiente es una propuesta derivada de esas fuentes, no un estándar publicado. Los valores de desfase entre elementos no tienen fuente.

| Elemento | Entrada | Permanencia | Salida | Propiedades animadas |
|---|---|---|---|---|
| Foco con D-pad | 100–150 ms | Mientras tenga el foco | 100 ms | `scale` y `opacity` del anillo |
| Cambio de un valor numérico | 150–200 ms, fundido cruzado | Hasta la siguiente actualización | — | `opacity` entre dos capas de texto |
| Barra de posesión o de compacidad | 300–400 ms | — | — | `scaleX` desde un origen fijo |
| Alerta de minuto (15', 30', 60', 75') | 300 ms: `translateY` de 24 a 40 px más `opacity` | El mayor entre 5 s y (0,33 s × palabras + 2 s): de 6 a 7 s para 12 a 15 palabras | 200–250 ms | Ease-out al entrar, ease-in al salir |
| Tres recomendaciones del medio tiempo | 300 ms cada una, con 50–80 ms de desfase | Al ritmo de quien lee; nunca se cierra sola | 200 ms | Ease-out |
| Puntos del radar | Interpolación durante el intervalo de datos (100–200 ms a 5–10 Hz) | Continua | — | `translateX` y `translateY` |

Esto implica tres reglas concretas. La alerta se cierra con Atrás y queda guardada en un historial. El reporte de medio tiempo nunca se cierra solo. Un aviso urgente usa un solo pulso de escala (de 1,0 a 1,04 y de vuelta a 1,0), nunca un parpadeo de color. Las formas siguen la misma lógica:

- **Línea defensiva**: se mueve con `translateX`.
- **Bloque en vivo**: rectángulo envolvente, porque se anima con transformaciones sobre una caja unitaria.
- **Envolvente convexa**: solo para las figuras estáticas del reporte. Se calcula sin el arquero, como en la literatura académica ([arXiv 2204.02313](https://arxiv.org/pdf/2204.02313)).

## Conclusión

FC 27 y Balomer tienen contratos opuestos con quien mira la pantalla. El juego dosifica la información para que el jugador desarrolle una habilidad: muestra apenas el comienzo de la curva y deja la distancia y el ángulo a su criterio. El valor de Balomer, en cambio, es la medición en sí. Por eso lo que conviene tomar de FC 27 no es su estilo visual, que ni siquiera está bien documentado y que la crítica considera descuidado, sino su arquitectura de información. Esa arquitectura tiene tres capas jerárquicas, deja la exploración para el momento de pausa y explica la calificación por grupos. Esta última idea encaja con la regla del proyecto de que el agente redacta texto pero no genera números: cada recomendación del medio tiempo puede llevar adjunta la métrica determinista que la justifica.

Los dos diferenciadores que FC 27 no tiene, una línea de tiempo territorial por minuto y la geometría medida del balón parado, se calculan en el dispositivo local, salen de coordenadas y no requieren ningún nombre ajeno. Que falten especificaciones visuales exactas del HUD de FC 27 juega a favor: obliga a diseñar desde la función y las convenciones documentadas, que es justamente lo que protege frente al riesgo de copiar la apariencia completa del que advierte *Tetris*. Antes de fijar los tokens de diseño quedan tres verificaciones: las unidades de diseño y la fuente del sistema de Vega, la licencia de la tipografía elegida y las reglas de propiedad intelectual del hackathon.

## Glosario

- **HUD** (heads-up display) — capa de información superpuesta al partido: marcador, radar, indicadores.
- **Score bug / Score Clock** — marcador compacto con reloj que permanece en pantalla. Score Clock es el nombre que usa EA.
- **xG** (expected goals, goles esperados) — probabilidad de que un tiro termine en gol, sumada por equipo o por jugador.
- **xA** (expected assists, asistencias esperadas) — equivalente del xG aplicado al pase previo al tiro.
- **AR** (augmented reality, realidad aumentada) — gráficos anclados a la imagen real de la cancha.
- **D-pad** (directional pad) — cruceta direccional del control remoto o del mando.
- **PlayStyles / Dead Ball** — rasgos de jugador con marca de EA. Dead Ball alarga la vista previa de la trayectoria.
- **Timed Finishing** — segunda pulsación para afinar el disparo, eliminada en FC 26.
- **Anillo de compostura** — círculo que se agranda y se achica alrededor del balón en los penales de FIFA 23 y FC 24.
- **Homografía** — transformación que convierte píxeles de la cámara en coordenadas del plano de la cancha.
- **Envolvente convexa** (convex hull) — polígono mínimo que encierra a todos los jugadores de campo de un equipo.
- **Okabe-Ito** — paleta de ocho colores diseñada para que la distingan personas con daltonismo.
- **WCAG** (Web Content Accessibility Guidelines) — pautas de accesibilidad del W3C, versión 2.2.
- **sp / dp** (scale-independent pixels / density-independent pixels) — unidades de tamaño de Android que también usan las guías de Fire TV.
- **Overscan / zona segura** — borde de la imagen que algunos televisores recortan. Por eso se deja libre el 5% exterior.
- **Trade dress** (imagen comercial) — protección de la apariencia distintiva y no funcional de un producto.
- **Ease-out / ease-in** — curvas de animación que desaceleran al final o aceleran al inicio.
- **Native driver** (`useNativeDriver`) — modo en que la animación se ejecuta en el hilo nativo, no en JavaScript.
- **Vega OS** — sistema operativo de Amazon para Fire TV en el que corre la app de Balomer.
- **Opta / Stats Perform** — proveedor de datos deportivos que alimenta las valoraciones de jugadores de EA.
- **Second Spectrum** — proveedor de seguimiento óptico de la Premier League.
- **PIERO / Viz Arena** — sistemas comerciales de gráficos de realidad aumentada para transmisiones deportivas.
- **L-bar / rótulo inferior** — panel de estadísticas en forma de "L" o franja inferior con texto en una transmisión.
- **Match Facts / Performance** — pantallas de estadísticas por equipo y por jugador de EA FC.

## Fuentes

- Notas de investigación usadas como base:
  - [hud_design_language.md](notes/hud_design_language.md)
  - [set_pieces_free_kicks.md](notes/set_pieces_free_kicks.md)
  - [match_player_metrics.md](notes/match_player_metrics.md)
  - [tv_adaptation_and_limits.md](notes/tv_adaptation_and_limits.md)
- Fuentes primarias de EA:
  - [EA Accessibility – FC 27](https://www.ea.com/able/resources/ea-sports-fc/fc-27)
  - [EA Pitch Notes FC 27](https://www.ea.com/games/ea-sports-fc/fc-27/news/pitch-notes-fc27-gameplay-deep-dive)
  - [EA Pitch Notes FC 26](https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive)
  - [EA Help – tiros libres](https://help.ea.com/en/articles/ea-sports-fc/free-kicks/)
- Fuentes primarias de Amazon y de estándares:
  - [Fire TV Design and UX Guidelines](https://developer.amazon.com/docs/fire-tv/design-and-user-experience-guidelines.html)
  - [Vega Focus Management](https://developer.amazon.com/docs/vega/0.24/focus-management.html)
  - [Vega Animated](https://developer.amazon.com/docs/react-native-vega/0.83/animated.html)
  - [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- Las demás URL se citan en línea en cada sección.
- Inferencia: la tabla de equivalencias para Balomer, la tabla de tiempos de animación y la elección de un rectángulo para el bloque en vivo y de la envolvente para los reportes vienen de los autores de las notas y de este informe. Se basan en las fuentes citadas y en las restricciones de `CLAUDE.md`, no en un estándar publicado.
- Inferencia: los contrastes y la separación bajo daltonismo de la pareja naranja contra celeste salen de un cálculo hecho durante la investigación. No se verificaron en un televisor real.
- Sin verificar: la posición y el aspecto exactos del marcador y del radar de FC 27; el estado de los penales en FC 25 a 27; la "mejora de precisión" de los tiros libres en FC 27; las unidades de diseño y la fuente del sistema de Vega; las reglas de propiedad intelectual del hackathon.
