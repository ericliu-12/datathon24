from flask import Flask, request, jsonify
from model import generate_llm_response
import json
import os

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def system_design():
    try:
        data = request.get_json()
        user_input = data.get("userInput")

        response = generate_llm_response(user_input)

        if isinstance(response, str):
            response_content = json.loads(response)

        return jsonify(response_content)
    # try:
    #     json_path = os.path.join('public', 'example.json')
    #     with open(json_path, 'r') as json_file:
    #         data = json.load(json_file)
    #     return jsonify(data)
    
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == '__main__':
    app.run(port=5000)