import type { Lang } from './index'

export interface LegalSection {
  h: string
  p?: string[]
  ul?: string[]
}
export interface LegalDoc {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}

export const CONTACT_EMAIL = 'bagatela.geral@gmail.com'

/** Última revisão dos textos legais. */
const UPDATED = { pt: 'Última atualização: 23 de novembro de 2026', en: 'Last updated: 23 November 2026' }

export const terms: Record<Lang, LegalDoc> = {
  pt: {
    title: 'Termos de utilização',
    updated: UPDATED.pt,
    intro: 'Ao usar o Horários TUPR aceita estes termos. São curtos e escritos para se perceberem.',
    sections: [
      {
        h: 'Quem somos',
        p: ['O Horários TUPR é um projeto isolado e não oficial da Bagatela. Não é um serviço da Câmara Municipal do Peso da Régua, do operador dos transportes urbanos nem da Eleven Systems, e não tem qualquer parceria ou aval da parte deles.', 'TUPR e as restantes marcas ou nomes referidos pertencem aos respetivos titulares e são usados apenas para identificar o serviço a que a informação diz respeito.'],
      },
      {
        h: 'O que a aplicação faz',
        p: ['Mostra horários, paragens, percursos e a posição dos autocarros, e calcula sugestões de viagem. É uma ferramenta de consulta, oferecida gratuitamente.'],
      },
      {
        h: 'Informação “tal como está”',
        ul: [
          'Os horários são informação pública, transcrita de documentos publicados. Podem estar desatualizados, incompletos ou conter erros, e podem mudar sem aviso.',
          'A posição dos autocarros em direto é indicativa: pode atrasar, falhar ou estar indisponível.',
          'As posições das paragens no mapa são aproximadas.',
          'As sugestões de viagem, incluindo os transbordos, são calculadas a partir dos horários e não garantem que o autocarro passe à hora indicada.',
          'Em caso de dúvida, confirme sempre junto do serviço de transportes.',
        ],
      },
      {
        h: 'Responsabilidade',
        p: ['A Bagatela não garante que a aplicação esteja sempre disponível nem que a informação esteja correta. Na medida em que a lei o permite, não nos responsabilizamos por prejuízos resultantes do uso ou da impossibilidade de uso da aplicação, incluindo viagens perdidas. Isto não limita direitos que a lei lhe reconheça como consumidor.'],
      },
      {
        h: 'Origem dos dados',
        ul: [
          'Horários e tarifário: informação publicada pela Câmara Municipal do Peso da Régua.',
          'Posição dos autocarros em direto: sistema de tracking do TUPR, da Eleven Systems.',
          'Mapa: © colaboradores do OpenStreetMap (licença ODbL), com a atribuição visível no mapa.',
        ],
      },
      {
        h: 'Utilização adequada',
        p: ['Pode usar a aplicação livremente para consulta pessoal. Não a use para sobrecarregar os serviços de que depende (por exemplo, com pedidos automáticos em massa) nem para fins ilícitos.'],
      },
      {
        h: 'Apoio voluntário',
        p: ['Se quiser, pode apoiar o projeto através do Buy Me a Coffee. É totalmente voluntário e não dá direito a nenhum serviço, garantia, suporte ou tratamento especial: a aplicação é gratuita para todos. O pagamento é processado pelo Buy Me a Coffee, nos termos próprios dessa plataforma.'],
      },
      {
        h: 'Alterações e remoção de conteúdos',
        p: ['Podemos alterar, suspender ou terminar a aplicação, e atualizar estes termos, a qualquer momento. Se for titular de direitos sobre algum conteúdo e quiser que seja corrigido ou retirado, contacte-nos e responderemos com brevidade.'],
      },
      {
        h: 'Lei aplicável',
        p: ['Estes termos regem-se pela lei portuguesa.'],
      },
      {
        h: 'Contacto',
        p: [`Dúvidas, correções ou pedidos: ${CONTACT_EMAIL}.`],
      },
    ],
  },
  en: {
    title: 'Terms of use',
    updated: UPDATED.en,
    intro: 'By using Horários TUPR you accept these terms. They are short and written to be understood.',
    sections: [
      {
        h: 'Who we are',
        p: ['Horários TUPR is a standalone, unofficial Bagatela project. It is not a service of the Municipality of Peso da Régua, of the urban transport operator or of Eleven Systems, and has no partnership with or endorsement from them.', 'TUPR and any other brands or names mentioned belong to their respective owners and are used only to identify the service the information refers to.'],
      },
      {
        h: 'What the app does',
        p: ['It shows timetables, stops, routes and the position of the buses, and calculates trip suggestions. It is a lookup tool, offered free of charge.'],
      },
      {
        h: 'Information “as is”',
        ul: [
          'Timetables are public information, transcribed from published documents. They may be out of date, incomplete or contain errors, and may change without notice.',
          'Live bus positions are indicative: they may be delayed, fail or be unavailable.',
          'Stop positions on the map are approximate.',
          'Trip suggestions, including transfers, are calculated from the timetables and do not guarantee that a bus will arrive at the time shown.',
          'If in doubt, always check with the transport service.',
        ],
      },
      {
        h: 'Liability',
        p: ['Bagatela does not guarantee that the app is always available or that the information is correct. To the extent permitted by law, we are not liable for losses arising from using, or being unable to use, the app, including missed journeys. This does not limit any rights the law gives you as a consumer.'],
      },
      {
        h: 'Data sources',
        ul: [
          'Timetables and fares: information published by the Municipality of Peso da Régua.',
          'Live bus positions: the TUPR tracking system, by Eleven Systems.',
          'Map: © OpenStreetMap contributors (ODbL licence), with attribution shown on the map.',
        ],
      },
      {
        h: 'Appropriate use',
        p: ['You may use the app freely for personal lookups. Do not use it to overload the services it depends on (for example with mass automated requests) or for unlawful purposes.'],
      },
      {
        h: 'Voluntary support',
        p: ['If you wish, you can support the project through Buy Me a Coffee. It is entirely voluntary and gives no right to any service, warranty, support or special treatment: the app is free for everyone. The payment is processed by Buy Me a Coffee under that platform’s own terms.'],
      },
      {
        h: 'Changes and removal of content',
        p: ['We may change, suspend or end the app, and update these terms, at any time. If you hold rights over any content and want it corrected or removed, contact us and we will reply promptly.'],
      },
      {
        h: 'Governing law',
        p: ['These terms are governed by Portuguese law.'],
      },
      {
        h: 'Contact',
        p: [`Questions, corrections or requests: ${CONTACT_EMAIL}.`],
      },
    ],
  },
}

