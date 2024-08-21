# import json
# import os

# # Define the path to the GeoJSON file relative to the backendP directory
# geojson_file_path = os.path.join(os.path.dirname(__file__), 'countries.geo.json')

# # Load the GeoJSON file
# with open(geojson_file_path, 'r') as file:
#     geojson_data = json.load(file)

# # List of states and countries you want to extract
# regions_to_extract = [
#     "California", "Oregon", "Washington", "New York", "Pennsylvania", "Massachusetts", 
#     "Virginia", "Hawaii", "New Jersey", "Connecticut", "Maine", "New Hampshire", "Vermont",
#     "Rhode Island", "Maryland", "Colorado", "New Mexico", "Washington D.C.", "British Columbia",
#     "Alberta", "Saskatchewan", "Manitoba", "Ontario", "Quebec", "Newfoundland and Labrador",
#     "New Brunswick", "Nova Scotia", "Prince Edward Island", "England", "Scotland", "Wales",
#     "Northern Ireland", "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
#     "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy",
#     "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania",
#     "Slovakia", "Slovenia", "Spain", "Sweden", "Morocco", "Senegal", "China", "Japan", "Brazil",
#     "South Africa", "New Zealand", "Australia", "Chile", "Argentina", "Mexico", "Norway", 
#     "Switzerland", "South Korea", "India", "Indonesia", "Vietnam", "Colombia", "Kazakhstan", 
#     "Turkey", "Thailand", "Philippines", "Russia", "Ukraine", "Taiwan"
# ]

# # Initialize a list to hold filtered features
# filtered_features = []

# # Iterate through features and extract those that match the regions_to_extract list
# for feature in geojson_data['features']:
#     name = feature['properties'].get('name') or feature['properties'].get('NAME')
#     if name in regions_to_extract:
#         filtered_features.append(feature)

# # Create a new GeoJSON structure with the filtered features
# filtered_geojson = {
#     "type": "FeatureCollection",
#     "features": filtered_features
# }

# # Define the output path relative to the backendP directory
# output_file_path = os.path.join(os.path.dirname(__file__), '../GeoJSON/filtered_countries.geo.json')

# # Save the filtered GeoJSON to a new file
# with open(output_file_path, 'w') as output_file:
#     json.dump(filtered_geojson, output_file, indent=2)

# print("Filtered GeoJSON saved as 'filtered_countries.geo.JSON'")



# import json
# import os

# # Define the path to the GeoJSON file relative to the backendP directory
# geojson_file_path = os.path.join(os.path.dirname(__file__), 'china.geo.json')

# # Load the GeoJSON file
# with open(geojson_file_path, 'r') as file:
#     geojson_data = json.load(file)

# # List of specific regions you want to extract
# regions_to_extract = [
#     "Beijing", "Shanghai", "Guangdong", "Hubei", "Shenzhen", "Tianjin", 
#     "Chongqing", "Fujian", "São Paulo", "Sakhalin"
# ]

# # Initialize a list to hold filtered features
# filtered_features = []

# # Iterate through features and extract those that match the regions_to_extract list
# for feature in geojson_data['features']:
#     name = feature['properties'].get('NAME_1')  # Using NAME_1 as it contains the specific region names
#     if name in regions_to_extract:
#         filtered_features.append(feature)

# # Create a new GeoJSON structure with the filtered features
# filtered_geojson = {
#     "type": "FeatureCollection",
#     "features": filtered_features
# }

# # Define the output path relative to the backendP directory
# output_file_path = os.path.join(os.path.dirname(__file__), '../GeoJSON/filtered_regions.geo.JSON')

# # Save the filtered GeoJSON to a new file
# with open(output_file_path, 'w') as output_file:
#     json.dump(filtered_geojson, output_file, indent=2)

# print("Filtered GeoJSON saved as 'filtered_regions.geo.JSON'")
# import json
# import os

# # Define the path to the GeoJSON file relative to the backendP directory
# geojson_file_path = os.path.join(os.path.dirname(__file__), 'US-state.geo.json')

# # Load the GeoJSON file
# with open(geojson_file_path, 'r') as file:
#     geojson_data = json.load(file)

# # List of US states you want to extract
# states_to_extract = [
#     "California", "Oregon", "Washington", "New York", "Pennsylvania", 
#     "Massachusetts", "Virginia", "Hawaii", "New Jersey", "Connecticut", 
#     "Maine", "New Hampshire", "Vermont", "Rhode Island", "Maryland", 
#     "Colorado", "New Mexico", "Virginia", "Washington"
# ]

