export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = "DanCat Website";

export const APP_LOGO = "/dancart-logo.png";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  // Para o protótipo estático, sempre redirecionar para dev-login
  if (typeof window !== 'undefined') {
    const isProduction = window.location.hostname === 'dev-scube.github.io';
    if (isProduction) {
      return '/dancart-web/dev-login';
    }
  }
  
  return '/dev-login'; // Para desenvolvimento local
};