export const privacy: Record<Lang, LegalDoc> = {
  pt: {
    title: 'Política de privacidade',
    updated: UPDATED.pt,
    intro: 'Resumo: não há contas nem registos, não vendemos dados e a sua localização nunca sai do seu dispositivo.',
    sections: [
      {
        h: 'Responsável',
        p: [`A Bagatela é responsável por esta aplicação. Contacto: ${CONTACT_EMAIL}.`],
      },
      {
        h: 'O que fica guardado no seu dispositivo',
        p: ['Para funcionar como esperado, a aplicação guarda no seu browser (não nos nossos servidores):'],
        ul: [
          'as suas paragens e percursos favoritos;',
          'o modo claro/escuro;',
          'se já fechou o aviso para adicionar a aplicação ao ecrã principal;',
          'durante a sessão, se já viu a animação de abertura.',
        ],
      },
      {
        h: 'Localização',
        p: ['Só é pedida quando carrega em “Usar a minha localização”, e o seu browser pergunta primeiro se autoriza. A posição é usada no seu dispositivo para encontrar as paragens mais próximas e mostrá-la no mapa. Não a enviamos, não a guardamos e não a associamos a si. Pode usar tudo sem a partilhar.'],
      },
      {
        h: 'Serviços de terceiros',
        p: ['Ao usar a aplicação, o seu browser contacta estes serviços, que podem ver o seu endereço IP e os dados técnicos habituais de um pedido (browser, idioma, página):'],
        ul: [
          'Alojamento do site: entrega a aplicação e pode manter registos técnicos de acesso.',
          'Vercel Analytics: estatísticas agregadas de utilização (por exemplo, páginas vistas, país e tipo de dispositivo), sem cookies e sem o identificar pessoalmente, segundo a Vercel.',
          'OpenStreetMap (tile.openstreetmap.org): fornece as imagens do mapa.',
          'Eleven Systems (tupr.elevensystems.pt): fornece a posição dos autocarros em direto.',
        ],
      },
      {
        h: 'Apoio ao projeto',
        p: ['O rodapé tem uma ligação para a nossa página no Buy Me a Coffee. Só contactamos esse serviço se clicar nela: a partir daí aplica-se a política de privacidade deles. Nós não recebemos os seus dados de pagamento.'],
      },
      {
        h: 'O que não fazemos',
        ul: ['Não pedimos nome, e-mail nem qualquer registo.', 'Não usamos publicidade nem cookies de rastreio.', 'Não vendemos nem partilhamos dados pessoais.'],
      },
      {
        h: 'Os seus direitos',
        p: ['Nos termos do RGPD, pode pedir acesso, retificação ou apagamento dos dados pessoais que tratemos, e opor-se ao tratamento. Como a aplicação quase não trata dados pessoais, na prática basta limpar os dados do site no seu browser para apagar o que ficou guardado no dispositivo. Pode também apresentar queixa à Comissão Nacional de Proteção de Dados (cnpd.pt).'],
      },
      {
        h: 'Alterações',
        p: ['Podemos atualizar esta política. A data da última revisão está no topo da página.'],
      },
    ],
  },
  en: {
    title: 'Privacy policy',
    updated: UPDATED.en,
    intro: 'In short: there are no accounts or records, we do not sell data, and your location never leaves your device.',
    sections: [
      {
        h: 'Who is responsible',
        p: [`Bagatela is responsible for this app. Contact: ${CONTACT_EMAIL}.`],
      },
      {
        h: 'What is stored on your device',
        p: ['To work as expected, the app stores in your browser (not on our servers):'],
        ul: [
          'your favourite stops and journeys;',
          'your light/dark mode;',
          'whether you have dismissed the prompt to add the app to your Home Screen;',
          'during the session, whether you have already seen the opening animation.',
        ],
      },
      {
        h: 'Location',
        p: ['It is only requested when you press “Use my location”, and your browser asks for permission first. The position is used on your device to find the nearest stops and show it on the map. We do not send it, store it or link it to you. You can use everything without sharing it.'],
      },
      {
        h: 'Third-party services',
        p: ['When you use the app, your browser contacts these services, which may see your IP address and the usual technical data of a request (browser, language, page):'],
        ul: [
          'Site hosting: delivers the app and may keep technical access logs.',
          'Vercel Analytics: aggregated usage statistics (for example page views, country and device type), without cookies and without identifying you personally, according to Vercel.',
          'OpenStreetMap (tile.openstreetmap.org): provides the map images.',
          'Eleven Systems (tupr.elevensystems.pt): provides the live bus positions.',
        ],
      },
      {
        h: 'Supporting the project',
        p: ['The footer has a link to our Buy Me a Coffee page. We only contact that service if you click it: from then on their privacy policy applies. We do not receive your payment details.'],
      },
      {
        h: 'What we do not do',
        ul: ['We do not ask for your name, email or any sign-up.', 'We use no advertising or tracking cookies.', 'We do not sell or share personal data.'],
      },
      {
        h: 'Your rights',
        p: ['Under the GDPR you may request access, rectification or erasure of any personal data we process, and object to processing. Since the app hardly processes personal data, in practice clearing the site data in your browser removes what is stored on your device. You may also lodge a complaint with the Portuguese data protection authority (CNPD, cnpd.pt).'],
      },
      {
        h: 'Changes',
        p: ['We may update this policy. The date of the last revision is at the top of the page.'],
      },
    ],
  },
}
