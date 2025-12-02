# HostMaster

**HostMaster** is a modern, cross-platform `/etc/hosts` file manager built with [Tauri](https://tauri.app/), [React](https://react.dev/), and [Rust](https://www.rust-lang.org/). It provides a beautiful, native-feeling interface to easily manage your system's host entries.

![HostMaster Dark Mode](./public/dark-mode-app.png)

## ✨ Features

*   **Native Aesthetic:** Designed with a premium Apple-like "Liquid" design system.
*   **Theming:** Full support for **Light**, **Dark**, and **System** themes.
    *   Includes a "True Black" OLED-friendly dark mode.
    *   Native window title bar integration that syncs with the theme.
*   **Easy Management:**
    *   **Toggle:** Instantly enable/disable host entries with smooth switches.
    *   **Edit:** Inline editing for IP addresses and domains.
    *   **Search:** Real-time filtering to find entries quickly.
*   **Secure:**
    *   Reads `/etc/hosts` safely.
    *   Only requests Administrator/Sudo privileges when you explicitly click **Apply**.
    *   Uses native OS prompts for authentication (`osascript` on macOS, `pkexec` on Linux).

## 📥 Download

You can download the latest version of HostMaster from the [Releases](https://github.com/yourusername/hostmaster/releases) page.

*   **macOS:** Download the `.dmg` file.
*   **Linux:** Download the `.deb` or `.AppImage` file.

*Note: If you are building from source, see the [Getting Started](#-getting-started) section below.*

## 📸 Screenshots

| Light Mode | Dark Mode |
|:---:|:---:|
| ![Light Mode](./public/light-mode-app.png) | ![Dark Mode](./public/dark-mode-app.png) |

## 🛠️ Tech Stack

*   **Core:** [Tauri v2](https://v2.tauri.app/) (Rust + Webview)
*   **Frontend:** React, TypeScript, Vite
*   **Styling:** Tailwind CSS v3
*   **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18 or later)
*   [Rust](https://www.rust-lang.org/tools/install) (latest stable)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/hostmaster.git
    cd hostmaster
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run in Development Mode:**
    ```bash
    npm run tauri dev
    ```
    This will launch the application window.

### Building for Production

To create a standalone application bundle/installer for your OS:

```bash
npm run tauri build
```

The output will be located in `src-tauri/target/release/bundle`.

## 🔒 Permissions

HostMaster requires permission to write to your system's hosts file (`/etc/hosts` on Unix-like systems).
*   **Read:** The app reads the file on startup.
*   **Write:** When you click "Apply", the app invokes a Rust backend command that securely prompts for your system password to save changes.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
