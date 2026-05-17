import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const users = [
  { name: "Aarav Patel", email: "aarav.patel@example.com" },
  { name: "Priya Sharma", email: "priya.sharma@example.com" },
  { name: "Rohan Desai", email: "rohan.desai@example.com" },
  { name: "Kavya Iyer", email: "kavya.iyer@example.com" }
];

const notesData = [
  {
    author: "Aarav Patel",
    title: "The Future of AI in Bangalore's Tech Hub",
    content: "Bangalore is rapidly evolving. We are seeing a huge influx of AI startups focusing on generative models for Indic languages. The focus on localizing AI is what will truly democratize technology across India. Here are my thoughts on how we can bridge the digital divide using LLMs: \n\n1. Train on diverse regional data.\n2. Keep inference costs low.\n3. Build voice-first interfaces for rural adoption.",
    tagNames: ["ai", "india", "tech"],
    category: "Ideas"
  },
  {
    author: "Priya Sharma",
    title: "React Server Components: A Game Changer",
    content: "After spending 3 years building web apps at a fintech startup in Mumbai, transitioning to Next.js App Router and React Server Components has been eye-opening. \n\nMy top takeaways:\n- Shipping less JavaScript to the client is huge for performance on slower 4G networks.\n- Data fetching directly in the component feels incredibly intuitive.\n- The learning curve is there, but totally worth it.",
    tagNames: ["react", "web-dev", "nextjs"],
    category: "Work"
  },
  {
    author: "Rohan Desai",
    title: "Exploring the Western Ghats: A Weekend Itinerary",
    content: "Just got back from an incredible road trip through the Western Ghats from Pune. The monsoon season makes everything so lush and green. \n\nIf you are planning a trip, definitely stop by Mahabaleshwar for the strawberries and Pratapgad for the history. Don't forget to pack good trekking shoes and rain gear! The mist covering the valleys is a sight you won't forget.",
    tagNames: ["travel", "india", "nature", "weekend"],
    category: "Personal"
  },
  {
    author: "Aarav Patel",
    title: "System Design: Scaling to 1M Users in India",
    content: "When designing for scale in a high-growth market like India, you can't just throw more servers at the problem. Traffic spikes during IPL or Diwali can crash unprepared systems.\n\nWe had to rethink our entire caching strategy. Moving from a single Redis instance to a multi-tiered architecture (CDN -> Edge -> Redis Cluster) saved us 40% in cloud costs. Always design for data locality and plan for extreme concurrency!",
    tagNames: ["system-design", "engineering", "scaling"],
    category: "Work"
  },
  {
    author: "Kavya Iyer",
    title: "Book Review: The Almanack of Naval Ravikant",
    content: "This book completely changed my perspective on wealth creation. Naval's emphasis on building specific knowledge and leveraging the internet is profound. \n\nMy favorite quote: 'Learn to sell. Learn to build. If you can do both, you will be unstoppable.'\n\nHighly recommend this to any ambitious student or founder.",
    tagNames: ["books", "naval", "wealth", "mindset"],
    category: "Ideas"
  },
  {
    author: "Priya Sharma",
    title: "Mastering TypeScript Generics",
    content: "Generics used to scare me, but they are basically just arguments for types! \n\nFor example, `type ApiResponse<T> = { data: T, status: number }` allows you to reuse the response wrapper for any data type. Once you grasp this concept, your codebase becomes so much more robust and self-documenting. No more `any` types creeping into the codebase!",
    tagNames: ["typescript", "coding", "learning"],
    category: "Work"
  }
];

async function seed() {
  console.log("Seeding database with Indian user accounts and public notes...");

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        passwordHash: "dummyhash" // They won't actually log in
      }
    });

    const userNotes = notesData.filter(n => n.author === u.name);
    
    for (const note of userNotes) {
      await prisma.note.create({
        data: {
          userId: user.id,
          title: note.title,
          content: note.content,
          isPublic: true,
          shareId: crypto.randomUUID(),
          tagNames: note.tagNames,
          category: note.category
        }
      });
    }
  }
  console.log("Seeding complete! Check the /explore page.");
}

seed().catch(console.error).finally(() => prisma.$disconnect());
