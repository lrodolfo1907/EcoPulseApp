import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app": {
        "name": "EcoPulse",
        "tagline": "Pulse for a sustainable future",
        "shareText": "I just earned {{hours}} Green Hours on EcoPulse! Join me in making a difference. #EcoPulse #Sustainability",
        "badgeShareText": "I just unlocked the \"{{badge}}\" badge on EcoPulse! Join me and earn Green Hours for your positive impact. #EcoPulse #Sustainability",
        "readyToShare": "Ready to share! Copy this text: ",
        "preferencesSaved": "Preferences saved! Your recommendations will be updated."
      },
      "nav": {
        "home": "Home",
        "action": "Action",
        "community": "Community",
        "portfolio": "Portfolio",
        "profile": "Profile",
        "initiatives": "Initiatives",
        "academy": "Eco-Academy",
        "calculator": "Carbon Calculator",
        "challenges": "Global Challenges",
        "leaderboard": "Leaderboard",
        "impact": "My Impact",
        "rewards": "Rewards Hub",
        "guide": "Guide",
        "admin": "Admin Panel"
      },
      "common": {
        "logout": "Logout",
        "signin": "Sign In",
        "save": "Save",
        "cancel": "Cancel",
        "loading": "Loading...",
        "share": "Share",
        "join": "Join",
        "joined": "Joined",
        "badges": "Badges",
        "points": "Green Hours",
        "hello": "Hello",
        "ecoWarrior": "Eco Warrior"
      },
      "home": {
        "hero": {
          "title": "Ready to {{action}}?",
          "action": "save the planet",
          "impact": "You've earned {{hours}} Green Hours. That's equivalent to planting {{trees}} trees this month. Keep up the amazing work!",
          "linkedin": "Export to LinkedIn",
          "instagram": "Share on Instagram"
        },
        "survey": {
          "title": "Personalize Your Impact",
          "description": "Take our quick survey to get personalized challenges and initiative recommendations matching your interests.",
          "button": "Take Survey"
        },
        "tip": {
          "title": "Daily Eco Tip",
          "refresh": "Get another tip"
        }
      },
      "initiatives": {
        "title": "Environmental Initiatives",
        "subtitle": "Find ways to contribute and earn Green Hours",
        "local": "Local",
        "global": "Global",
        "showJoined": "Show Joined",
        "hideJoined": "Hide Joined",
        "mapSoonTitle": "Map View Available Soon",
        "mapSoonDesc": "We're integrating mapping to help you easily locate and track these local initiatives right from your neighborhood.",
        "noFound": "No initiatives found. Try showing joined initiatives or changing your location preference.",
        "verified": "Verified",
        "microTask": "Micro Task",
        "regularTask": "Regular Task",
        "joinNow": "Join Now",
        "plusPoints": "+{{hours}} Green Hours"
      },
      "rewards": {
        "title": "Green Rewards",
        "description": "Turn your Green Hours into real-world value. We're partnering with sustainable brands so you can soon exchange your impact for exclusive perks.",
        "balance": "Your Balance",
        "balanceDesc": "Available for future redemption",
        "comingSoon": "Redeem Coming Soon",
        "needMore": "Need more GH",
        "beta": "Beta Program",
        "items": {
          "nft": { "title": "WWF Eco-Warrior NFT", "desc": "Exclusive digital badge verifying your commitment." },
          "transit": { "title": "One Month Transit Pass", "desc": "Free public transportation pass for your city." },
          "cup": { "title": "Sustainable Coffee Cup", "desc": "Reusable bamboo coffee cup from EcoBrand." },
          "museum": { "title": "Local Museum Entry", "desc": "One free entry to the local natural history museum." }
        }
      },
      "community": {
        "title": "Community Challenges",
        "subtitle": "Join global movements or suggest your own",
        "suggest": "Suggest Challenge",
        "joined": "Joined",
        "join": "Join Challenge",
        "loading": "Loading challenges...",
        "suggestTitle": "Suggest a Challenge",
        "suggestDesc": "Your idea will be validated by admins before going live.",
        "inputTitle": "Challenge Title",
        "inputDesc": "Description",
        "inputCat": "Category",
        "submit": "Submit Idea",
        "joinedCount": "{{count}} joined",
        "daysLeft": "{{count}}d left"
      },
      "calculator": {
        "title": "Carbon Calculator",
        "subtitle": "Measure your weekly environmental footprint",
        "transport": "Transport (km/week)",
        "energy": "Energy Usage (kWh/month)",
        "diet": "Diet Type",
        "omnivore": "Omnivore",
        "vegetarian": "Vegetarian",
        "vegan": "Vegan",
        "calculate": "Calculate My Impact",
        "analyzing": "Analyzing...",
        "resultTitle": "Weekly Footprint",
        "share": "Share Result"
      },
      "academy": {
        "title": "Eco-Academy",
        "subtitle": "Increase your knowledge and capacity to contribute to the community with our curated training sessions.",
        "start": "Start Learning"
      },
      "portfolio": {
        "title": "Impact Portfolio",
        "subtitle": "Your journey towards a greener future",
        "share": "Share Portfolio",
        "editProfile": "Edit Profile",
        "bioPlaceholder": "Add a bio to tell the community about your eco-journey!",
        "badgesTitle": "My Badges",
        "badgesSubtitle": "Unlock achievements by earning green hours",
        "unlocksAt": "Unlocks at {{threshold}} hrs",
        "totalHours": "Total Green Hours Earned",
        "rank": "Rank",
        "joined": "Initiatives Joined",
        "completed": "Initiatives Completed",
        "activity": "Recent Activity",
        "noActivity": "No recent activity yet. Join an initiative to start earning Green Hours!",
        "badges": {
          "seedling": "Seedling",
          "seedlingDesc": "Earned your first green hour",
          "sprout": "Sprout",
          "sproutDesc": "Reached 10 green hours",
          "sapling": "Sapling",
          "saplingDesc": "Reached 50 green hours",
          "guardian": "Forest Guardian",
          "guardianDesc": "Reached 150 green hours"
        }
      },
      "onboarding": {
        "title": "Getting Started",
        "subtitle": "Welcome to EcoPulse! We're thrilled to have you join our global movement for environmental action. Here is how you can start making a difference today.",
        "ready": "You are all set. Time to explore!",
        "step1": {
          "title": "1. Find Initiatives",
          "desc": "Head over to the Initiatives tab to discover local environmental projects and micro-tasks you can complete from home."
        },
        "step2": {
          "title": "2. Join the Community",
          "desc": "Check out the Community tab to suggest new challenges, vote on ideas, and see what other Eco-Warriors are up to."
        },
        "step3": {
          "title": "3. Log Your Real Impact",
          "desc": "Participate in real-life cleanup drives, tree planting events, and digital tasks to earn your Green Hours (GH)."
        },
        "step4": {
          "title": "4. Earn Rewards",
          "desc": "Track your Green Hours in your Portfolio, climb the Leaderboard, and soon, redeem your GH for premium eco-rewards!"
        },
        "step5": {
          "title": "5. Ask EcoBot",
          "desc": "Got questions? Try clicking the floating chat icon in the bottom right to talk to our AI EcoBot anytime."
        }
      },
      "admin": {
        "title": "Admin Dashboard",
        "subtitle": "Review and manage community challenges",
        "pending": "Pending Challenges ({{count}})",
        "noPending": "No pending challenges to review.",
        "reject": "Reject",
        "approve": "Approve",
        "suggestedBy": "Suggested by: {{user}}"
      },
      "leaderboard": {
        "title": "Leaderboard",
        "subtitle": "Top Eco Warriors making the biggest impact",
        "global": "Global",
        "local": "Local",
        "hours": "Hours",
        "me": "You"
      },
      "chat": {
        "welcome": "Hi! I'm EcoBot. New here? Ask me for an Onboarding guide, or check out the Guide tab!",
        "placeholder": "Ask about EcoPulse or sustainability...",
        "error": "Sorry, I'm having trouble connecting right now."
      }
    }
  },
  pt: {
    translation: {
      "app": {
        "name": "EcoPulse",
        "tagline": "Pulso para um futuro sustentável",
        "shareText": "Acabei de ganhar {{hours}} Horas Verdes no EcoPulse! Junte-se a mim e faça a diferença. #EcoPulse #Sustentabilidade",
        "badgeShareText": "Acabei de desbloquear o selo \"{{badge}}\" no EcoPulse! Venha ganhar Horas Verdes por seu impacto positivo. #EcoPulse #Sustentabilidade",
        "readyToShare": "Pronto para compartilhar! Copie este texto: ",
        "preferencesSaved": "Preferências salvas! Suas recomendações serão atualizadas."
      },
      "nav": {
        "home": "Início",
        "action": "Ação",
        "community": "Comunidade",
        "portfolio": "Portfólio",
        "profile": "Perfil",
        "initiatives": "Iniciativas",
        "academy": "Eco-Academia",
        "calculator": "Calculadora de Carbono",
        "challenges": "Desafios Globais",
        "leaderboard": "Classificação",
        "impact": "Meu Impacto",
        "rewards": "Central de Prêmios",
        "guide": "Guia",
        "admin": "Painel Admin"
      },
      "common": {
        "logout": "Sair",
        "signin": "Entrar",
        "save": "Salvar",
        "cancel": "Cancelar",
        "loading": "Carregando...",
        "share": "Compartilhar",
        "join": "Participar",
        "joined": "Inscrito",
        "badges": "Conquistas",
        "points": "Horas Verdes",
        "hello": "Olá",
        "ecoWarrior": "Guerreiro Eco"
      },
      "home": {
        "hero": {
          "title": "Pronto para {{action}}?",
          "action": "salvar o planeta",
          "impact": "Você ganhou {{hours}} Horas Verdes. Isso equivale a plantar {{trees}} árvores este mês. Continue com o ótimo trabalho!",
          "linkedin": "Exportar para LinkedIn",
          "instagram": "Postar no Instagram"
        },
        "survey": {
          "title": "Personalize Seu Impacto",
          "description": "Faça nossa pesquisa rápida para obter desafios personalizados e recomendações de iniciativas que combinam com seus interesses.",
          "button": "Fazer Pesquisa"
        },
        "tip": {
          "title": "Dica Eco do Dia",
          "refresh": "Ver outra dica"
        }
      },
      "initiatives": {
        "title": "Iniciativas Ambientais",
        "subtitle": "Encontre formas de contribuir e ganhar Horas Verdes",
        "local": "Local",
        "global": "Global",
        "showJoined": "Mostrar Inscritos",
        "hideJoined": "Ocultar Inscritos",
        "mapSoonTitle": "Mapa em breve",
        "mapSoonDesc": "Estamos integrando o mapa para ajudá-lo a localizar e acompanhar facilmente as iniciativas em seu bairro.",
        "noFound": "Nenhuma iniciativa encontrada. Tente mostrar iniciativas inscritas ou mudar sua preferência de localização.",
        "verified": "Verificado",
        "microTask": "Micro Tarefa",
        "regularTask": "Tarefa Regular",
        "joinNow": "Participar Agora",
        "plusPoints": "+{{hours}} Horas Verdes"
      },
      "rewards": {
        "title": "Prêmios Verdes",
        "description": "Transforme suas Horas Verdes em valor real. Estamos fazendo parcerias com marcas sustentáveis para que você possa trocar seu impacto por benefícios exclusivos.",
        "balance": "Seu Saldo",
        "balanceDesc": "Disponível para resgate futuro",
        "comingSoon": "Resgate em Breve",
        "needMore": "Precisa de mais HV",
        "beta": "Programa Beta",
        "items": {
          "nft": { "title": "NFT Eco-Warrior WWF", "desc": "Selo digital exclusivo verificando seu compromisso." },
          "transit": { "title": "Passe de Transporte Mensal", "desc": "Passe de transporte público gratuito para sua cidade." },
          "cup": { "title": "Copo de Café Sustentável", "desc": "Copo de café de bambu reutilizável da EcoBrand." },
          "museum": { "title": "Entrada em Museu Local", "desc": "Uma entrada gratuita para o museu de história natural local." }
        }
      },
      "community": {
        "title": "Desafios da Comunidade",
        "subtitle": "Junte-se a movimentos globais ou sugira o seu",
        "suggest": "Sugerir Desafio",
        "joined": "Inscrito",
        "join": "Participar do Desafio",
        "loading": "Carregando desafios...",
        "suggestTitle": "Sugerir um Desafio",
        "suggestDesc": "Sua ideia será validada pelos administradores antes de entrar no ar.",
        "inputTitle": "Título do Desafio",
        "inputDesc": "Descrição",
        "inputCat": "Categoria",
        "submit": "Enviar Ideia",
        "joinedCount": "{{count}} inscritos",
        "daysLeft": "{{count}}d restantes"
      },
      "calculator": {
        "title": "Calculadora de Carbono",
        "subtitle": "Meça sua pegada ambiental semanal",
        "transport": "Transporte (km/semana)",
        "energy": "Uso de Energia (kWh/mês)",
        "diet": "Tipo de Dieta",
        "omnivore": "Onívoro",
        "vegetarian": "Vegetariano",
        "vegan": "Vegano",
        "calculate": "Calcular Meu Impacto",
        "analyzing": "Analisando...",
        "resultTitle": "Pegada Semanal",
        "share": "Compartilhar Resultado"
      },
      "academy": {
        "title": "Eco-Academia",
        "subtitle": "Aumente seu conhecimento e capacidade de contribuir para a comunidade com nossas sessões de treinamento selecionadas.",
        "start": "Começar a Aprender"
      },
      "portfolio": {
        "title": "Portfólio de Impacto",
        "subtitle": "Sua jornada rumo a um futuro mais verde",
        "share": "Compartilhar Portfólio",
        "editProfile": "Editar Perfil",
        "bioPlaceholder": "Adicione uma biografia para contar à comunidade sobre sua jornada ecológica!",
        "badgesTitle": "Minhas Conquistas",
        "badgesSubtitle": "Desbloqueie conquistas ganhando horas verdes",
        "unlocksAt": "Desbloqueia com {{threshold}} horas",
        "totalHours": "Total de Horas Verdes Ganhas",
        "rank": "Classificação",
        "joined": "Iniciativas Inscritas",
        "completed": "Iniciativas Concluídas",
        "activity": "Atividade Recente",
        "noActivity": "Nenhuma atividade recente ainda. Junte-se a uma iniciativa para começar a ganhar Horas Verdes!",
        "badges": {
          "seedling": "Muda",
          "seedlingDesc": "Ganhou sua primeira hora verde",
          "sprout": "Brotar",
          "sproutDesc": "Alcançou 10 horas verdes",
          "sapling": "Árvore Jovem",
          "saplingDesc": "Alcançou 50 horas verdes",
          "guardian": "Guardião da Floresta",
          "guardianDesc": "Alcançou 150 horas verdes"
        }
      },
      "onboarding": {
        "title": "Começando",
        "subtitle": "Bem-vindo ao EcoPulse! Estamos entusiasmados por você se juntar ao nosso movimento global de ação ambiental. Saiba como começar a fazer a diferença hoje mesmo.",
        "ready": "Está tudo pronto. Hora de explorar!",
        "step1": {
          "title": "1. Encontre Iniciativas",
          "desc": "Acesse a guia Iniciativas para descobrir projetos ambientais locais e micro-tarefas que você pode realizar em casa."
        },
        "step2": {
          "title": "2. Junte-se à Comunidade",
          "desc": "Confira a guia Comunidade para sugerir novos desafios, votar em ideias e ver o que outros Eco-Warriors estão fazendo."
        },
        "step3": {
          "title": "3. Registre Seu Impacto Real",
          "desc": "Participe de mutirões de limpeza reais, plantio de árvores e tarefas digitais para ganhar suas Horas Verdes (HV)."
        },
        "step4": {
          "title": "4. Ganhe Prêmios",
          "desc": "Acompanhe suas Horas Verdes em seu Portfólio, suba na Classificação e, em breve, troque suas HV por prêmios ecológicos premium!"
        },
        "step5": {
          "title": "5. Pergunte ao EcoBot",
          "desc": "Tem dúvidas? Clique no ícone de chat flutuante no canto inferior direito para conversar com nosso AI EcoBot a qualquer momento."
        }
      },
      "admin": {
        "title": "Painel do Administrador",
        "subtitle": "Revise e gerencie os desafios da comunidade",
        "pending": "Desafios Pendentes ({{count}})",
        "noPending": "Nenhum desafio pendente para revisar.",
        "reject": "Rejeitar",
        "approve": "Aprovar",
        "suggestedBy": "Sugerido por: {{user}}"
      },
      "leaderboard": {
        "title": "Classificação",
        "subtitle": "Principais Eco-Warriors com maior impacto",
        "global": "Global",
        "local": "Local",
        "hours": "Horas",
        "me": "Você"
      },
      "chat": {
        "welcome": "Olá! Eu sou o EcoBot. Novo por aqui? Peça-me um guia de integração ou confira a guia Guia!",
        "placeholder": "Pergunte sobre EcoPulse ou sustentabilidade...",
        "error": "Desculpe, estou com problemas de conexão agora."
      }
    }
  },
  es: {
    translation: {
      "app": {
        "name": "EcoPulse",
        "tagline": "Pulso por un futuro sostenible",
        "shareText": "¡Acabo de ganar {{hours}} Green Hours en EcoPulse! Únete a mí para marcar la diferencia. #EcoPulse #Sostenibilidad",
        "badgeShareText": "¡Acabo de desbloquear la medalla \"{{badge}}\" en EcoPulse! Únete a mí y gana Green Hours por tu impacto positivo. #EcoPulse #Sostenibilidad",
        "readyToShare": "¡Listo para compartir! Copia este texto: ",
        "preferencesSaved": "¡Preferencias guardadas! Tus recomendaciones se actualizarán."
      },
      "nav": {
        "home": "Inicio",
        "action": "Acción",
        "community": "Comunidad",
        "portfolio": "Portafolio",
        "profile": "Perfil",
        "initiatives": "Iniciativas",
        "academy": "Eco-Academia",
        "calculator": "Calculadora de Carbono",
        "challenges": "Desafíos Globales",
        "leaderboard": "Clasificación",
        "impact": "Mi Impacto",
        "rewards": "Centro de Premios",
        "guide": "Guía",
        "admin": "Panel Admin"
      },
      "common": {
        "logout": "Cerrar sesión",
        "signin": "Iniciar sesión",
        "save": "Guardar",
        "cancel": "Cancelar",
        "loading": "Cargando...",
        "share": "Compartir",
        "join": "Unirse",
        "joined": "Inscrito",
        "badges": "Insignias",
        "points": "Horas Verdes",
        "hello": "Hola",
        "ecoWarrior": "Guerrero Eco"
      },
      "home": {
        "hero": {
          "title": "¿Listo para {{action}}?",
          "action": "salvar el planeta",
          "impact": "Has ganado {{hours}} Horas Verdes. Eso equivale a plantar {{trees}} árboles este mes. ¡Sigue así!",
          "linkedin": "Exportar a LinkedIn",
          "instagram": "Compartir en Instagram"
        },
        "survey": {
          "title": "Personaliza Tu Impacto",
          "description": "Realiza nuestra encuesta rápida para obtener desafíos personalizados y recomendaciones de iniciativas que coincidan con tus intereses.",
          "button": "Hacer Encuesta"
        },
        "tip": {
          "title": "Consejo Eco Diario",
          "refresh": "Ver otro consejo"
        }
      },
      "initiatives": {
        "title": "Iniciativas Ambientales",
        "subtitle": "Encuentre formas de contribuir y ganar Horas Verdes",
        "local": "Local",
        "global": "Global",
        "showJoined": "Mostrar inscritos",
        "hideJoined": "Ocultar inscritos",
        "mapSoonTitle": "Vista de mapa pronto",
        "mapSoonDesc": "Estamos integrando mapas para ayudarte a localizar y rastrear fácilmente estas iniciativas locales en tu vecindario.",
        "noFound": "No se encontraron iniciativas. Intente mostrar las iniciativas a las que se ha unido o cambie su preferencia de ubicación.",
        "verified": "Verificado",
        "microTask": "Microtarea",
        "regularTask": "Tarea Regular",
        "joinNow": "Unirse ahora",
        "plusPoints": "+{{hours}} Horas Verdes"
      },
      "rewards": {
        "title": "Premios Verdes",
        "description": "Convierte tus Horas Verdes en valor real. Nos asociamos con marcas sostenibles para que pronto puedas canjear tu impacto por beneficios exclusivos.",
        "balance": "Tu Saldo",
        "balanceDesc": "Disponible para futuro canje",
        "comingSoon": "Canje pronto",
        "needMore": "Necesitas más HV",
        "beta": "Programa Beta",
        "items": {
          "nft": { "title": "NFT Eco-Warrior WWF", "desc": "Insignia digital exclusiva que verifica su compromiso." },
          "transit": { "title": "Pase de Transporte Mensual", "desc": "Pase de transporte público gratuito para su ciudad." },
          "cup": { "title": "Taza de Café Sostenible", "desc": "Taza de café de bambú reutilizable de EcoBrand." },
          "museum": { "title": "Entrada a Museo Local", "desc": "Una entrada gratuita al museo local de historia natural." }
        }
      },
      "community": {
        "title": "Desafíos de la Comunidad",
        "subtitle": "Únase a movimientos globales o sugiera los suyos propios",
        "suggest": "Sugerir Desafío",
        "joined": "Inscrito",
        "join": "Unirse al Desafío",
        "loading": "Cargando desafíos...",
        "suggestTitle": "Sugerir un Desafio",
        "suggestDesc": "Tu idea será validada por los administradores antes de publicarse.",
        "inputTitle": "Título del Desafío",
        "inputDesc": "Descripción",
        "inputCat": "Categoría",
        "submit": "Enviar Idea",
        "joinedCount": "{{count}} unidos",
        "daysLeft": "faltan {{count}}d"
      },
      "calculator": {
        "title": "Calculadora de Carbono",
        "subtitle": "Mide tu huella ambiental semanal",
        "transport": "Transporte (km/semana)",
        "energy": "Uso de Energía (kWh/mes)",
        "diet": "Tipo de Dieta",
        "omnivore": "Omnívoro",
        "vegetarian": "Vegetariano",
        "vegan": "Vegano",
        "calculate": "Calcular Mi Impacto",
        "analyzing": "Analizando...",
        "resultTitle": "Huella Semanal",
        "share": "Compartir Resultado"
      },
      "academy": {
        "title": "Eco-Academia",
        "subtitle": "Aumente su conocimiento y capacidad para contribuir a la comunidad con nuestras sesiones de capacitación seleccionadas.",
        "start": "Comenzar a Aprender"
      },
      "portfolio": {
        "title": "Portafolio de Impacto",
        "subtitle": "Tu viaje hacia un futuro más verde",
        "share": "Compartir Portafolio",
        "editProfile": "Editar Perfil",
        "bioPlaceholder": "¡Añade una biografía para contarle al comunidad sobre tu viaje ecológico!",
        "badgesTitle": "Mis Insignias",
        "badgesSubtitle": "Desbloquea logros ganando horas verdes",
        "unlocksAt": "Se desbloquea a las {{threshold}} hrs",
        "totalHours": "Total de Horas Verdes Ganadas",
        "rank": "Rango",
        "joined": "Iniciativas Inscritas",
        "completed": "Iniciativas Completadas",
        "activity": "Atividad Reciente",
        "noActivity": "No hay actividad reciente aún. ¡Únete a una iniciativa para comenzar a ganar Horas Verdes!",
        "badges": {
          "seedling": "Plántula",
          "seedlingDesc": "Ganaste tu primera hora verde",
          "sprout": "Brote",
          "sproutDesc": "Alcanzaste 10 horas verdes",
          "sapling": "Retoño",
          "saplingDesc": "Alcanzaste 50 horas verdes",
          "guardian": "Guardián del Bosque",
          "guardianDesc": "Alcanzaste 150 horas verdes"
        }
      },
      "onboarding": {
        "title": "Empezando",
        "subtitle": "¡Bienvenido a EcoPulse! Estamos encantados de que te unas a nuestro movimiento global por la acción ambiental. Así es como puedes empezar a marcar la diferencia hoy.",
        "ready": "¡Todo listo. ¡Hora de explorar!",
        "step1": {
          "title": "1. Encuentra Iniciativas",
          "desc": "Dirígete a la pestaña Iniciativas para descubrir proyectos ambientales locales y microtareas que puedes completar desde casa."
        },
        "step2": {
          "title": "2. Únete a la Comunidad",
          "desc": "Consulta la pestaña Comunidad para sugerir nuevos desafíos, votar ideas y ver qué están haciendo otros Eco-Warriors."
        },
        "step3": {
          "title": "3. Registra Tu Impacto Real",
          "desc": "Participa en jornadas de limpieza reales, plantación de árboles y tareas digitales para ganar tus Horas Verdes (HV)."
        },
        "step4": {
          "title": "4. Gana Premios",
          "desc": "¡Realiza un seguimiento de tus Horas Verdes en tu Portafolio, sube en la Clasificación y, pronto, canjea tus HV por recompensas ecológicas premium!"
        },
        "step5": {
          "title": "5. Pregúntale a EcoBot",
          "desc": "¿Tienes preguntas? Intenta hacer clic en el ícono de chat flotante en la parte inferior derecha para hablar con nuestro EcoBot de IA en cualquier momento."
        }
      },
      "admin": {
        "title": "Panel del Administrador",
        "subtitle": "Revise y gestione los desafíos de la comunidad",
        "pending": "Desafíos Pendentes ({{count}})",
        "noPending": "No hay desafíos pendientes para revisar.",
        "reject": "Rechazar",
        "approve": "Aprobar",
        "suggestedBy": "Sugerido por: {{user}}"
      },
      "leaderboard": {
        "title": "Clasificación",
        "subtitle": "Principales Eco-Warriors con el mayor impacto",
        "global": "Global",
        "local": "Local",
        "hours": "Horas",
        "me": "Tú"
      },
      "chat": {
        "welcome": "¡Hola! Soy EcoBot. ¿Eres nuevo aquí? ¡Pídeme una guía de bienvenida o consulta la pestaña Guía!",
        "placeholder": "Pregunta sobre EcoPulse o sostenibilidad...",
        "error": "Lo siento, tengo problemas para conectarme en este momento."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
