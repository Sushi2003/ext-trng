// Log that the script has been injected
console.log("OpenAI script injected");

// Define the getChatLog function
function getChatLog(document) {
    console.log("Chat result fetcher running...");
    // Select all div tags with data-message-author-role="user"
    const userMessages = document.querySelectorAll('div[data-message-author-role="user"]');

    // Select all div tags with data-message-author-role="assistant"
    const assistantMessages = document.querySelectorAll('div[data-message-author-role="assistant"]');

    // Iterate over both user and assistant messages simultaneously
    for (let i = 0; i < Math.max(userMessages.length, assistantMessages.length); i++) {
        // Display user message if available
        if (i < userMessages.length) {
            const userMessageText = userMessages[i].innerText.trim();
            console.log("User message:", userMessageText);
        }

        // Display assistant message if available
        if (i < assistantMessages.length) {
            const assistantMessageText = assistantMessages[i].innerText.trim();
            console.log("Assistant message:", assistantMessageText);
        }
    }
}

// Add an event listener to trigger the function on a click event
document.addEventListener('click', function() {
    getChatLog(document);
});