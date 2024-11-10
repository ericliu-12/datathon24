"use server";

import connectDB from "@/lib/mongodb";
import Graph from "@/lib/GraphSchema";

interface Props {
  email: string;
}

const figma = {
  Project: "Figma Workflow",
  Nodes: [
    {
      id: 0,
      title: "Digital Risography",
      subtitle: "Insights into blend modes",
    },
    {
      id: 1,
      title: "Figma Basics",
      subtitle: "Design with me",
    },
  ],
  Connections: [
    {
      source: 0,
      destination: 1,
    },
  ],
};

export default async function CreateUser({ email }: Props) {
  try {
    await connectDB();

    const existingUser = await Graph.findOne({ email: email });

    if (!existingUser) {
      const newUser = new Graph({
        email: email,
        data: [],
      });

      await newUser.save();
    }

    return true;
  } catch (error) {
    console.log(error);
  }
}
