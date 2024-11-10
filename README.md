# Nexus

## Inspiration
System design is crucial for building reliable, scalable architectures, yet it can be challenging to visualize complex systems effectively. We created **Nexus** to provide an intuitive, interactive network visualization tool for users at all experience levels—whether it's students preparing for system design interviews or senior engineers developing architectures for companies and startups.

## What it Does
Nexus enables users to visualize and explore system design workflows. Users can create **mind maps** representing components, data flow, and connections within a system. By leveraging AI-driven insights, Nexus helps users break down and structure system designs, making it easy to understand how data flows between nodes.

## How We Built It
We built Nexus using a combination of cutting-edge tools and frameworks:

- **Databricks**: For data processing and integration with machine learning workflows.
- **MosaicML and Meta Llama**: Powering AI-driven responses to generate system designs.
- **LangChain**: For chaining responses from different models and streamlining output into structured workflows.
- **MongoDB**: For storing users’ design history, allowing them to revisit previous designs.
- **NextAuth**: For secure user authentication.
- **React and Tailwind CSS**: To create a responsive and visually appealing user interface, enabling clear visualization of nodes and data flows.

## Challenges We Ran Into
One of the biggest challenges was **integrating multiple AI models** seamlessly with LangChain. Ensuring the generated designs were both structured and intuitive required significant tweaking of prompts and response chaining. Additionally, creating a smooth, user-friendly experience for handling complex system designs was technically demanding.

## Accomplishments that We're Proud Of
We’re proud to have developed a tool that not only helps visualize complex workflows but also leverages AI to generate and structure system designs dynamically. Our seamless integration of Databricks and LangChain for multi-model response handling, along with a user-friendly interface, represents a significant accomplishment.

## What We Learned
Through this project, we deepened our understanding of integrating multiple machine learning models, optimizing prompt engineering, and enhancing user experiences with interactive, data-driven visualizations. We also gained experience in **scalable back-end design and database management** to support a history feature.

## What's Next for Nexus
Moving forward, we plan to add new features, including:

- **Multiplayer collaboration**: Allowing multiple users to collaborate on system designs in real-time.
- **Enhanced AI insights**: Providing deeper analysis and optimization suggestions for designs.
- **Export and share options**: Enabling users to easily export and share their designs.
