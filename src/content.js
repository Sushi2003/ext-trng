import {v4} from 'uuid';
import {EVENT_TYPES} from "./utils/constants";

document.addEventListener('click', (e) => {
  if (window.location.href === 'https://mail.google.com/mail/u/0/#inbox') {
    return;
  }
  const messageContainer = findNearestMessageContainer(e.target);
  if (messageContainer) {
    const emailDetails = extractEmailDetails(messageContainer);
    const runtimeMessage = {messageId: v4(), eventType: EVENT_TYPES.GMAIL_SELECT_MESSAGE, emailDetails};
    console.log('message', runtimeMessage);
    chrome.runtime.sendMessage(runtimeMessage);
  } else {
    console.log('Clicked outside of an email message');
  }
});

/**
 * Function to find the nearest email message container for an HTML element.
 *
 * @param {HTMLElement} clickTarget The HTML element that was clicked.
 * @returns {HTMLElement|null} The closest ancestor that is an email message container, or null if none was found.
 */
function findNearestMessageContainer(clickTarget) {
  let currentElement = clickTarget;
  while (currentElement && !currentElement.hasAttribute('data-message-id')) {
    currentElement = currentElement.parentElement;
  }
  return currentElement;
}

/**
 * Function to extract the details of an email from a given message container.
 *
 * @param {HTMLElement} messageContainer The message container from which to extract the email details.
 * @returns {Object|null} An object containing email details if a valid message container was provided, or null otherwise.
 */
function extractEmailDetails(messageContainer) {
  if (!messageContainer) {
    console.error('No valid message container found');
    return null;
  }

  const subjectElement = document.querySelector('[data-thread-perm-id]');
  const threadPermId = subjectElement.getAttribute('data-thread-perm-id');
  const legacyThreadId = subjectElement.getAttribute('data-legacy-thread-id');
  const subject = subjectElement.textContent.trim();

  // Extract message ID
  const messageId = messageContainer.getAttribute('data-message-id');

  // Extract email addresses and other information directly from known attributes
  const emailInfo = messageContainer.querySelectorAll('[email]');
  const from = emailInfo[0]?.getAttribute('email');
  const to = emailInfo[1]?.getAttribute('email');


  const nameElement = messageContainer.querySelector('[name][email]')
  const name = nameElement.getAttribute('name')

  // Extract date from a known attribute like title or alt which might store the date
  const dateSpan = messageContainer.querySelector('[title*="20"], [alt*="20"]'); // Assuming date contains year like "2024"
  const date = dateSpan ? dateSpan.getAttribute('title') || dateSpan.getAttribute('alt') : null;

  const metadata = {
    messageId,
    from,
    name,
    to,
    date,
    legacyThreadId,
    threadPermId
  };

  // Extract email body text
  const bodyText = messageContainer.querySelector('[dir="ltr"]')?.textContent.trim();

  return {
    messageId,
    metadata,
    subject,
    body: bodyText,
    user: {
      email: from,
      name
    }
  };
}