# # Initialize a list to hold filtered features
# filtered_features = []

# # Iterate through features and extract those that match the states_to_extract list
# for feature in geojson_data['features']:
#     name = feature['properties'].get('name')  # Replace 'name' with the correct key based on inspection
#     if name in states_to_extract:
#         filtered_features.append(feature)

# # Create a new GeoJSON structure with the filtered features
# filtered_geojson = {
#     "type": "FeatureCollection",
#     "features": filtered_features
# }

# # Define the output path relative to the backendP directory
# output_file_path = os.path.join(os.path.dirname(__file__), '../GeoJSON/filtered_us_states.geo.json')

# # Save the filtered GeoJSON to a new file
# with open(output_file_path, 'w') as output_file:
#     json.dump(filtered_geojson, output_file, indent=2)

# print("Filtered GeoJSON saved as 'filtered_us_states.geo.JSON'")


# import json
# import os

# # Define the input and output file paths
# input_geojson_file = os.path.join(os.path.dirname(__file__), 'filtered_china.geo.json')
# output_geojson_file = os.path.join(os.path.dirname(__file__), 'restructured_geo.json')

# # Load the original GeoJSON file
# with open(input_geojson_file, 'r') as file:
#     geojson_data = json.load(file)

# # Initialize a list to hold the restructured features
# restructured_features = []

# # Iterate through the features and restructure them
# for feature in geojson_data['features']:
#     # Extract required information
#     gid = feature['properties'].get('GID_0')
#     name = feature['properties'].get('NAME_1')
#     coordinates = feature['geometry']['coordinates']
#     geometry_type = feature['geometry']['type']
    
#     # Create a new feature structure
#     restructured_feature = {
#         "type": "Feature",
#         "id": gid,
#         "properties": {
#             "name": name
#         },
#         "geometry": {
#             "type": geometry_type,
#             "coordinates": coordinates
#         }
#     }
    
#     # Add the restructured feature to the list
#     restructured_features.append(restructured_feature)

# # Create a new GeoJSON structure with the restructured features
# restructured_geojson = {
#     "type": "FeatureCollection",
#     "features": restructured_features
# }

# # Save the restructured GeoJSON to a new file
# with open(output_geojson_file, 'w') as output_file:
#     json.dump(restructured_geojson, output_file, indent=2)

# print(f"Restructured GeoJSON saved as '{output_geojson_file}'")


# import json
# import os

# # Define the paths to the input GeoJSON files
# us_states_file = os.path.join(os.path.dirname(__file__), 'filtered_us_states.geo.json')
# countries_file = os.path.join(os.path.dirname(__file__), 'filtered_countries.geo.json')
# china_file = os.path.join(os.path.dirname(__file__), 'filtered_china.geo.json')

# # Define the output file path
# output_file = os.path.join(os.path.dirname(__file__), 'combined_geo.json')

# # Load each of the GeoJSON files
# with open(us_states_file, 'r') as file:
#     us_states_data = json.load(file)

# with open(countries_file, 'r') as file:
#     countries_data = json.load(file)

# with open(china_file, 'r') as file:
#     china_data = json.load(file)

# # Combine all features from the three files
# combined_features = us_states_data['features'] + countries_data['features'] + china_data['features']

# # Create a new GeoJSON structure with the combined features
# combined_geojson = {
#     "type": "FeatureCollection",
#     "features": combined_features
# }

# # Save the combined GeoJSON to a new file
# with open(output_file, 'w') as output:
#     json.dump(combined_geojson, output, indent=2)

# print(f"Combined GeoJSON saved as '{output_file}'")


import pandas as pd
import json

# Load the Excel file
excel_file = 'final_carbon_pricing.xlsx'
df = pd.read_excel(excel_file)

# Remove any leading/trailing whitespace from column names (just in case)
df.columns = df.columns.str.strip()

# Create a dictionary mapping each country/state to its status, color, and hover action
country_data = {}

for _, row in df.iterrows():
    # Combine State and Country/Region for a unique key (if needed)
    location_key = row['State'] if pd.notna(row['State']) else row['Country/Region']
    
    country_data[location_key] = {
        'status': row['Status (Label)'],
        'color': row['Color'],
        'hover': row['Hover Action (Info)']
    }

# Save the dictionary as a JSON file to be used in the React component
output_file = 'country_status_color.json'
with open(output_file, 'w') as json_file:
    json.dump(country_data, json_file, indent=2)

print(f"Data saved to {output_file}")

