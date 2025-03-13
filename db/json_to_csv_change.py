# import json
# import csv

# # Load the JSON file
# with open("delivery_package.json", "r", encoding="utf-8") as json_file:
#     data = json.load(json_file)  # Assuming it's a list of dictionaries

# # Define CSV file headers based on JSON keys
# csv_columns = ["customer", "address", "lat", "lng", "items"]

# # Write to CSV file
# with open("deliveries.csv", "w", newline="", encoding="utf-8") as csv_file:
#     writer = csv.DictWriter(csv_file, fieldnames=csv_columns)
#     writer.writeheader()  # Write column headers
#     writer.writerows(data)  # Write data rows

# print("✅ JSON successfully converted to CSV:deliveries.csv")

import json
import csv

# Input JSON file
json_file = "delivery_package.json"
# Output CSV file
csv_file = "deliveries.csv"

# Read JSON data
with open(json_file, "r", encoding="utf-8") as f:
    data = json.load(f)

# Define CSV headers (flat structure)
csv_headers = ["id", "customer", "deliveryPoint", "coordinates", "packageWeight", "time", "items"]

# Open CSV file for writing
with open(csv_file, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=csv_headers)
    writer.writeheader()  # Write header row

    # Convert JSON objects to CSV rows
    for entry in data:
        # Convert coordinates list to "latitude,longitude"
        coordinates_str = f"{entry['coordinates'][0]},{entry['coordinates'][1]}" if "coordinates" in entry else ""

        # Convert items list to comma-separated string
        items_str = "; ".join([f"{item['name']} ({item['category']})" for item in entry.get("items", [])])

        # Create flat dictionary for CSV row
        csv_row = {
            "id": entry["id"],
            "customer": entry["customer"],
            "deliveryPoint": entry["deliveryPoint"],
            "coordinates": coordinates_str,
            "packageWeight": entry["packageWeight"],
            "time": entry["time"],
            "items": items_str
        }

        writer.writerow(csv_row)

print("✅ JSON successfully converted to CSV:", csv_file)
