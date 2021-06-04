/* global mapboxgl */

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
//Capturado en una constante el formulario de las direcciones
const formCoordenadas = document.querySelector(".form-coordenadas");
//Capturamos los radio button de origen
const elementoDeMiUbicacion = formCoordenadas.querySelector("#de-mi-ubicacion");
const elementoDeDireccion = formCoordenadas.querySelector("#de-direccion");
//Capturamos los radio button de destino(mi ubicacion y direccion)
const elementoAMiUbicacion = formCoordenadas.querySelector("#a-mi-ubicacion");
const elementoADireccion = formCoordenadas.querySelector("#a-direccion");
//Si el usuario elige "Introducir dirección", debe aparecer el input debajo, para que introduzca una dirección.
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
//Si el usuario decide poner su ubicación, el input desaparece
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