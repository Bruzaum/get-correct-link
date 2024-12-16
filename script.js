document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("gerarBotao").addEventListener("click", getText);
});

function getText() {
  const texto = document.getElementById("texto").value;
  const resultado = getLinkWithoutSpaces(texto);

  var copyText = resultado;

  document.getElementById("resultado").textContent = resultado;

  navigator.clipboard
    .writeText(copyText)
    .then(() => {
      document.getElementById("tooltip").classList.add("show");
      setTimeout(() => {
        document.getElementById("tooltip").classList.remove("show");
      }, 3000);
    })
    .catch(() => {
      alert("error");
    });
}

function getLinkWithoutSpaces(texto) {
  const prohibitedWords = [
    "[country-code]",
    "country-code",
    "[countrycode]",
    "countrycode",
    "[cc]",
  ];

  let textWithoutSpaces = texto.split(" ").join("");

  let protocol = "";
  if (textWithoutSpaces.startsWith("https://")) {
    protocol = "https://";
    textWithoutSpaces = textWithoutSpaces.substring(8);  
  } else if (textWithoutSpaces.startsWith("http://")) {
    protocol = "http://";

    textWithoutSpaces = textWithoutSpaces.substring(7);  
  }

  textWithoutSpaces = textWithoutSpaces.replace(/\/{2,}/g, "/");

  const cleanedText = protocol + textWithoutSpaces;

  for (let i = 0; i < prohibitedWords.length; i++) {
    if (cleanedText.includes(prohibitedWords[i])) {
      return (
        "O link contém " + prohibitedWords[i] + " e precisa ser corrigido!"
      );
    }
  }

  return cleanedText;
}
