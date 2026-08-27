export const THEME_STORAGE_KEY = "mecuadra-theme";

export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;
