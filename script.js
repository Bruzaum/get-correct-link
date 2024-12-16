document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("gerarBotao").addEventListener("click", getText);
});

function getText() {
  const texto = document.getElementById("texto").value;
  const resultado = getLinkWithoutSpaces(texto);

  var copyText = getLinkWithoutSpaces(texto);

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
  ];

  const textWithoutSpaces = texto.split(" ").join("");

  for (let i = 0; i < prohibitedWords.length; i++) {
    if (textWithoutSpaces.includes(prohibitedWords[i])) {
      return (
        "O link contém " + prohibitedWords[i] + " e precisa ser corrigido!"
      );
    }
  }

  return textWithoutSpaces;
}
