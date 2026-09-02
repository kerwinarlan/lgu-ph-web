#!/usr/bin/env python3
"""Generate minimal valid PDF files for FDP and BAC procurement documents."""

import json
from pathlib import Path

def create_pdf_bytes(title: str, category: str, doc_id: str, date_str: str) -> bytes:
    """Generate valid PDF 1.4 byte content."""
    stream_content = (
        f"BT\n"
        f"/F1 18 Tf\n"
        f"50 720 Td\n"
        f"(REPUBLIC OF THE PHILIPPINES) Tj\n"
        f"0 -24 Td\n"
        f"(MUNICIPALITY OF TANZA, CAVITE) Tj\n"
        f"/F1 14 Tf\n"
        f"0 -36 Td\n"
        f"({category.upper()}) Tj\n"
        f"/F1 12 Tf\n"
        f"0 -24 Td\n"
        f"(Document ID: {doc_id}) Tj\n"
        f"0 -20 Td\n"
        f"(Title: {title}) Tj\n"
        f"0 -20 Td\n"
        f"(Publication Date: {date_str}) Tj\n"
        f"0 -36 Td\n"
        f"(Official Public Disclosure Document) Tj\n"
        f"0 -18 Td\n"
        f"(Compliant with DILG Full Disclosure Policy & RA 9184) Tj\n"
        f"ET"
    ).encode("ascii")

    stream_length = len(stream_content)

    obj1 = b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
    obj2 = b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
    obj3 = b"3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n"
    obj4 = b"4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"
    obj5 = f"5 0 obj\n<< /Length {stream_length} >>\nstream\n".encode("ascii") + stream_content + b"\nendstream\nendobj\n"

    header = b"%PDF-1.4\n"

    pos1 = len(header)
    pos2 = pos1 + len(obj1)
    pos3 = pos2 + len(obj2)
    pos4 = pos3 + len(obj3)
    pos5 = pos4 + len(obj4)
    xref_pos = pos5 + len(obj5)

    xref = (
        f"xref\n"
        f"0 6\n"
        f"0000000000 65535 f \n"
        f"{pos1:010d} 00000 n \n"
        f"{pos2:010d} 00000 n \n"
        f"{pos3:010d} 00000 n \n"
        f"{pos4:010d} 00000 n \n"
        f"{pos5:010d} 00000 n \n"
        f"trailer\n"
        f"<< /Size 6 /Root 1 0 R >>\n"
        f"startxref\n"
        f"{xref_pos}\n"
        f"%%EOF\n"
    ).encode("ascii")

    return header + obj1 + obj2 + obj3 + obj4 + obj5 + xref

def main():
    repo_root = Path(__file__).resolve().parent.parent
    fdp_json_path = repo_root / "data" / "fdp_portal.json"
    pdf_dir = repo_root / "docs" / "fdp"
    pdf_dir.mkdir(parents=True, exist_ok=True)

    with open(fdp_json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for doc in data.get("documents", []):
        file_url = doc.get("file_url", "")
        if not file_url.startswith("docs/fdp/"):
            continue

        pdf_path = repo_root / file_url
        pdf_bytes = create_pdf_bytes(
            title=doc.get("title", "Document"),
            category=doc.get("category", "General"),
            doc_id=doc.get("id", "FDP"),
            date_str=doc.get("publication_date", "2025-01-01")
        )
        pdf_path.write_bytes(pdf_bytes)
        print(f"Generated: {pdf_path.relative_to(repo_root)}")

if __name__ == "__main__":
    main()
