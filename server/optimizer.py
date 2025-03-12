
import sys
import json
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def create_data_model(locations):
    """Stores the data for the problem, including a distance matrix."""
    size = len(locations)
    data = {}

    def distance(a, b):
        # Calculate Euclidean distance between two points
        # a and b are [lon, lat] coordinates
        return ((a[0] - b[0])**2 + (a[1] - b[1])**2) ** 0.5

    # Create distance matrix
    distance_matrix = []
    for i in range(size):
        row = []
        for j in range(size):
            row.append(distance(locations[i], locations[j]))
        distance_matrix.append(row)
    
    data["distance_matrix"] = distance_matrix
    data["num_vehicles"] = 1
    data["depot"] = 0  # Start from the first location (warehouse)
    
    return data

def solve_vrp(locations):
    """Solves the Vehicle Routing Problem (VRP) and returns the optimized route."""
    data = create_data_model(locations)

    manager = pywrapcp.RoutingIndexManager(len(data["distance_matrix"]), data["num_vehicles"], data["depot"])
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return data["distance_matrix"][from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC

    solution = routing.SolveWithParameters(search_parameters)
    
    if solution:
        route = []
        index = routing.Start(0)
        while not routing.IsEnd(index):
            route.append(manager.IndexToNode(index))
            index = solution.Value(routing.NextVar(index))
        route.append(manager.IndexToNode(index))  # Return to depot
        
        return {"optimized_route": route}
    else:
        return {"error": "No solution found"}

# Main block that runs when script is called directly by PythonShell
if __name__ == "__main__":
    try:
        # Get locations from command line arguments
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No locations provided"}))
            sys.exit(1)
            
        locations_json = sys.argv[1]
        print(f"Received input: {locations_json}", file=sys.stderr)  # Debug output
        
        locations = json.loads(locations_json)
        print(f"Parsed locations: {locations}", file=sys.stderr)  # Debug output
        
        # Call the optimization function
        result = solve_vrp(locations)
        
        logger.debug(f"Optimization result: {result}")
        
        # Print the result as JSON (this will be captured by PythonShell)
        print(json.dumps(result))
        
    except Exception as e:
        import traceback
        print(f"Error: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        print(json.dumps({"error": str(e)}))
https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624823f388c1e7b64b029159e7e12b9ceaa6&start=8.681495,49.41461&end=8.687872,49.420318