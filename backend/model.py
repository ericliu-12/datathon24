from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv("./.env/pyvenv.cfg")

# How to get your Databricks token: https://docs.databricks.com/en/dev-tools/auth/pat.html
DATABRICKS_TOKEN = os.environ.get('DATABRICKS_TOKEN')

# Alternatively in a Databricks notebook you can use this:
# DATABRICKS_TOKEN = dbutils.notebook.entry_point.getDbutils().notebook().getContext().apiToken().get()

client = OpenAI(
    api_key=DATABRICKS_TOKEN,
    base_url="https://dbc-821f5695-fa5e.cloud.databricks.com/serving-endpoints"
)

response = client.chat.completions.create(
    model="databricks-meta-llama-3-1-70b-instruct",
    messages=[
        {
            "role": "system",
            "content": "you are a graph maker. only reply in terms of nodes with medium length descriptions, and a mapping of connections between nodes."
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