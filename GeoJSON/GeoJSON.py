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


# import pandas as pd
# import json

# # Load the Excel file
# excel_file = 'final_carbon_pricing.xlsx'
# df = pd.read_excel(excel_file)

# # Remove any leading/trailing whitespace from column names (just in case)
# df.columns = df.columns.str.strip()

# # Create a dictionary mapping each country/state to its status, color, and hover action
# country_data = {}

# for _, row in df.iterrows():
#     # Combine State and Country/Region for a unique key (if needed)
#     location_key = row['State'] if pd.notna(row['State']) else row['Country/Region']
    
#     country_data[location_key] = {
#         'status': row['Status (Label)'],
#         'color': row['Color'],
#         'hover': row['Hover Action (Info)']
#     }

# # Save the dictionary as a JSON file to be used in the React component
# output_file = 'country_status_color.json'
# with open(output_file, 'w') as json_file:
#     json.dump(country_data, json_file, indent=2)

# print(f"Data saved to {output_file}")

import json

# Define the color mapping
color_to_hex = {
    "Dark Blue": "#784193",
    "Purple": "#800080",
    "Light Purple": "#D8BFD8",
    "Red": "#FF0000"
}

# Your original JSON data
data ={
  "California": {
    "status": "ETS and Carbon Tax Implemented",
    "color": "Dark Blue",
    "hover": "\"California has both ETS and a carbon tax implemented.\""
  },
  "Oregon": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"Oregon has an ETS implemented.\""
  },
  "Washington": {
    "status": "ETS and Carbon Tax Implemented",
    "color": "Dark Blue",
    "hover": "\"Washington state has both ETS and a carbon tax implemented.\""
  },
  "New York": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"New York state has an ETS implemented.\""
  },
  "Pennsylvania": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"Pennsylvania has an ETS implemented.\""
  },
  "Massachusetts": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"Massachusetts has an ETS implemented.\""
  },
  "Virginia": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "\"Virginia is considering or developing an ETS or carbon tax.\""
  },
  "Hawaii": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "\"Hawaii is considering or developing an ETS or carbon tax.\""
  },
  "New Jersey": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"New Jersey has an ETS implemented.\""
  },
  "Connecticut": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"Connecticut has an ETS implemented.\""
  },
  "Maine": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"Maine has an ETS implemented.\""
  },
  "New Hampshire": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"New Hampshire has an ETS implemented.\""
  },
  "Vermont": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"Vermont has an ETS implemented.\""
  },
  "Rhode Island": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"Rhode Island has an ETS implemented.\""
  },
  "Maryland": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"Maryland has an ETS implemented.\""
  },
  "Colorado": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "\"Colorado is considering or developing an ETS or carbon tax.\""
  },
  "New Mexico": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "\"New Mexico is considering or developing an ETS or carbon tax.\""
  },
  "Washington D.C.": {
    "status": "ETS and Carbon Tax Implemented",
    "color": "Dark Blue",
    "hover": "\"Washington D.C. has both ETS and a carbon tax implemented.\""
  },
  "British Columbia": {
    "status": "ETS and Carbon Tax Implemented",
    "color": "Dark Blue",
    "hover": "British Columbia has both ETS and a carbon tax implemented."
  },
  "Alberta": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Alberta has an ETS implemented."
  },
  "Saskatchewan": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Saskatchewan has an ETS implemented."
  },
  "Manitoba": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Manitoba has an ETS implemented."
  },
  "Ontario": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Ontario has an ETS implemented."
  },
  "Quebec": {
    "status": "ETS and Carbon Tax Implemented",
    "color": "Dark Blue",
    "hover": "Quebec has both ETS and a carbon tax implemented."
  },
  "Newfoundland and Labrador": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Newfoundland and Labrador has an ETS implemented."
  },
  "New Brunswick": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "New Brunswick has an ETS implemented."
  },
  "Nova Scotia": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Nova Scotia has an ETS implemented."
  },
  "Prince Edward Island": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Prince Edward Island has an ETS implemented."
  },
  "Northwest Territories": {
    "status": "ETS and Carbon Tax Implemented",
    "color": "Dark Blue",
    "hover": "Northwest Territories has both ETS and a carbon tax implemented."
  },
  "Nunavut": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "Nunavut is considering or developing an ETS or carbon tax."
  },
  "Yukon": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "Yukon is considering or developing an ETS or carbon tax."
  },
  "England": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"England has an ETS implemented.\""
  },
  "Scotland": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"Scotland has an ETS implemented.\""
  },
  "Wales": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"Wales has an ETS implemented.\""
  },
  "Northern Ireland": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"Northern Ireland has an ETS implemented.\""
  },
  "Austria": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Austria has an ETS implemented."
  },
  "Belgium": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Belgium has an ETS implemented."
  },
  "Bulgaria": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Bulgaria has an ETS implemented."
  },
  "Croatia": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Croatia has an ETS implemented."
  },
  "Cyprus": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Cyprus has an ETS implemented."
  },
  "Czech Republic": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Czech Republic has an ETS implemented."
  },
  "Denmark": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Denmark has an ETS implemented."
  },
  "Estonia": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Estonia has an ETS implemented."
  },
  "Finland": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Finland has an ETS implemented."
  },
  "France": {
    "status": "ETS and Carbon Tax Implemented",
    "color": "Dark Blue",
    "hover": "\"ETS and carbon tax implemented.\""
  },
  "Germany": {
    "status": "ETS and Carbon Tax Implemented",
    "color": "Dark Blue",
    "hover": "\"ETS and carbon tax implemented.\""
  },
  "Greece": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Greece has an ETS implemented."
  },
  "Hungary": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Hungary has an ETS implemented."
  },
  "Ireland": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Ireland has an ETS implemented."
  },
  "Italy": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Italy has an ETS implemented."
  },
  "Latvia": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Latvia has an ETS implemented."
  },
  "Lithuania": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Lithuania has an ETS implemented."
  },
  "Luxembourg": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Luxembourg has an ETS implemented."
  },
  "Malta": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Malta has an ETS implemented."
  },
  "Netherlands": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Netherlands has an ETS implemented."
  },
  "Poland": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Poland has an ETS implemented."
  },
  "Portugal": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Portugal has an ETS implemented."
  },
  "Romania": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Romania has an ETS implemented."
  },
  "Slovakia": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Slovakia has an ETS implemented."
  },
  "Slovenia": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Slovenia has an ETS implemented."
  },
  "Spain": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Spain has an ETS implemented."
  },
  "Sweden": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Sweden has an ETS implemented."
  },
  "Morocco": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "\"Under consideration or development.\""
  },
  "Senegal": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "\"Under consideration or development.\""
  },
  "China": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"ETS implemented in regions like Beijing, Shanghai, Guangdong.\""
  },
  "Japan": {
    "status": "Carbon Tax Implemented",
    "color": "Red",
    "hover": "\"Carbon tax implemented.\""
  },
  "Brazil": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "\"Under consideration or development.\""
  },
  "South Africa": {
    "status": "Carbon Tax Implemented",
    "color": "Red",
    "hover": "\"Carbon tax implemented.\""
  },
  "New Zealand": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "\"ETS implemented nationwide.\""
  },
  "Australia": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "\"Under consideration or development.\""
  },
  "Chile": {
    "status": "Carbon Tax Implemented",
    "color": "Red",
    "hover": "\"Carbon tax implemented.\""
  },
  "Argentina": {
    "status": "Carbon Tax Implemented",
    "color": "Red",
    "hover": "\"Carbon tax implemented.\""
  },
  "Mexico": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "\"Under consideration or development.\""
  },
  "Norway": {
    "status": "ETS and Carbon Tax Implemented",
    "color": "Dark Blue",
    "hover": "\"ETS and carbon tax implemented.\""
  },
  "Switzerland": {
    "status": "ETS and Carbon Tax Implemented",
    "color": "Dark Blue",
    "hover": "\"ETS and carbon tax implemented.\""
  },
  "South Korea": {
    "status": "ETS and Carbon Tax Implemented",
    "color": "Dark Blue",
    "hover": "\"ETS and carbon tax implemented.\""
  },
  "India": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "\"Under consideration or development.\""
  },
  "Indonesia": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "\"Under consideration or development.\""
  },
  "Vietnam": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "Vietnam is considering carbon pricing policies."
  },
  "Colombia": {
    "status": "Carbon Tax Implemented",
    "color": "Red",
    "hover": "Colombia has implemented a carbon tax."
  },
  "Kazakhstan": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Kazakhstan has an ETS implemented."
  },
  "Turkey": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "Turkey is in the process of developing ETS."
  },
  "Thailand": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "Thailand is exploring ETS."
  },
  "Philippines": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "Philippines is under discussion for carbon pricing."
  },
  "Russia": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "Russia has introduced a regional ETS pilot."
  },
  "Ukraine": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Ukraine has implemented ETS."
  },
  "Taiwan": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "Taiwan has plans for an ETS."
  },
  "Beijing": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Beijing has an ETS implemented as a pilot."
  },
  "Shanghai": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Shanghai has an ETS implemented as a pilot."
  },
  "Guangdong": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Guangdong has an ETS implemented as a pilot."
  },
  "Hubei": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Hubei has an ETS implemented as a pilot."
  },
  "Shenzhen": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Shenzhen has an ETS implemented as a pilot."
  },
  "Tianjin": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Tianjin has an ETS implemented as a pilot."
  },
  "Chongqing": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Chongqing has an ETS implemented as a pilot."
  },
  "Fujian": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Fujian has an ETS implemented as a pilot."
  },
  "S\u00e3o Paulo": {
    "status": "ETS or Carbon Tax Under Consideration/Development",
    "color": "Light Purple",
    "hover": "S\u00e3o Paulo is considering or developing subnational carbon pricing mechanisms."
  },
  "Sakhalin": {
    "status": "ETS Implemented",
    "color": "Purple",
    "hover": "Sakhalin has implemented a pilot ETS."
  }
}
# Update the 'color' field with hex values
for key in data:
    color_name = data[key]['color']
    data[key]['color'] = color_to_hex.get(color_name, color_name)

# Print the updated data to verify the changes
print(json.dumps(data, indent=2))

# Save the updated data back to a JSON file if needed
with open('updated_country_status_color.json', 'w') as json_file:
    json.dump(data, json_file, indent=2)

