#!/usr/bin/env python3
"""Data validator for LGU configuration, Citizen's Charter, and FDP data.

Checks JSON files against expected structural and field invariants.
"""

import json
import re
import sys
from pathlib import Path


def validate_lgu_config(data: dict) -> list[str]:
    """Validate LGU configuration data."""
    errors = []
    required_keys = [
        "lgu_name",
        "lgu_level",
        "province",
        "region",
        "psgc_code",
        "income_class",
        "mayor",
        "contact",
    ]
    for key in required_keys:
        if key not in data:
            errors.append(f"lgu_config: Missing required key '{key}'")

    valid_levels = ["Barangay", "Municipality", "City", "Province"]
    if data.get("lgu_level") not in valid_levels:
        errors.append(
            f"lgu_config: Invalid lgu_level '{data.get('lgu_level')}'. Must be one of {valid_levels}"
        )

    psgc = str(data.get("psgc_code", ""))
    if not re.match(r"^\d{10}$", psgc):
        errors.append(f"lgu_config: PSGC code '{psgc}' must be exactly 10 digits")

    contact = data.get("contact", {})
    if isinstance(contact, dict):
        email = contact.get("email", "")
        if not re.match(r"^[^@]+@[^@]+\.[^@]+$", email):
            errors.append(f"lgu_config: Invalid contact email '{email}'")

    return errors


def validate_citizens_charter(data: dict) -> list[str]:
    """Validate Citizen's Charter dataset."""
    errors = []
    if "updated_at" not in data or "services" not in data:
        errors.append("citizens_charter: Missing 'updated_at' or 'services'")
        return errors

    date_str = str(data.get("updated_at", ""))
    if not re.match(r"^\d{4}-\d{2}-\d{2}$", date_str):
        errors.append(f"citizens_charter: Invalid updated_at date format '{date_str}'")

    valid_classifications = ["Simple", "Complex", "Highly Technical"]
    services = data.get("services", [])
    if not isinstance(services, list):
        errors.append("citizens_charter: 'services' must be a list")
        return errors

    for idx, service in enumerate(services):
        for field in [
            "id",
            "service_name",
            "office",
            "classification",
            "processing_time",
            "fees",
            "required_documents",
        ]:
            if field not in service:
                errors.append(
                    f"citizens_charter: Service #{idx} missing required field '{field}'"
                )

        cls = service.get("classification")
        if cls and cls not in valid_classifications:
            errors.append(
                f"citizens_charter: Service #{idx} invalid classification '{cls}'"
            )

    return errors


def validate_fdp_portal(data: dict) -> list[str]:
    """Validate Full Disclosure Policy dataset."""
    errors = []
    for field in ["fiscal_year", "quarter", "documents"]:
        if field not in data:
            errors.append(f"fdp_portal: Missing required field '{field}'")

    valid_quarters = ["Q1", "Q2", "Q3", "Q4", "Annual"]
    if data.get("quarter") not in valid_quarters:
        errors.append(
            f"fdp_portal: Invalid quarter '{data.get('quarter')}'. Must be one of {valid_quarters}"
        )

    docs = data.get("documents", [])
    if not isinstance(docs, list):
        errors.append("fdp_portal: 'documents' must be a list")
        return errors

    valid_statuses = ["Published", "Archived", "Pending"]
    for idx, doc in enumerate(docs):
        for field in [
            "id",
            "category",
            "title",
            "publication_date",
            "file_url",
            "status",
        ]:
            if field not in doc:
                errors.append(f"fdp_portal: Doc #{idx} missing required field '{field}'")

        status = doc.get("status")
        if status and status not in valid_statuses:
            errors.append(f"fdp_portal: Doc #{idx} invalid status '{status}'")

    return errors


def main() -> int:
    base_dir = Path(__file__).resolve().parent.parent / "data"
    all_errors = []

    files_to_check = [
        (base_dir / "lgu_config.json", validate_lgu_config),
        (base_dir / "citizens_charter.json", validate_citizens_charter),
        (base_dir / "fdp_portal.json", validate_fdp_portal),
    ]

    for file_path, validator_func in files_to_check:
        if not file_path.exists():
            all_errors.append(f"File not found: {file_path}")
            continue

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            errs = validator_func(data)
            all_errors.extend(errs)
        except Exception as exc:
            all_errors.append(f"Failed to parse {file_path.name}: {exc}")

    if all_errors:
        print(f"Validation FAILED with {len(all_errors)} error(s):")
        for err in all_errors:
            print(f"  - {err}")
        return 1

    print("Data validation PASSED successfully for all LGU files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
