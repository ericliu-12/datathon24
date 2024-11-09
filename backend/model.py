from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv("./.env/pyvenv.cfg")

# How to get your Databricks token: https://docs.databricks.com/en/dev-tools/auth/pat.html
DATABRICKS_TOKEN = os.environ.get('DATABRICKS_TOKEN')
DATABRICKS_HOST = os.environ.get('DATABRICKS_HOST')

# Alternatively in a Databricks notebook you can use this:
# DATABRICKS_TOKEN = dbutils.notebook.entry_point.getDbutils().notebook().getContext().apiToken().get()

client = OpenAI(
    api_key=DATABRICKS_TOKEN,
    base_url=f"{DATABRICKS_HOST}/serving-endpoints"
)

response = client.chat.completions.create(
    model="databricks-meta-llama-3-1-70b-instruct",
    messages=[
        {
            "role": "system",
            "content": """You are an expert in system design and architecture. Given a request to design a complex system, provide a technical breakdown in the following structure: 
                          Nodes and Node Descriptions: List each main component as a node with a technical description. Give the node title and subtitle. Describe each node's purpose, what it manages, the technologies it may use, and any relevant protocols or data formats.
                          Connections Between Nodes: Detail how the nodes interact with each other. For each connection, specify the source and destination nodes, describe the data or request being passed, and explain the purpose of the connection.
                          Data Flow Example: Provide an example of data flow through the system, following a realistic scenario that demonstrates how users or clients interact with key components.
                          Ensure responses are organized, technical, and optimized for an audience with engineering expertise."""
        },
        {
            "role": "user",
            "content": "design netflix"
        }
    ],
    temperature=0,
    top_p=0.95
)

print(response.choices[0].message.content)