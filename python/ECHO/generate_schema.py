import json
from schemas.response import nested_ECHO, flat_ECHO

# generate json schema for each model and export to json
nested_echo_dict = nested_ECHO.model_json_schema() 
flat_echo_dict = flat_ECHO.model_json_schema() 

# generate json schema for each model and export to json
with open("../../nested_ECHO.json", "w") as f:
    json.dump(nested_echo_dict, f, indent=2)

with open("../../flat_echo.json", "w") as f:
    json.dump(flat_echo_dict, f, indent=2)