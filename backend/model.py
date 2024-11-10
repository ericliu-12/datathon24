import os
from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate
from langchain_databricks import ChatDatabricks

load_dotenv("./.env/pyvenv.cfg")

DATABRICKS_TOKEN = os.environ.get('DATABRICKS_TOKEN')
DATABRICKS_HOST = os.environ.get('DATABRICKS_HOST')

chat_model = ChatDatabricks(
    api_key=DATABRICKS_TOKEN,
    base_url=f"{DATABRICKS_HOST}/serving-endpoints",
    endpoint="databricks-meta-llama-3-1-70b-instruct",
    temperature=0.1,
    max_tokens=250,
)

keyword_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
           """Given {prompt}, extract the project name if there is any, and the type of network it is 
           (system design or something else), and the key features of the project through examples if 
           provided or specific keywords. I need your output to only be JSON without any intro or outro sentences, 
           and to follow this example strictly: 
           {{"Netflix": ["video streaming", "user recommendations", "content delivery", "scalability", "subscription service", "multi-platform support"]}}"""

        ),
        ("user", "{prompt}")
    ]
)

# Chain the first prompt with the chat model
keyword_chain = keyword_prompt | chat_model

# Step 2: Run the first chain to extract the project name and keywords
initial_prompt = "Design Netflix"
keyword_response = keyword_chain.invoke({"prompt": initial_prompt})

# Parse the response to extract project name and keywords from the JSON-style response
project_data = eval(keyword_response.content)  # Assuming response content is a JSON-like string
project_name = list(project_data.keys())[0]
keywords = project_data[project_name]

# Step 3: Set up the second ChatPromptTemplate for system design breakdown
node_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are an expert in system design and architecture. Given a request to design a complex system based on the following information:
               Project Name: {project_name}
               Keywords: {keywords}
               Provide a technical breakdown in the following structure: 
               - Nodes and Node Descriptions: List each main component as a node with a technical description. Give the node title and subtitle. Describe each node's purpose, what it manages, the technologies it may use, and any relevant protocols or data formats.
               - Connections Between Nodes: Detail how the nodes interact with each other. For each connection, specify the source and destination nodes, describe the data or request being passed, and explain the purpose of the connection.
               - Data Flow Example: Provide an example of data flow through the system, following a realistic scenario that demonstrates how users or clients interact with key components.
               Ensure responses are organized, technical, and optimized for an audience with engineering expertise. Make sure the answer you return is only in JSON format."""
        ),
        ("user", "Please generate a system design breakdown.")
    ]
)

# Chain the second prompt with the chat model
node_chain = node_prompt | chat_model

# Step 4: Run the second chain to get the system design breakdown
node_response = node_chain.invoke({"project_name": project_name, "keywords": keywords})

# Print the final system design output
print(node_response.content)