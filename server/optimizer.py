from flask import Flask, request, jsonify
import requests
import polyline

app = Flask(__name__)

ORS_API_KEY = "5b3ce3597851110001cf624823f388c1e7b64b029159e7e12b9ceaa6"

@app.route("/optimize-route", methods=["POST"])
def optimize_route():
    data = request.json
    coordinates = data["coordinates"]

    url = "https://api.openrouteservice.org/v2/directions/driving-car"
    headers = {"Authorization": ORS_API_KEY, "Content-Type": "application/json"}
    payload = {"coordinates": coordinates}

    response = requests.post(url, headers=headers, json=payload)
    route_data = response.json()
    
    # Decode the polyline to get route coordinates
    optimized_route = polyline.decode(route_data["routes"][0]["geometry"])
    
    return jsonify({"route": optimized_route})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
