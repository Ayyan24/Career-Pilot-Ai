// ==========================================
// CONFIGURATION
// ==========================================

const API_KEY = "YOUR_ACTUAL_API_KEY_HERE";

const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";

const SYSTEM_PROMPT = `
You are a friendly Career Guidance Assistant...

Keep responses short, practical, student-friendly.
`;

// ==========================================
// STATE MANAGEMENT
// ==========================================

let conversationHistory = [];
let isWaitingForResponse = false;
let chatbotMinimized = false;

// ==========================================
// DOM ELEMENTS (SAFE CACHE)
// ==========================================

const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const typingIndicator = document.getElementById("typingIndicator");
const chatContainer = document.querySelector(".chatbot-container");
const sendButton = document.querySelector(".chatbot-send-btn");
const inputArea = document.querySelector(".chatbot-input-area");

// ==========================================
// INITIALIZATION (SAFE)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    if (chatInput) {
        chatInput.addEventListener("keydown", handleKeyDown);
        chatInput.focus();
    }

    if (sendButton) {
        sendButton.addEventListener("click", sendMessage);
    }

    // Prevent layout break on resize (important for responsiveness)
    window.addEventListener("resize", handleResize);

    console.log("✅ Chatbot initialized");
});

// ==========================================
// RESPONSIVE FIX ON RESIZE
// ==========================================

function handleResize() {
    if (!chatContainer) return;

    // If screen becomes large again, restore proper size if minimized
    if (window.innerWidth > 768 && chatbotMinimized) {
        restoreChatbot();
    }
}

// ==========================================
// KEY INPUT HANDLING
// ==========================================

function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (!isWaitingForResponse) sendMessage();
    }
}

// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage() {
    const userMessage = chatInput?.value?.trim();

    if (!userMessage) return;

    if (isWaitingForResponse) return;

    addMessage(userMessage, "user");

    chatInput.value = "";
    chatInput.focus();

    conversationHistory.push({ role: "user", content: userMessage });

    showTyping();
    isWaitingForResponse = true;
    setUIState(false);

    try {
        const response = await getAIResponse(userMessage);

        addMessage(response, "ai");

        conversationHistory.push({
            role: "assistant",
            content: response,
        });
    } catch (err) {
        showError("Something went wrong. Try again.");
    } finally {
        hideTyping();
        isWaitingForResponse = false;
        setUIState(true);
        scrollToBottom();
    }
}

// ==========================================
// MOCK AI RESPONSE ENGINE
// ==========================================

async function getAIResponse(message) {
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));

    const msg = message.toLowerCase();

    const knowledge = {
        web: "Web Dev = HTML, CSS, JS + React + Backend",
        ai: "AI = Python + Math + ML + Projects",
        cyber: "Cybersecurity = Networking + Linux + Ethical Hacking",
        design: "Design = Photoshop + UI/UX + Creativity",
    };

    for (const key in knowledge) {
        if (msg.includes(key)) return knowledge[key];
    }

    return "Tell me about Web Dev, AI, Cybersecurity, Design or Career Roadmap 👍";
}

// ==========================================
// UI FUNCTIONS (CORE FIXED)
// ==========================================

function addMessage(text, type) {
    if (!chatMessages) return;

    const wrapper = document.createElement("div");
    wrapper.className = `message ${type}-message`;

    const bubble = document.createElement("div");
    bubble.className = "message-content";
    bubble.innerHTML = formatText(text);

    wrapper.appendChild(bubble);
    chatMessages.appendChild(wrapper);

    scrollToBottom();
}

function formatText(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");
}

// ==========================================
// TYPING INDICATOR
// ==========================================

function showTyping() {
    if (typingIndicator) {
        typingIndicator.style.display = "flex";
        scrollToBottom();
    }
}

function hideTyping() {
    if (typingIndicator) {
        typingIndicator.style.display = "none";
    }
}

// ==========================================
// SCROLL FIX (IMPORTANT FOR MOBILE)
// ==========================================

function scrollToBottom() {
    if (!chatMessages) return;

    requestAnimationFrame(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

// ==========================================
// UI STATE CONTROL
// ==========================================

function setUIState(enabled) {
    if (sendButton) sendButton.disabled = !enabled;
    if (chatInput) chatInput.disabled = !enabled;
}

// ==========================================
// ERROR HANDLING
// ==========================================

function showError(msg) {
    addMessage("⚠️ " + msg, "ai");
}

// ==========================================
// TOGGLE CHATBOT (FIXED RESPONSIVE VERSION)
// ==========================================

function toggleChatbot() {
    if (!chatContainer) return;

    chatbotMinimized = !chatbotMinimized;

    if (chatbotMinimized) {
        chatContainer.style.height = "60px";
        chatContainer.style.width = "280px";

        if (chatMessages) chatMessages.style.display = "none";
        if (inputArea) inputArea.style.display = "none";
        if (typingIndicator) typingIndicator.style.display = "none";
    } else {
        restoreChatbot();
    }
}

function restoreChatbot() {
    if (!chatContainer) return;

    chatbotMinimized = false;

    chatContainer.style.height = "";
    chatContainer.style.width = "";

    if (chatMessages) chatMessages.style.display = "flex";
    if (inputArea) inputArea.style.display = "flex";

    scrollToBottom();
}

// ==========================================
// GLOBAL API (OPTIONAL)
// ==========================================

window.ChatbotAPI = {
    sendMessage,
    toggleChatbot,
    clear: () => {
        if (chatMessages) chatMessages.innerHTML = "";
        conversationHistory = [];
    },
};

console.log("🚀 Chatbot Ready (Responsive Version)");

System.Collections.Hashtable.text
