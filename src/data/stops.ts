import type { Stop } from '../types'

/**
 * Paragens do TUPR, transcritas do PDF oficial "horarios_tupr_2025.pdf" (CM Peso da Régua).
 *
 * - `name` / `detail` seguem o texto do PDF (detail = a indicação entre parênteses).
 * - O PDF NÃO inclui coordenadas. As coordenadas (`coords`) são APROXIMADAS e foram
 *   obtidas das paragens "bus_stop" com nomes equivalentes no OpenStreetMap (© colaboradores
 *   do OpenStreetMap, licença ODbL). Servem apenas para o mapa — nunca para horários.
 * - Paragem sem `coords` (ex.: "Cruzamento da Casa do Povo de Godim") não tem posição fiável
 *   e não é desenhada no mapa.
 * - AMBIGUIDADE: o PDF não indica o lado da via. Paragens com o mesmo nome E a mesma indicação
 *   nas duas linhas (ex.: "Lrg. da Estação") foram unificadas numa só paragem; as restantes
 *   (ex.: "Av. Dr. Manuel de Arriaga" sem indicação, em cada linha) mantêm-se separadas.
 */
export const stops: Stop[] = [
  { id: "fab", name: "R. Fernando Augusto Bandeira", detail: "entre a Rtd. Baden Powell e Prç. Renato Aguiar", coords: [41.16604, -7.79539], },
  { id: "estacao", name: "Lrg. da Estação", coords: [41.15834, -7.784], },
  { id: "ponte", name: "Rtd. da Ponte", coords: [41.15615, -7.779], },
  { id: "jac", name: "Av. Sacadura Cabral", detail: "Escola Sec. João de Araújo Correia", coords: [41.16344, -7.8028], },
  { id: "lous-mat", name: "R. da Lousada", detail: "antigo Matadouro Municipal", coords: [41.16827, -7.79701], },
  { id: "lous-inv", name: "R. da Lousada (INVERSÃO DE SENTIDO)", detail: "sentido oposto à EPDR do Rodo", coords: [41.1779, -7.79526], },
  { id: "lous-frente", name: "R. da Lousada", detail: "em frente à entrada para o Armazém 30", coords: [41.1725, -7.79633], },
  { id: "lous-caves", name: "R. da Lousada", detail: "em frente às Caves Vale do Rodo", coords: [41.16935, -7.79653], },
  { id: "alagoas-ce", name: "Centro Escolar das Alagoas", coords: [41.16731, -7.80082], },
  { id: "v-tondela", name: "R. de Tondela", detail: "junto às Oficinas Municipais", coords: [41.16743, -7.79616], },
  { id: "v-lous-cruz", name: "R. da Lousada", detail: "Cruzamento Armazém 30", coords: [41.17193, -7.79623], },
  { id: "v-lacerda-eb", name: "R. Prof. José Lacerda", detail: "junto B.º das Alagoas - Cruzamento Eb2,3", coords: [41.1676, -7.79844], },
  { id: "v-julio", name: "R. Dr. Júlio Vasques", detail: "Junta de Freguesia de Godim", coords: [41.1688, -7.80161], },
  { id: "v-igreja-godim", name: "Igreja de S. José de Godim", coords: [41.17123, -7.80313], },
  { id: "v-nogueiras", name: "Cruzamento R. Padre Alberto Teixeira de Carvalho com a R. das Nogueiras", coords: [41.17073, -7.80578], },
  { id: "v-dourolar", name: "Dourolar", detail: "Cruzamento R. Cândida Lima com a R. das Cerdeiras", coords: [41.16824, -7.8066], },
  { id: "v-candida", name: "R. Cândida Lima", detail: "Cruzamento Loteamento das Lajes", coords: [41.16487, -7.80454], },
  { id: "v-tanque", name: "Lrg. do Tanque Redondo", coords: [41.16299, -7.80442], },
  { id: "v-augusto", name: "R. Augusto Vieira", detail: "Salgueiral", coords: [41.16079, -7.80576], },
  { id: "v-augusto-douro", name: "Cruzamento da R. Augusto Vieira e Av. do Douro", coords: [41.15833, -7.80708], },
  { id: "v-douro", name: "Av. do Douro", detail: "interseção com a Barroca", coords: [41.16099, -7.80348], },
  { id: "v-fomento", name: "Av. Sacadura Cabral", detail: "junto ao B.º Fundo Fomento de Habitação", coords: [41.16431, -7.79982], },
  { id: "v-alameda", name: "Av. Dr. Antão de Carvalho", detail: "Centro Escolar da Alameda", coords: [41.16508, -7.79218], },
  { id: "v-camara", name: "Av. Dr. Antão de Carvalho", detail: "Rtd. junto à Câmara Municipal", coords: [41.16357, -7.78902], },
  { id: "v-galerias", name: "Av. Dr. Manuel de Arriaga", detail: "junto Galerias S. João", coords: [41.16156, -7.78808], },
  { id: "v-pt", name: "Av. Dr. Manuel de Arriaga", detail: "junto ao Edf. da PT", coords: [41.16117, -7.78603], },
  { id: "v-arriaga", name: "Av. Dr. Manuel de Arriaga", coords: [41.16162, -7.78575], },
  { id: "v-tabau", name: "Av. Dr. Manuel de Arriaga", detail: "Edf. Tabau", coords: [41.16349, -7.78675], },
  { id: "igreja-matriz", name: "Igreja Matriz", coords: [41.1651, -7.78499], },
  { id: "v-jfig-cem", name: "R. João de Figueiredo", detail: "acesso ao Cemitério do Peso da Régua", coords: [41.16441, -7.78398], },
  { id: "v-jfig-socorro", name: "R. João de Figueiredo", detail: "B.º Nossa Senhora do Socorro", coords: [41.1642, -7.78093], },
  { id: "v-dio-jfig", name: "Av. Diocese de Vila Real", detail: "após intersecção com a R. João de Figueiredo", coords: [41.16462, -7.78043], },
  { id: "v-dio-ped", name: "Av. Diocese de Vila Real", detail: "cruzamento R. das Pedreiras com a Urb. S.Domingos", coords: [41.1624, -7.78059], },
  { id: "v-dio-bairro", name: "Av. Diocese de Vila Real", detail: "B.º da Av. Diocese de Vila Real", coords: [41.15789, -7.77782], },
  { id: "v-camilos", name: "R. dos Camilos", detail: "em frente à Sede do IVDP", coords: [41.1608, -7.78759], },
  { id: "v-camilos-cruz", name: "Cruzamento R. dos Camilos, R. Serpa Pinto e R. João de Lemos", detail: "antigo Sinaleiro", coords: [41.16176, -7.78912], },
  { id: "v-ferreirinha", name: "R. da Ferreirinha", detail: "sede da ADIN", coords: [41.16406, -7.79216], },
  { id: "r-ovar", name: "Av. de Ovar", detail: "em frente à Biblioteca Municipal", coords: [41.16266, -7.79214], },
  { id: "r-meia", name: "Meia Laranja", detail: "Av. da Galiza", coords: [41.15997, -7.7883], },
  { id: "r-dio-bairro", name: "Av. Diocese de Vila Real", detail: "em frente ao B.º da Av. Diocese de Vila Real", coords: [41.15778, -7.77756], },
  { id: "r-dio-sd", name: "Av. Diocese de Vila Real", detail: "acesso à Urb. de S. Domingos", coords: [41.16226, -7.78033], },
  { id: "r-freguesias", name: "Rtd. das Freguesias", coords: [41.16493, -7.77953], },
  { id: "r-boamorte", name: "Av. Dr. Manuel de Arriaga", detail: "cruzamento com a R. da Boa Morte", coords: [41.16623, -7.78352], },
  { id: "r-eiro", name: "Lrg. do Eirô", coords: [41.16608, -7.78576], },
  { id: "r-tabau", name: "Av. Dr. Manuel de Arriaga", detail: "em frente ao Edf. Tabau", coords: [41.16362, -7.78688], },
  { id: "r-arriaga", name: "Av. Dr. Manuel de Arriaga", coords: [41.1618, -7.78674], },
  { id: "r-pt", name: "Av. Dr. Manuel de Arriaga", detail: "em frente ao Edf. da PT", coords: [41.16123, -7.78618], },
  { id: "r-aviadores", name: "Lrg. dos Aviadores", coords: [41.16277, -7.78879], },
  { id: "r-junta", name: "Junta de Freguesia", detail: "Edf. Junta Peso da Régua", coords: [41.16465, -7.78972], },
  { id: "r-tribunal", name: "Prç. Gen. Humberto Delgado", detail: "em frente ao Tribunal", coords: [41.16581, -7.79202], },
  { id: "r-torre", name: "Av. Sacadura Cabral", detail: "em frente ao Edf. Torre do Sol", coords: [41.16484, -7.7983], },
  { id: "r-casapovo", name: "Cruzamento da Casa do Povo de Godim", },
  { id: "r-dourolar", name: "Dourolar", detail: "cruzamento R. das Laranjeiras com a R. das Cerdeiras", coords: [41.16833, -7.80689], },
  { id: "r-nogueiras", name: "Cruzamento da R. das Nogueiras com a R. Padre Alberto Teixeira de Carvalho", coords: [41.1706, -7.80566], },
  { id: "r-cem-godim", name: "Cemitério de Godim", coords: [41.17132, -7.80323], },
  { id: "r-jf-godim", name: "Cruzamento do Edf. da Junta de Freguesia de Godim com a R. Prof. José Lacerda", coords: [41.16851, -7.80241], },
  { id: "r-eb23", name: "Eb 2,3", coords: [41.16746, -7.79833], },
  { id: "r-lous-entrada", name: "R. da Lousada", detail: "entrada para o Armazém 30", coords: [41.17193, -7.79623], },
  { id: "r-gnr", name: "Junto ao Posto da GNR", coords: [41.16752, -7.79599], },
]
