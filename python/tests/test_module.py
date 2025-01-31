# test parser and validate the schema of the payload
import os
import unittest
import json
from ECHO.schemas.response import nested_ECHO, flat_ECHO

TEST_DIR = os.path.join(os.path.dirname(__file__))

class TestECHO(unittest.TestCase):
    def test_parse_flat_payload(self):
        # read data/test_flat.json into payload dict
        payload = json.load(open(TEST_DIR + "/data/test_flat_basic.json", "r"))
        flat_ECHO(**payload)

    def test_parse_nested_payload(self):    
        payload = json.load(open(TEST_DIR + "/data/test_nested_basic.json", "r"))
        nested_ECHO(**payload)