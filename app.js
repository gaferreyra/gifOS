const apikey = "AaJcPBnKSjF8ltWIcB6PK4U28cyaZ2J5";
const urlGiphy = "https://api.giphy.com/v1/gifs/";

let buscarInputElement = document.getElementById("buscarinput");
let btnBuscar = document.getElementById("btnBuscar");
let logo = document.getElementById("logo");
let cguifos = document.getElementById("cguifos");
let misGuifos = document.getElementById("misGuifos");
let botones = document.getElementsByClassName("botonClick");
let out = document.querySelector(".buscados");

let palabraBoton = (palabra) => buscarInputElement.value = palabra;

let indiceTheme = sessionStorage.getItem("theme");

if (indiceTheme == null) {
    sessionStorage.setItem('theme', "0");
}


function displayNoneBlock(idNodo, valor) {

    let nodo = document.getElementById(idNodo);

    if (valor == "") {
        if (window.getComputedStyle(nodo).display === "none") {
            nodo.style.display = "block";
        } else {
            nodo.style.display = "none";
        }
    } else {
        nodo.style.display = valor;
    }
}

let propiedadesThemes =
    [
        {//Sailor Day = 0
            colorFondoBody: "rgba(247, 201, 243,0.2)",
            gradienteTheme: "linear-gradient(270deg, #F7C9F3 0%, #4180F6 100%)",
            gifOfLogo: "./assets/gifOF_logo.png",
            colorFontBotonesRosa: "#110038",
            colorBotonRosa: "#F7C9F3",
            colorBotonRosaHover: '#E6BBE2',
            colorBotonSailorHover: "#FFF4FD",
            colorBotonVerMas: "#4180F6",
            colorBotonVerMasHover: "#3A72DB",
            colorBuscar: "#E6E6E6",
            colorBotonBuscarOpciones: "#F0F0F0"
        },
        {//Sailor Night = 1
            colorFondoBody: "rgba(19, 15, 64,1.0)",
            gradienteTheme: "linear-gradient(270deg, #EE3EFE 0%, #2E32FB 100%)",
            gifOfLogo: "./assets/gifOF_logo_dark.png",
            colorFontBotonesRosa: "#FFFFFF",
            colorBotonRosa: "#EE3EFE",
            colorBotonRosaHover: '#CE36DB',
            colorBotonSailorHover: "#2E32FB",
            colorBotonVerMas: "#2E32FB",
            colorBotonVerMasHover: "#2629CC",
            colorBuscar: "#B4B4B4",
            colorBotonBuscarOpciones: "#CCCCCC"
        }
    ];


function cambiarTheme() {
    indiceTheme = sessionStorage.getItem("theme");
    let propiedades = Object.keys(propiedadesThemes[indiceTheme]);
    let root = document.documentElement;

    for (i = 0; i < propiedades.length; i++) {
        if (propiedades[i] != "gifOfLogo") {
            //root.style.setProperty('--colorFondoBody', "rgba(19, 15, 64,1.0)");
            root.style.setProperty("--" + propiedades[i], GetPropertyValue(propiedadesThemes[indiceTheme], propiedades[i]));
        } else {
            window.logo.src = GetPropertyValue(propiedadesThemes[indiceTheme], propiedades[i]);
        }
    }
}

function cambiarThemeSessionStorage(indiceTheme2) {
    sessionStorage.setItem('theme', indiceTheme2);
    cambiarTheme();
}

function GetPropertyValue(object, dataToRetrieve) {
    dataToRetrieve.split('.').forEach(function (token) {
        if (object) object = object[token];
    });

    return object;
}

for (const iterator of botones) {
    document.getElementById(iterator.id).addEventListener("click", ev => { buscargif(iterator.id) });
}


try {
    buscarInputElement.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            btnBuscar.click();
        }
    });
}
catch{
}

function buscargif(boton) {
    let busqueda;
    let vEndpoint;

    try {
        busqueda = buscarInputElement.value.trim();
    }
    catch{
        busqueda = "";
    }

    if (busqueda == "") {
        if (boton == "btnBuscar") {
            vEndpoint = "";
            changeText("No se han encontrados resultados para tu busqueda");
            out.innerHTML = "";
        } else {
            vEndpoint = "trending"
        }
    } else {
        vEndpoint = "search"
        changeText(busqueda);
    }

    if (vEndpoint != "") {
        buscaGiphy(urlGiphy, vEndpoint, apikey, 24, busqueda);
    }
}

buscargif("");

function changeText(texto) {
    document.getElementById("content").innerHTML = texto;
}

function buscaGiphy(url, endpoint, apikey, cantidadGif, palabraABuscar) {
    let urlCompleta = url + endpoint + "?api_key=" + apikey + "&limit=" + cantidadGif + "&q=" + palabraABuscar;

    fetch(urlCompleta)
        .then(response => response.json())
        .then(content => {
            try {
                out.innerHTML = "";
                for (const iterator of content.data) {
                    let fig = document.createElement("figure");
                    let img = document.createElement("img");
                    img.src = iterator.images.downsized.url;
                    img.alt = iterator.title;
                    img.classList.add("buscados__gif");
                    fig.classList.add("buscados__gif");
                    fig.appendChild(img);
                    out.insertAdjacentElement("afterbegin", fig);
                }
            }
            catch{
            }
        })
        .catch(err => {
            console.error(err);
        });
}

function mostrarSugerencia() {
    if (buscarInputElement.value.trim().length > 0) {
        displayNoneBlock("idbuscar", "block");
        btnBuscar.classList.remove("boton--buscar-color");
        buscarInputElement.style.color = "#110038";
    } else {
        displayNoneBlock("idbuscar", "none");
        btnBuscar.classList.add("boton--buscar-color");
        buscarInputElement.style.color = "#B4B4B4";
    }
}

try {
    buscarInputElement.addEventListener("keyup", (ev) => { mostrarSugerencia() });
}
catch{
}

try {
    buscarInputElement.addEventListener('focusout', (event) => {
        setTimeout(f => displayNoneBlock('idbuscar', 'none'), 150);
    });
}
catch{
}

misGuifos.addEventListener("click", (ev) => {
    sessionStorage.setItem('botonclick', misGuifos.id);
    location.href = './upload.html';
});

cguifos.addEventListener("click", (ev) => {
    sessionStorage.setItem('botonclick', cguifos.id);
    location.href = './upload.html';
    cambiarTheme();
});

cambiarTheme();