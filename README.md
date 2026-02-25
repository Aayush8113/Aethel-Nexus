# 🤖 Aethel-Nexus

> A High-Performance AI Conversational Platform built with the MERN Stack and Gemini Pro.

![Status](https://img.shields.io/badge/Status-Active-success)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)

## 🌟 Features

- **Real-time AI Interaction:** Powered by Google's Gemini Pro & Flash models.
- **Smart Context:** The AI remembers conversation history for seamless context.
- **Auto-Fallback Engine:** Automatically switches between Gemini 3.0, 2.0, and 1.5 to prevent crashes.
- **Professional UI:** Glassmorphism design with smooth fade-in animations.
- **Typing Indicators:** Real-time bouncing dot animations while the AI thinks.
- **Markdown Support:** Renders code blocks, tables, and bold text beautifully.
- **Syntax Highlighting:** Professional code blocks with VS Code theme and copy-to-clipboard.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (NoSQL)
- **AI Engine:** Google Gemini Generative AI SDK

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- MongoDB Atlas URI
- Google Gemini API Key

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

- **Day 5:** Added typing indicators, skeleton loaders, and smooth UI transitions.

- **User Feedback System:** Interactive Toast notifications for all actions.
- **Offline Detection:** Smart banner warning when internet connection is lost.

### 🏆 Milestones

- **Week 1 (Completed):** Core Chat, History, Delete, Sidebar, and Styling.
- **Next Steps:** Voice Input and Image Recognition.

- **Day 8:** Implemented Speech-to-Text (Voice Input) using Web Speech API.
- **Voice Input:** Speech-to-text with audio feedback and pulsing animations.
- **Smart Input:** Auto-expanding textarea with Enter-to-send support.

- **Text-to-Speech:** AI reads responses aloud with sound-wave animations.
- **Auto-Read Mode:** Hands-free operation with persistent settings.

- **Computer Vision:** Analyze images using Gemini 2.0 Flash.
- **Multimodal Uploads:** Send text and images together.

- **Persona System:** Switch between Dev, Pirate, and ELI5 personalities using System Instructions.

- **Smart Organization:** Search history, Pin favorites, and Bulk Clear options.

- **Artifacts:** Full-screen code editor with split-screen view, copy, and download support.

- **Math & Tables:** Latex ($E=mc^2$) and GFM Tables support.
- **Exporting:** Download chat history as .md or .json.

- **Native Experience:** Installable PWA with offline support.
- **Shortcuts:** Keyboard navigation (Press `?` to see list).
- **Resilience:** Error Boundaries and Lazy Loading for performance.

- **Slash Commands:** Type `/` to access prompt templates.
- **Metrics:** Token usage estimation and message timestamps.
- **UX:** Code block window styling and feedback controls.

- **Memory Management:** Visual context usage bar.
- **Forking:** Edit previous messages to branch conversations.
- **Power Tools:** Slash commands, token estimation, and timestamps.

- **Command Palette:** Press `Cmd+K` or `Ctrl+K` for global navigation.
- **Themes:** Selectable code syntax themes in Settings.
- **Navigation:** Smart Scroll-to-Top and Bottom buttons for long chats.

- **Drag & Drop:** Attach images by dropping them anywhere on the screen.
- **Audio Tuning:** Adjust AI reading speed and pitch via preferences.
- **Code Formatting:** Global settings for code word-wrap and line numbers.

- **Custom Personas:** Build and save your own AI personalities via the Persona menu.
- **Message Regeneration:** One-click refresh for the AI's last message.
- **Smart Auto-Scroll:** Chat safely pauses auto-scrolling if you scroll up while the AI is generating code.

* **File Handling:** Paste images directly via Clipboard, or drag-and-drop `.js`/`.json`/`.txt` files to instantly inject them into the chat.
* **Snippets:** Instantly download any AI-generated code block as a local file.
* **Context Manager:** Highly accurate visual token tracker with status warnings.

* **Intelligent Sidebar:** Chats automatically group into "Today", "Previous 7 Days", and "Older".
* **In-Chat Search:** Search bar to instantly filter large conversation histories.
* **System Backup:** Export and import your Custom Personas and settings as a `.aethel` system file.