import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app": {
        "name": "EcoPulse",
        "tagline": "Pulse for a sustainable future"
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
      }
    }
  },
  pt: {
    translation: {
      "app": {
        "name": "EcoPulse",
        "tagline": "Pulso para um futuro sustentável"
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
      }
    }
  },
  es: {
    translation: {
      "app": {
        "name": "EcoPulse",
        "tagline": "Pulso por un futuro sostenible"
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
