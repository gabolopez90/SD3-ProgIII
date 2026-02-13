/// <reference lib="webworker" />  
/** 
 * Escucha los mensajes enviados desde el hilo principal. 
 * 'data' contiene la información del cálculo. 
 */ 
addEventListener('message', ({ data }) => {  
  // Extraemos la acción a realizar y el arreglo de precios del mensaje recibido 
  const { action, prices } = data;  
  // Verifica que sea un cálculo de estadísticas 
  if (action === 'CALCULATE_STATS') {  
    // 1. Cálculo del Promedio (Media aritmética) 
    // Sumamos todos los precios y dividimos por el total de elementos. 
    const average = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;  
    // 2. Cálculo de la Varianza 
    // Calculamos qué tan alejados están los precios respecto al promedio. 
    // (Suma de los cuadrados de la diferencia entre cada precio y el promedio) / total 
    const variance = prices.reduce((a: number, b: number) => a + Math.pow(b - average, 2), 0) / prices.length;  
    // 3. Cálculo de la Volatilidad (Desviación Estándar) 
    // Es la raíz cuadrada de la varianza. 
    const volatility = Math.sqrt(variance);  
    // Enviamos los resultados de vuelta al hilo principal 
    postMessage({ average, volatility });  
  }  
}); 