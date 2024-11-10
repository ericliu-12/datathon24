from flask import Flask, request, jsonify
from model import generate_llm_response

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def system_design():
    data = request.get_json()
    user_input = data.get("userInput")

    response_content = generate_llm_response(user_input)

    return jsonify({"response": response_content})

if __name__ == '__main__':
    app.run(port=5000)