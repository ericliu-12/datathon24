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
    # max_tokens=150,
)

keyword_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
           """Given {prompt}, extract the project name if there is any, and the type of network it is 
           (system design or something else), and the key features of the project through examples if 
           provided or specific keywords. I need your output to only be JSON without any intro or outro sentences, with a max of 7 key features,
           and to follow this example strictly: 
           {{"Netflix": ["video streaming", "user recommendations", "content delivery", "scalability", "subscription service", "multi-platform support"]}}"""

        ),
        ("user", "{prompt}")
    ]
)

# Step 3: Set up the second ChatPromptTemplate for system design breakdown
node_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are an expert in system design and architecture. Given a request to design a complex system based on the following information:
               One of the nodes should be the user.
               If there is a connection that goes both ways, only add it to connections once.
               Project Name: {project_name}
               Keywords: {keywords}
               Do not add any intro or outro statements. Provide a technical breakdown in the following structure: 
               Nodes: {{
                        id: number;
                        title: string;
                        subtitle: string;
                        description: string;
                        technologies: string[];
                        protocols: string[];
                        }};
               Connections: type Connection = {{
                        source: number; --> source node id
                        destination: number; --> destination node id
                        label: string;
                        description: string;
                        }};
                Flow: {{
                        scenario: string;
                        steps: {{ action: string; node: string }}[];
                    }};
               Ensure responses are organized, technical, and optimized for an audience with engineering expertise. Make sure the answer you return is only in JSON format."""
        ),
        ("user", "Please generate a system design breakdown.")
    ]
)

# Chain the first prompt with the chat model
keyword_chain = keyword_prompt | chat_model

# Chain the second prompt with the chat model
node_chain = node_prompt | chat_model

# function
def generate_llm_response(user_input):

    keyword_response = keyword_chain.invoke({"prompt": user_input})

    # Parse the response to extract project name and keywords from the JSON-style response
    project_data = eval(keyword_response.content)  # Assuming response content is a JSON-like string
    project_name = list(project_data.keys())[0]
    keywords = project_data[project_name]

    # Step 4: Run the second chain to get the system design breakdown
    node_response = node_chain.invoke({"project_name": project_name, "keywords": keywords})

    return node_response.content.replace("```", "").strip()
