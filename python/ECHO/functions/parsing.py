from typing import Union
from ..schemas.response import nested_ECHO, flat_ECHO

def parse_payload(payload: dict) -> Union[nested_ECHO, flat_ECHO]:
    if 'project_description' in payload:
        try:
            return nested_ECHO(**payload)
        except ValueError as e:
            raise ValueError(f"Payload doesn't match nested_ECHO schema: {str(e)}")
    else:
        try:
            return flat_ECHO(**payload)
        except ValueError as e:
            raise ValueError(f"Payload doesn't match flat_ECHO schema: {str(e)}")