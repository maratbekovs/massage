# ConnectSphere: College Messenger

[cloudflarebutton]

ConnectSphere is a modern, minimalist, and real-time messenger application designed exclusively for the academic community of a college. It facilitates seamless communication between students and faculty through direct messages and group chats. The platform features a clean, intuitive interface with a focus on usability and performance. The architecture is built to be scalable, running on Cloudflare's edge network for global low-latency access, ensuring a fast and responsive user experience across all devices.

## Key Features

- **Secure Authentication:** User registration and login via email and password.
- **Real-Time Chat:** Direct (1-on-1) and group messaging capabilities.
- **Rich Media Sharing:** Send text, images, files, and emojis.
- **Profile Customization:** Users can edit their name and profile picture.
- **Discoverability:** Search for other users and groups within the college network.
- **Modern UI:** A clean, minimalist, and fully responsive interface built for an excellent user experience.
- **Theming:** Seamlessly switch between beautiful light and dark modes.

## Technology Stack

- **Frontend:** React, Vite, React Router, TypeScript
- **Backend:** Hono on Cloudflare Workers
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animation:** Framer Motion
- **Persistence:** Cloudflare Durable Objects

## Project Structure

The project is organized into three main directories:

- `src/`: Contains the entire React frontend application, including pages, components, hooks, and utilities.
- `worker/`: Contains the Hono backend API that runs on a Cloudflare Worker.
- `shared/`: Contains TypeScript types and mock data that are shared between the frontend and the backend to ensure type safety.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- A Cloudflare account.
- The [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated with your Cloudflare account.
  ```bash
  bun install -g wrangler
  wrangler login
  ```

### Installation & Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/connectsphere_messenger.git
    cd connectsphere_messenger
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```bash
    bun install
    ```

3.  **Run the development server:**
    This command starts the Vite development server for the frontend and the Wrangler development server for the backend worker simultaneously.
    ```bash
    bun run dev
    ```
    The application will be available at `http://localhost:3000`.

## Available Scripts

- `bun run dev`: Starts the local development server for both frontend and backend.
- `bun run build`: Builds the frontend application for production.
- `bun run lint`: Lints the codebase using ESLint.
- `bun run deploy`: Builds the application and deploys it to your Cloudflare account.

## Deployment

This application is designed to be deployed on the Cloudflare network.

1.  **Build and Deploy:**
    Run the deploy script to build the frontend assets and deploy the worker.
    ```bash
    bun run deploy
    ```
    Wrangler will handle the entire deployment process. Once complete, it will provide you with the URL to your live application.

2.  **One-Click Deploy:**
    Alternatively, you can deploy this project to Cloudflare with a single click.

    [cloudflarebutton]