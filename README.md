# Pact

![Demo](./Screen%20Recording%202024-10-09%20at%201.17.41%20PM.gif)

## Inspiration
While we are gradually normalizing discussions surrounding burnout and productivity, many of us still struggle to balance ambition with self-care. The drive to achieve is deeply ingrained in our culture, leading us to measure success through external accomplishments, often at the cost of well-being. *Pact* aims to challenge these norms and promote setting smaller, incremental goals, redefining success in a way that harmonizes ambition and well-being.

## What It Does
*Pact* is simple: 
1. Choose a task.
2. Form a pact with someone—whether it's a friend or someone in the same boat.
3. Write down your goal, complete the task, and commemorate it with an NFT. 

The NFT symbolizes that no task is too small, representing your growth and achievements across your lifetime. The system promotes self-accountability, building confidence through incremental steps. In practice, it’s rewarding to accomplish things together.

## How We Built It
- **Frontend**: Next.js, React, Magic UI, GSAP for animations.
- **Backend**: Express.js with MongoDB for storage.
- **Real-time functionality**: Websockets to enable dynamic interactions.
- **Blockchain Integration**: Crossmint API to mint NFTs commemorating completed tasks.

## Challenges We Faced
One major challenge was ideation—we spent a significant amount of time debating the project’s feasibility and relatability. Another technical challenge was integrating a database with a WebSocket simultaneously. We ran into issues managing connections and determining where the WebSocket would fit in the application architecture.

## Technologies Used
- **Next.js**: Framework for building the frontend.
- **MongoDB**: Database to store tasks and user information.
- **Express.js**: Backend server handling API requests and real-time updates.
- **WebSocket**: Enables real-time communication for live updates.
- **Crossmint API**: Used to mint NFTs for task completion.
- **Magic UI**: Provides UI components.
- **GSAP**: Animation library for dynamic UI transitions.


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
