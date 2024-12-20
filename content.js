function clearHighlights() {
  document.querySelectorAll('.highlight-overlay').forEach((el) => el.remove());
  document.querySelectorAll('.error-type').forEach((el) => el.remove());

  const errorMessage = document.querySelector('.error-message');
  if (errorMessage) errorMessage.remove();
}

function createHighlightOverlay(element, errorType) {
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

  const errorLabel = document.createElement('span');
  errorLabel.className = 'error-type';
  errorLabel.style.position = 'absolute';
  errorLabel.style.top = `${window.scrollY + rect.top}px`;
  errorLabel.style.left = `${window.scrollX + rect.left + rect.width + 5}px`;
  errorLabel.style.fontSize = '12px';
  errorLabel.style.backgroundColor = '#ff4d4d';
  errorLabel.style.color = 'white';
  errorLabel.style.padding = '2px 5px';
  errorLabel.style.borderRadius = '5px';
  errorLabel.style.zIndex = '1001';
  errorLabel.textContent = errorType;
  document.body.appendChild(errorLabel);
}

function displayMessage(message, isError) {
  const existingMessage = document.querySelector('.error-message');
  if (existingMessage) existingMessage.remove();

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
  errorMessage.innerHTML = message;
  document.body.appendChild(errorMessage);

  if (!isError) {
    setTimeout(() => {
      if (errorMessage.parentNode) {
        errorMessage.remove();
      }
    }, 30000);
  }
}

function scanPage() {
  const elements = document.querySelectorAll('a, button, input[type="text"], input[type="url"]');
  const whitespacePattern = /\s/;
  const countryCodePatterns = /\[?country-?code\]?|\[?countrycode\]?/i;
  const urlPattern = /https|\/+/;
  let whitespaceCount = 0;
  let countryCodeCount = 0;
  let urlErrorCount = 0;

  elements.forEach((el) => {
    const href = el.getAttribute('href');
    if (el.tagName === 'A' && href) {
      if (whitespacePattern.test(href)) {
        whitespaceCount++;
        createHighlightOverlay(el, 'Espaço em branco');
      } else if (countryCodePatterns.test(href)) {
        countryCodeCount++;
        createHighlightOverlay(el, 'Country-code');
      }
    }

    if ((el.tagName === 'INPUT' && el.type === 'text') || (el.tagName === 'INPUT' && el.type === 'url')) {
      const value = el.value;
      if (whitespacePattern.test(value)) {
        createHighlightOverlay(el, 'Espaço em branco no input');
      } else if (urlPattern.test(value)) {
        urlErrorCount++;
        createHighlightOverlay(el, 'Contém "https" ou "/"');
      }
    }
  });

  let message = '';
  if (whitespaceCount > 0) {
    message += `Links com espaço em branco: ${whitespaceCount}<br>`;
  }
  if (countryCodeCount > 0) {
    message += `Links com "country-code": ${countryCodeCount}<br>`;
  }
  if (urlErrorCount > 0) {
    message += `Campos de texto com "https" ou "/": ${urlErrorCount}`;
  }

  if (message) {
    displayMessage(message, true);
  } else {
    displayMessage('Nenhum erro encontrado!', false);
  }
}

clearHighlights();
scanPage();
