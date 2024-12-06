export const config = {
  API_BASE_URL: 'http://127.0.0.1:8000/api', // la que debe pasar stefano
  PRO_API_URL: 'http://somepalce:someport/api',

}


export const getTokenFromCookie = () => {
  const allCookies = document.cookie;
  // console.log('Todas las cookies:', allCookies); // Log para verificar todas las cookies

  const name = "token=";
  const decodedCookie = decodeURIComponent(allCookies);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim(); // Elimina espacios en blanco al inicio y al final
    // console.log(`Cookie actual: ${c}`); // Log para verificar cada cookie
    if (c.startsWith(name)) {
      const token = c.substring(name.length, c.length);
      // console.log('Token obtenido de la cookie:', token); // Log para verificar el token
      return token;
    }
  }
  // console.log('Token no encontrado en las cookies');
  
  // Buscar el token en sessionStorage si no se encuentra en las cookies
  const sessionToken = sessionStorage.getItem('token');
  if (sessionToken) {
    // console.log('Token obtenido de sessionStorage:', sessionToken); // Log para verificar el token
    return sessionToken;
  }

  // console.log('Token no encontrado en sessionStorage');
  return '';
};