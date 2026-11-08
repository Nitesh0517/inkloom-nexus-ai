import io
from pypdf import PdfReader
from docx import Document

class DocumentService:
    @staticmethod
    def extract_text(file_bytes: bytes, filename: str) -> str:
        """
        Extract plain text from uploaded PDF, DOCX, or TXT files.
        """
        lower_name = filename.lower()
        
        if lower_name.endswith('.pdf'):
            try:
                reader = PdfReader(io.BytesIO(file_bytes))
                text_parts = []
                for page_num, page in enumerate(reader.pages):
                    extracted = page.extract_text()
                    if extracted:
                        text_parts.append(extracted)
                return "\n\n".join(text_parts).strip()
            except Exception as e:
                return f"[PDF Extraction Error: {str(e)}]"

        elif lower_name.endswith('.docx') or lower_name.endswith('.doc'):
            try:
                doc = Document(io.BytesIO(file_bytes))
                full_text = []
                for para in doc.paragraphs:
                    if para.text.strip():
                        full_text.append(para.text)
                for table in doc.tables:
                    for row in table.rows:
                        row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                        if row_text:
                            full_text.append(" | ".join(row_text))
                return "\n".join(full_text).strip()
            except Exception as e:
                return f"[DOCX Extraction Error: {str(e)}]"

        elif lower_name.endswith('.txt') or lower_name.endswith('.md'):
            try:
                return file_bytes.decode('utf-8', errors='replace').strip()
            except Exception as e:
                return f"[TXT Extraction Error: {str(e)}]"

        return f"[Unsupported file format: {filename}]"
