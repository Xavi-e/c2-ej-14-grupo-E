/* global mapboxgl luxon */

// Datos para las APIs
const geocodingApi = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const mapboxToken =
  "pk.eyJ1IjoibWljaGFlbHNwMTEiLCJhIjoiY2twaTdxdmgxMDY0dTJ3cXl4ZHRtM3prbiJ9.Mac0yVJ1kc1mI8l9ToexvQ"; // Mete aquí el Token de Mapbox
const tmbApi = "https://api.tmb.cat/v1/planner/plan";
const appId = "01bbdcb5"; // Mete aquí el app_id de TMB
const appKey = "c55005f476ab9dd388e08a4951a56140"; // Mete aquí el app_key de TMB
mapboxgl.accessToken = mapboxToken;

// LLama a esta función para generar el pequeño mapa que sale en cada paso
// Le tienes que pasar un array con las dos coordenadas y el elemento HTML donde tiene que generar el mapa
const generaMapa = (coordenadas, mapa) => {
  const mapbox = new mapboxgl.Map({
    container: mapa,
    style: "mapbox://styles/mapbox/streets-v11",
    center: coordenadas,
    zoom: 14,
  });
};

// Coordenadas que se mandarán a la API de TMB. Tienes que alimentar este objeto a partir de las coordenadas que te dé la API de Mapbox
const coordenadas = {
  desde: {
    latitud: 0,
    longitud: 0,
  },
  hasta: {
    latitud: 0,
    longitud: 0,
  },
};
// Obtenemos las coordenadas de nuestra posicion actual
const getUbicacionActual = (latitud, longitud) => {
  navigator.geolocation.getCurrentPosition((pos) => {
    latitud = pos.coords.latitude;
    longitud = pos.coords.longitude;
  });
};

// Capturado en una constante el formulario de las direcciones
const formCoordenadas = document.querySelector(".form-coordenadas");
// Capturamos los radio button de origen
const elementoDeMiUbicacion = formCoordenadas.querySelector("#de-mi-ubicacion");
const elementoDeDireccion = formCoordenadas.querySelector("#de-direccion");
// Capturamos los radio button de destino(mi ubicacion y direccion)
const elementoAMiUbicacion = formCoordenadas.querySelector("#a-mi-ubicacion");
const elementoADireccion = formCoordenadas.querySelector("#a-direccion");
// Si el usuario elige "Introducir dirección", debe aparecer el input debajo, para que introduzca una dirección.
elementoADireccion.addEventListener("change", () => {
  formCoordenadas
    .querySelector(".a-direccion-definitiva")
    .classList.remove("direccion-definitiva");
});
elementoDeDireccion.addEventListener("change", () => {
  formCoordenadas
    .querySelector(".de-direccion-definitiva")
    .classList.remove("direccion-definitiva");
});
// Si el usuario decide poner su ubicación, el input desaparece
elementoAMiUbicacion.addEventListener("change", () => {
  formCoordenadas
    .querySelector(".a-direccion-definitiva")
    .classList.add("direccion-definitiva");
});
elementoDeMiUbicacion.addEventListener("change", () => {
  formCoordenadas
    .querySelector(".de-direccion-definitiva")
    .classList.add("direccion-definitiva");
});

const nombreDeDireccion = formCoordenadas.querySelector(
  ".nombre-lugar-de-direccion"
);
const nombreADireccion = formCoordenadas.querySelector(
  ".nombre-lugar-a-direccion"
);
// Función para preparar el envia a la API de Mapbox
const prepararEnvio = () => {
  // Mandamos el fetch de direccion de origen a la API de Mapbox
  asignarCoordenadas(
    `${deDireccionDefinitiva.value}`,
    `${aDireccionDefinitiva.value}`
  );
};
const deDireccionDefinitiva = formCoordenadas.querySelector(
  ".de-direccion-definitiva"
);
const aDireccionDefinitiva = formCoordenadas.querySelector(
  ".a-direccion-definitiva"
);
// Función para esperar a terminar de escribir coordenadas
let timer = 0;
deDireccionDefinitiva.addEventListener("input", () => {
  if (timer) {
    clearTimeout(timer);
    timer = 0;
    timer = setTimeout(prepararEnvio, 500);
  } else {
    timer = setTimeout(prepararEnvio, 500);
  }
});
let timerB = 0;
aDireccionDefinitiva.addEventListener("input", () => {
  if (timerB) {
    clearTimeout(timerB);
    timerB = 0;
    timerB = setTimeout(prepararEnvio, 500);
  } else {
    timerB = setTimeout(prepararEnvio, 500);
  }
});

let coordenadasDesdeLatitud = coordenadas.desde.latitud;
let coordenadasDesdeLongitud = coordenadas.desde.longitud;
let coordenadasHastaLatitud = coordenadas.hasta.latitud;
let coordenadasHastaLongitud = coordenadas.hasta.longitud;

const asignarCoordenadas = (direccionOrigen, direccionDestino) => {
  fetch(`${geocodingApi}${direccionOrigen}.json?access_token=${mapboxToken}`)
    .then((response) => response.json())
    .then(({ features }) => {
      const {
        geometry: { coordinates },
      } = features[0];
      coordenadasDesdeLatitud = coordinates[1];
      coordenadasDesdeLongitud = coordinates[0];
      nombreDeDireccion.textContent = features[0].place_name;
    });
  fetch(`${geocodingApi}${direccionDestino}.json?access_token=${mapboxToken}`)
    .then((response) => response.json())
    .then(({ features }) => {
      const {
        geometry: { coordinates },
      } = features[0];
      coordenadasHastaLatitud = coordinates[1];
      coordenadasHastaLongitud = coordinates[0];
      nombreADireccion.textContent = features[0].place_name;
    });
};

const btnEnviarCoords = formCoordenadas.querySelector(".btn-enviar-coords");
// NO HARCODEAR, CAMBIAR LINEAS DE ABAJO

const fechaDeHoy = luxon.DateTime.now();
const fechaDeHoyOrdenada = `${fechaDeHoy.month}/${fechaDeHoy.day}/${fechaDeHoy.year}`;

// Hora actual no correcta, devuelve 21:7 si son las 21:07, ademas la api de TMB requiere un am o pm detras.

const getMinutoActual = (fechaDeHoy) => {
  let minuto = fechaDeHoy.minute;
  if (minuto < 10) {
    minuto = `0${minuto}`;
  }
  return minuto;
};

const getHoraActual = (fechaDeHoy) => {
  let hora = fechaDeHoy.hour;
  let pmAm;
  if (hora > 12) {
    hora = `${hora % 12}`;
    pmAm = "pm";
  } else {
    pmAm = "am";
  }
  return `${hora}:${getMinutoActual(fechaDeHoy)}${pmAm}`;
};
const horaActual = `${getHoraActual(fechaDeHoy)}`;

btnEnviarCoords.addEventListener("click", (e) => {
  e.preventDefault();
  fetch(
    `${tmbApi}?app_id=${appId}&app_key=${appKey}&fromPlace=${coordenadasDesdeLatitud},${coordenadasDesdeLongitud}&toPlace=${coordenadasHastaLatitud},${coordenadasHastaLongitud}&date=${fechaDeHoyOrdenada}&${horaActual}&arriveBy=true&mode=TRANSIT,WALK`
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response.plan);
    });
});
