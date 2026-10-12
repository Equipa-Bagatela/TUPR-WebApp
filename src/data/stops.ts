import type { Stop } from '../types'

/**
 * Paragens do TUPR, transcritas do PDF oficial "horarios_tupr_2025.pdf" (CM Peso da Régua).
 *
 * - `name` / `detail` seguem o texto do PDF (detail = a indicação entre parênteses).
 * - O PDF NÃO inclui coordenadas. As coordenadas (`coords`) vêm das paragens ("stages") da API de tracking do TUPR
 *   (https://tupr.elevensystems.pt/api, © Eleven Systems), validadas contra este PDF (mesmas paragens, ordem e horas).
 *   Paragens partilhadas por duas linhas têm o ponto médio das duas posições. Servem só para o mapa — nunca para horários.
 * - AMBIGUIDADE: o PDF não indica o lado da via. Paragens com o mesmo nome E a mesma indicação
 *   nas duas linhas (ex.: "Lrg. da Estação") foram unificadas numa só paragem; as restantes
 *   (ex.: "Av. Dr. Manuel de Arriaga" sem indicação, em cada linha) mantêm-se separadas.
 */
export const stops: Stop[] = [
  { id: "fab", name: "R. Fernando Augusto Bandeira", detail: "entre a Rtd. Baden Powell e Prç. Renato Aguiar", coords: [41.165945, -7.795369] },
  { id: "estacao", name: "Lrg. da Estação", coords: [41.158403, -7.784236] },
  { id: "ponte", name: "Rtd. da Ponte", coords: [41.156072, -7.779033] },
  { id: "jac", name: "Av. Sacadura Cabral", detail: "Escola Sec. João de Araújo Correia", coords: [41.163607, -7.802531] },
  { id: "lous-mat", name: "R. da Lousada", detail: "antigo Matadouro Municipal", coords: [41.168172, -7.797108] },
  { id: "lous-inv", name: "R. da Lousada (INVERSÃO DE SENTIDO)", detail: "sentido oposto à EPDR do Rodo", coords: [41.177962, -7.795245] },
  { id: "lous-frente", name: "R. da Lousada", detail: "em frente à entrada para o Armazém 30", coords: [41.172518, -7.796310] },
  { id: "lous-caves", name: "R. da Lousada", detail: "em frente às Caves Vale do Rodo", coords: [41.169190, -7.796576] },
  { id: "alagoas-ce", name: "Centro Escolar das Alagoas", coords: [41.167284, -7.800779] },
  { id: "v-tondela", name: "R. de Tondela", detail: "junto às Oficinas Municipais", coords: [41.167535, -7.796113] },
  { id: "v-lous-cruz", name: "R. da Lousada", detail: "Cruzamento Armazém 30", coords: [41.171989, -7.796247] },
  { id: "v-lacerda-eb", name: "R. Prof. José Lacerda", detail: "junto B.º das Alagoas - Cruzamento Eb2,3", coords: [41.167641, -7.798428] },
  { id: "v-julio", name: "R. Dr. Júlio Vasques", detail: "Junta de Freguesia de Godim", coords: [41.168881, -7.801462] },
  { id: "v-igreja-godim", name: "Igreja de S. José de Godim", coords: [41.171367, -7.803048] },
  { id: "v-nogueiras", name: "Cruzamento R. Padre Alberto Teixeira de Carvalho com a R. das Nogueiras", coords: [41.170698, -7.805840] },
  { id: "v-dourolar", name: "Dourolar", detail: "Cruzamento R. Cândida Lima com a R. das Cerdeiras", coords: [41.168392, -7.806974] },
  { id: "v-candida", name: "R. Cândida Lima", detail: "Cruzamento Loteamento das Lajes", coords: [41.165046, -7.804968] },
  { id: "v-tanque", name: "Lrg. do Tanque Redondo", coords: [41.163111, -7.804291] },
  { id: "v-augusto", name: "R. Augusto Vieira", detail: "Salgueiral", coords: [41.160772, -7.805796] },
  { id: "v-augusto-douro", name: "Cruzamento da R. Augusto Vieira e Av. do Douro", coords: [41.158281, -7.807125] },
  { id: "v-douro", name: "Av. do Douro", detail: "interseção com a Barroca", coords: [41.161000, -7.803486] },
  { id: "v-fomento", name: "Av. Sacadura Cabral", detail: "junto ao B.º Fundo Fomento de Habitação", coords: [41.164353, -7.799596] },
  { id: "v-alameda", name: "Av. Dr. Antão de Carvalho", detail: "Centro Escolar da Alameda", coords: [41.165271, -7.792347] },
  { id: "v-camara", name: "Av. Dr. Antão de Carvalho", detail: "Rtd. junto à Câmara Municipal", coords: [41.163504, -7.788905] },
  { id: "v-galerias", name: "Av. Dr. Manuel de Arriaga", detail: "junto Galerias S. João", coords: [41.161552, -7.788079] },
  { id: "v-pt", name: "Av. Dr. Manuel de Arriaga", detail: "junto ao Edf. da PT", coords: [41.161197, -7.786039] },
  { id: "v-arriaga", name: "Av. Dr. Manuel de Arriaga", coords: [41.161632, -7.785745] },
  { id: "v-tabau", name: "Av. Dr. Manuel de Arriaga", detail: "Edf. Tabau", coords: [41.163519, -7.786599] },
  { id: "igreja-matriz", name: "Igreja Matriz", coords: [41.165071, -7.785295] },
  { id: "v-jfig-cem", name: "R. João de Figueiredo", detail: "acesso ao Cemitério do Peso da Régua", coords: [41.164354, -7.783924] },
  { id: "v-jfig-socorro", name: "R. João de Figueiredo", detail: "B.º Nossa Senhora do Socorro", coords: [41.164179, -7.781261] },
  { id: "v-dio-jfig", name: "Av. Diocese de Vila Real", detail: "após intersecção com a R. João de Figueiredo", coords: [41.164551, -7.780510] },
  { id: "v-dio-ped", name: "Av. Diocese de Vila Real", detail: "cruzamento R. das Pedreiras com a Urb. S.Domingos", coords: [41.162340, -7.780573] },
  { id: "v-dio-bairro", name: "Av. Diocese de Vila Real", detail: "B.º da Av. Diocese de Vila Real", coords: [41.157833, -7.777811] },
  { id: "v-camilos", name: "R. dos Camilos", detail: "em frente à Sede do IVDP", coords: [41.160814, -7.787624] },
  { id: "v-camilos-cruz", name: "Cruzamento R. dos Camilos, R. Serpa Pinto e R. João de Lemos", detail: "antigo Sinaleiro", coords: [41.161717, -7.789044] },
  { id: "v-ferreirinha", name: "R. da Ferreirinha", detail: "sede da ADIN", coords: [41.164085, -7.792233] },
  { id: "r-ovar", name: "Av. de Ovar", detail: "em frente à Biblioteca Municipal", coords: [41.162455, -7.792116] },
  { id: "r-meia", name: "Meia Laranja", detail: "Av. da Galiza", coords: [41.160023, -7.788483] },
  { id: "r-dio-bairro", name: "Av. Diocese de Vila Real", detail: "em frente ao B.º da Av. Diocese de Vila Real", coords: [41.157897, -7.777625] },
  { id: "r-dio-sd", name: "Av. Diocese de Vila Real", detail: "acesso à Urb. de S. Domingos", coords: [41.162255, -7.780307] },
  { id: "r-freguesias", name: "Rtd. das Freguesias", coords: [41.164917, -7.779531] },
  { id: "r-boamorte", name: "Av. Dr. Manuel de Arriaga", detail: "cruzamento com a R. da Boa Morte", coords: [41.166198, -7.783259] },
  { id: "r-eiro", name: "Lrg. do Eirô", coords: [41.166075, -7.785709] },
  { id: "r-tabau", name: "Av. Dr. Manuel de Arriaga", detail: "em frente ao Edf. Tabau", coords: [41.163502, -7.786791] },
  { id: "r-arriaga", name: "Av. Dr. Manuel de Arriaga", coords: [41.161723, -7.786613] },
  { id: "r-pt", name: "Av. Dr. Manuel de Arriaga", detail: "em frente ao Edf. da PT", coords: [41.161259, -7.786095] },
  { id: "r-aviadores", name: "Lrg. dos Aviadores", coords: [41.162617, -7.788753] },
  { id: "r-junta", name: "Junta de Freguesia", detail: "Edf. Junta Peso da Régua", coords: [41.164622, -7.789701] },
  { id: "r-tribunal", name: "Prç. Gen. Humberto Delgado", detail: "em frente ao Tribunal", coords: [41.165799, -7.792007] },
  { id: "r-torre", name: "Av. Sacadura Cabral", detail: "em frente ao Edf. Torre do Sol", coords: [41.164869, -7.798228] },
  { id: "r-casapovo", name: "Cruzamento da Casa do Povo de Godim", coords: [41.164819, -7.804446] },
  { id: "r-dourolar", name: "Dourolar", detail: "cruzamento R. das Laranjeiras com a R. das Cerdeiras", coords: [41.168028, -7.806261] },
  { id: "r-nogueiras", name: "Cruzamento da R. das Nogueiras com a R. Padre Alberto Teixeira de Carvalho", coords: [41.170667, -7.805691] },
  { id: "r-cem-godim", name: "Cemitério de Godim", coords: [41.171290, -7.802992] },
  { id: "r-jf-godim", name: "Cruzamento do Edf. da Junta de Freguesia de Godim com a R. Prof. José Lacerda", coords: [41.168491, -7.802278] },
  { id: "r-eb23", name: "Eb 2,3", coords: [41.167524, -7.798273] },
  { id: "r-lous-entrada", name: "R. da Lousada", detail: "entrada para o Armazém 30", coords: [41.171989, -7.796247] },
  { id: "r-gnr", name: "Junto ao Posto da GNR", coords: [41.167423, -7.796482] },
]
