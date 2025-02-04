const readline = require('readline-sync');
const axios = require('axios');

async function obtenerTasasDeCambio() {
  const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
  return response.data.rates;
}

function mostrarMenu() {
  console.log("\nConvertidor de Divisas:");
  console.log("1. Mostrar lista de monedas");
  console.log("2. Mostrar tasas de cambio");
  console.log("3. Establecer monedas");
  console.log("4. Establecer cantidad a convertir");
  console.log("5. Ver historial de conversiones");
  console.log("6. Salir");
}

function mostrarMonedas(tasas) {
  console.log("\nLista de Monedas:");
  for (let moneda in tasas) {
    console.log(moneda);
  }
}

function mostrarTasasDeCambio(tasas) {
  console.log("\nTasas de Cambio:");
  for (let moneda in tasas) {
    console.log(`${moneda}: ${tasas[moneda]}`);
  }
}

function convertirDivisa(cantidad, monedaOrigen, monedaDestino, tasas) {
  if (!tasas[monedaOrigen] || !tasas[monedaDestino]) {
    console.log("Moneda no válida.");
    return null;
  }
  const cantidadConvertida = (cantidad / tasas[monedaOrigen]) * tasas[monedaDestino];
  return cantidadConvertida.toFixed(2);
}

async function principal() {
  const tasas = await obtenerTasasDeCambio();
  let historial = [];
  let monedaOrigen = null;
  let monedaDestino = null;
  let cantidad = null;

  while (true) {
    mostrarMenu();
    const opcion = readline.question("Elige una opcion:");

    switch (opcion) {
      case '1':
        mostrarMonedas(tasas);
        break;
      case '2':
        mostrarTasasDeCambio(tasas);
        break;
      case '3':
        monedaOrigen = readline.question("Ingresa la moneda de origen: ").toUpperCase();
        monedaDestino = readline.question("Ingresa la moneda de destino: ").toUpperCase();
        break;
      case '4':
        cantidad = parseFloat(readline.question("Ingresa la cantidad a convertir: "));
        if (isNaN(cantidad)) {
          console.log("Cantidad no válida.");
          cantidad = null;
        } else if (monedaOrigen && monedaDestino) {
          const resultado = convertirDivisa(cantidad, monedaOrigen, monedaDestino, tasas);
          if (resultado !== null) {
            console.log(`\n${cantidad} ${monedaOrigen} = ${resultado} ${monedaDestino}`);
            historial.push(`${cantidad} ${monedaOrigen} a ${resultado} ${monedaDestino}`);
          }
        } else {
          console.log("Establece primero las monedas de origen y destino.");
        }
        break;
      case '5':
        console.log("\nHistorial de Conversiones:");
        historial.forEach((entrada, indice) => {
          console.log(`${indice + 1}. ${entrada}`);
        });
        break;
      case '6':
        console.log("Saliendo del programa...");
        return;
      default:
        console.log("Opción no válida, por favor intenta de nuevo.");
    }
  }
}

principal();