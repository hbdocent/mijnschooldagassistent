let woordenlijst = {};

fetch("woorden.json")
.then(response => response.json())
.then(data => {
    woordenlijst = data;
});

document
.getElementById("ocrButton")
.addEventListener("click", startOCR);

async function startOCR(){

    const file =
    document.getElementById("imageInput").files[0];

    if(!file){
        alert("Kies eerst een afbeelding");
        return;
    }

    document.getElementById("status").innerHTML =
    "Tekst herkennen...";

    const resultaat =
    await Tesseract.recognize(
        file,
        "nld"
    );

    document.getElementById("status").innerHTML =
    "✅ Klaar";

    toonTekst(resultaat.data.text);
}

function toonTekst(text){

    const woorden = text.split(" ");

    let html = "";

    woorden.forEach(woord => {

        const schoon =
        woord
        .toLowerCase()
        .replace(/[.,!?]/g,"");

        if(woordenlijst[schoon]){

            html +=
            `<span
            class="word"
            onclick="toonBetekenis('${schoon}')">
            ${woord}
            </span> `;

        } else {

            html += woord + " ";
        }

    });

    document.getElementById("result").innerHTML =
    html;
}

function toonBetekenis(woord){

    const uitleg =
    woordenlijst[woord];

    document.getElementById("definitionBox").innerHTML =
    `
    <h2>${woord}</h2>

    <p>${uitleg}</p>

    <button onclick="spreek('${woord}. ${uitleg}')">

    🔊 Voorlezen

    </button>

    <button onclick="bewaarWoord('${woord}')">

    ⭐ Bewaren

    </button>
    `;
}

function spreek(tekst){

    const speech =
    new SpeechSynthesisUtterance();

    speech.lang = "nl-NL";
    speech.text = tekst;

    speechSynthesis.speak(speech);
}

function bewaarWoord(woord){

    let woorden =
    JSON.parse(
        localStorage.getItem("woorden")
    ) || [];

    if(!woorden.includes(woord)){
        woorden.push(woord);
    }

    localStorage.setItem(
        "woorden",
        JSON.stringify(woorden)
    );

    alert("Woord opgeslagen");
}