function clearHighlights() {
  document.querySelectorAll('.highlight-overlay').forEach((el) => el.remove());

  const errorMessage = document.querySelector('.error-message');
  if (errorMessage) errorMessage.remove();
}

function createHighlightOverlay(element) {
  const rect = element.getBoundingClientRect();
  const overlay = document.createElement('div');
  overlay.className = 'highlight-overlay';
  overlay.style.position = 'absolute';
  overlay.style.top = `${window.scrollY + rect.top}px`;
  overlay.style.left = `${window.scrollX + rect.left}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
  overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '1000';
  document.body.appendChild(overlay);
}

function displayMessage(message, isError) {
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  errorMessage.style.position = 'fixed';
  errorMessage.style.bottom = '10px';
  errorMessage.style.right = '10px';
  errorMessage.style.backgroundColor = isError ? '#ff4d4d' : '#4caf50';
  errorMessage.style.color = 'white';
  errorMessage.style.padding = '10px 15px';
  errorMessage.style.borderRadius = '5px';
  errorMessage.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
  errorMessage.style.zIndex = '1000';
  errorMessage.textContent = message;
  document.body.appendChild(errorMessage);
}


function scanPage() {

  const elements = document.querySelectorAll('a, button');

  const whitespacePattern = /\s/;

  const countryCodePatterns = /\[?country-?code\]?|\[?countrycode\]?/i;

  let errorCount = 0;

  elements.forEach((el) => {
    const href = el.getAttribute('href');
    if (href) {
      if (whitespacePattern.test(href) || countryCodePatterns.test(href)) {
        errorCount++;

        createHighlightOverlay(el);
        console.warn(`Erro encontrado no link: ${href}`, el);
      }
    }
  });

  if (errorCount > 0) {
    displayMessage(`Links com erro: ${errorCount}`, true);
  } else {
    displayMessage('Nenhum link com espaço ou country-code foi encontrado!', false);
  }
}

scanPage();
