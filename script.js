/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Read API key from secrets.js.
// This supports either: const OPENAI_API_KEY = "..."; OR window.OPENAI_API_KEY = "...";
const apiKey =
  typeof OPENAI_API_KEY !== "undefined"
    ? OPENAI_API_KEY
    : window.OPENAI_API_KEY;
const apiUrl = "https://api.openai.com/v1/chat/completions";

// Keep chat history so the assistant remembers context
const messages = [
  {
    role: "system",
    content:
      "You are a helpful L'Oreal Product Advisor assistant. You only answer questions about L'Oreal products, beauty routines, skincare, haircare, makeup, and beauty recommendations. If a question is unrelated, politely refuse and redirect to L'Oreal or beauty topics.",
  },
];

// Add a message to the chat UI
function addMessage(sender, text, cssClass) {
  const messageEl = document.createElement("p");
  messageEl.className = `msg ${cssClass}`;

  const labelEl = document.createElement("strong");
  labelEl.textContent = `${sender}: `;

  const textEl = document.createElement("span");
  textEl.textContent = text;

  messageEl.appendChild(labelEl);
  messageEl.appendChild(textEl);
  chatWindow.appendChild(messageEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Set initial message
chatWindow.innerHTML = "";
addMessage("Chatbot", "Hello! How can I help you today?", "ai");

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Show user's message clearly in the chat window
  addMessage("You", userMessage, "user");
  userInput.value = "";

  // Add user message to conversation history
  messages.push({
    role: "user",
    content: userMessage,
  });

  // If no key is available, show a clear setup message
  if (!apiKey) {
    addMessage(
      "Chatbot",
      "Missing API key. Add OPENAI_API_KEY in secrets.js to connect.",
      "ai",
    );
    return;
  }

  addMessage("Chatbot", "Thinking...", "ai");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Remove temporary "Thinking..." line
    const lastMessage = chatWindow.lastElementChild;
    if (lastMessage && lastMessage.textContent.includes("Thinking...")) {
      lastMessage.remove();
    }

    // Show chatbot response clearly and keep it in history
    addMessage("Chatbot", aiResponse, "ai");
    messages.push({
      role: "assistant",
      content: aiResponse,
    });
  } catch (error) {
    const lastMessage = chatWindow.lastElementChild;
    if (lastMessage && lastMessage.textContent.includes("Thinking...")) {
      lastMessage.remove();
    }

    addMessage(
      "Chatbot",
      "Sorry, something went wrong. Please try again.",
      "ai",
    );
    console.error(error);
  }
});
