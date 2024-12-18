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

  // Add error type next to the link or button
  const errorLabel = document.createElement('span');
  errorLabel.className = 'error-type';
  errorLabel.style.position = 'absolute';
  errorLabel.style.top = `${window.scrollY + rect.top}px`;
  errorLabel.style.left = `${window.scrollX + rect.left + rect.width + 5}px`; // Position to the right of the element
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
  errorMessage.innerHTML = message;  // Allow HTML content for line breaks
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
  const elements = document.querySelectorAll('a, button');
  const whitespacePattern = /\s/;
  const countryCodePatterns = /\[?country-?code\]?|\[?countrycode\]?/i;
  let whitespaceCount = 0;
  let countryCodeCount = 0;

  elements.forEach((el) => {
    const href = el.getAttribute('href');
    if (href) {
      if (whitespacePattern.test(href)) {
        whitespaceCount++;
        createHighlightOverlay(el, 'Espaço em branco');
      } else if (countryCodePatterns.test(href)) {
        countryCodeCount++;
        createHighlightOverlay(el, 'Country-code');
      }
    }
  });

  let message = '';
  if (whitespaceCount > 0) {
    message += `Links com espaço em branco: ${whitespaceCount}<br>`;
  }
  if (countryCodeCount > 0) {
    message += `Links com "country-code": ${countryCodeCount}`;
  }

  if (message) {
    displayMessage(message, true);
  } else {
    displayMessage('Nenhum erro encontrado!', false);
  }
}

scanPage();