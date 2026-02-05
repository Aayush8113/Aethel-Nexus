# 🤖 Aethel-Nexus
> A High-Performance AI Conversational Platform built with the MERN Stack and Gemini Pro.

![Status](https://img.shields.io/badge/Status-Active-success)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)

## 🌟 Features
* **Real-time AI Interaction:** Powered by Google's Gemini Pro & Flash models.
* **Smart Context:** The AI remembers conversation history for seamless context.
* **Auto-Fallback Engine:** Automatically switches between Gemini 3.0, 2.0, and 1.5 to prevent crashes.
* **Professional UI:** Glassmorphism design with smooth fade-in animations.
* **Typing Indicators:** Real-time bouncing dot animations while the AI thinks.
* **Markdown Support:** Renders code blocks, tables, and bold text beautifully.
* **Syntax Highlighting:** Professional code blocks with VS Code theme and copy-to-clipboard.

## 🛠️ Tech Stack
* **Frontend:** React (Vite), Tailwind CSS, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (NoSQL)
* **AI Engine:** Google Gemini Generative AI SDK

## 🚀 Getting Started

### Prerequisites
* Node.js installed
* MongoDB Atlas URI
* Google Gemini API Key

### Installation

1.  **Clone the Repo**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/nexus-ai-chat.git](https://github.com/YOUR_USERNAME/nexus-ai-chat.git)
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    # Create .env file and add PORT, MONGO_URI, and GEMINI_API_KEY
    npm start
    ```

3.  **Setup Frontend**
    ```bash
    cd client
    npm install
    npm run dev
    ```

## 🤝 Contribution
Built by **[Your Name]** as part of an advanced Full Stack AI initiative.
* **Day 5:** Added typing indicators, skeleton loaders, and smooth UI transitions.