"""Test suite for LGU data validator functions."""

import os
import sys
import unittest

# Ensure parent directory is in python path
sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
)

from scripts.validate_data import (
    validate_citizens_charter,
    validate_fdp_portal,
    validate_lgu_config,
)


class TestLGUValidator(unittest.TestCase):

    def test_valid_lgu_config(self):
        valid_data = {
            "lgu_name": "Municipality of Test",
            "lgu_level": "Municipality",
            "province": "Quezon",
            "region": "Region IV-A",
            "psgc_code": "0405621000",
            "income_class": "1st Class",
            "mayor": {"name": "Mayor Test", "term": "2022-2025"},
            "contact": {
                "address": "Town Hall",
                "phone": "123-4567",
                "email": "info@test.gov.ph",
                "office_hours": "8am-5pm",
            },
        }
        errors = validate_lgu_config(valid_data)
        self.assertEqual(errors, [])

    def test_invalid_psgc_code(self):
        invalid_data = {
            "lgu_name": "Municipality of Test",
            "lgu_level": "Municipality",
            "province": "Quezon",
            "region": "Region IV-A",
            "psgc_code": "12345",  # Too short
            "income_class": "1st Class",
            "mayor": {"name": "Mayor Test", "term": "2022-2025"},
            "contact": {
                "address": "Town Hall",
                "phone": "123-4567",
                "email": "info@test.gov.ph",
                "office_hours": "8am-5pm",
            },
        }
        errors = validate_lgu_config(invalid_data)
        self.assertEqual(len(errors), 1)
        self.assertIn("PSGC code", errors[0])

    def test_valid_citizens_charter(self):
        valid_data = {
            "updated_at": "2025-01-01",
            "services": [
                {
                    "id": "CC-1",
                    "service_name": "Permit",
                    "office": "BPLO",
                    "classification": "Simple",
                    "processing_time": "1 day",
                    "fees": "None",
                    "required_documents": ["ID"],
                }
            ],
        }
        errors = validate_citizens_charter(valid_data)
        self.assertEqual(errors, [])

    def test_valid_fdp_portal(self):
        valid_data = {
            "fiscal_year": 2024,
            "quarter": "Q4",
            "documents": [
                {
                    "id": "FDP-01",
                    "category": "Budget",
                    "title": "Annual Budget",
                    "publication_date": "2024-01-01",
                    "file_url": "index.html",
                    "status": "Published",
                }
            ],
        }
        errors = validate_fdp_portal(valid_data)
        self.assertEqual(errors, [])


if __name__ == "__main__":
    unittest.main()
