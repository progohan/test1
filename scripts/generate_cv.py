"""Generate the downloadable CV from the same approved data as the website."""
import hashlib
import json
from datetime import date
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'public/data.json'
data = json.loads(source.read_text())
person = data['personal_info']
output = ROOT / 'public' / person['cv_url']
navy = colors.HexColor('#00457c')
font_dir = Path('/usr/share/fonts/truetype/dejavu')
pdfmetrics.registerFont(TTFont('Helvetica', str(font_dir / 'DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('Helvetica-Bold', str(font_dir / 'DejaVuSans-Bold.ttf')))
pdfmetrics.registerFontFamily('Helvetica', normal='Helvetica', bold='Helvetica-Bold')
styles = getSampleStyleSheet()
styles.add(ParagraphStyle('NameCV', fontName='Helvetica-Bold', fontSize=19, leading=23, alignment=TA_CENTER, textColor=navy, spaceAfter=5))
styles.add(ParagraphStyle('RoleCV', fontName='Helvetica-Bold', fontSize=11, leading=15, alignment=TA_CENTER, spaceAfter=5))
styles.add(ParagraphStyle('ContactCV', fontName='Helvetica', fontSize=8.4, leading=12, alignment=TA_CENTER, spaceAfter=12))
styles.add(ParagraphStyle('SectionCV', fontName='Helvetica-Bold', fontSize=10.5, leading=14, textColor=navy, spaceBefore=12, spaceAfter=6, keepWithNext=True))
styles.add(ParagraphStyle('JobCV', fontName='Helvetica-Bold', fontSize=9.7, leading=13, spaceBefore=8, spaceAfter=2, keepWithNext=True))
styles.add(ParagraphStyle('MetaCV', fontName='Helvetica', fontSize=8.5, leading=11, textColor=colors.HexColor('#555555'), spaceAfter=4, keepWithNext=True))
styles.add(ParagraphStyle('BodyCV', fontName='Helvetica', fontSize=9.2, leading=12.5, spaceAfter=4))
styles.add(ParagraphStyle('BulletCV', parent=styles['BodyCV'], leftIndent=10, firstLineIndent=-8, spaceAfter=3))

def text(value):
    return escape(str(value).replace('\u2013', '-').replace('\u2014', '-').replace('\u2011', '-'))

story = []
def paragraph(value, style='BodyCV'):
    story.append(Paragraph(value, styles[style]))

paragraph(text(person['full_name']), 'NameCV')
paragraph(text(data['work_experience'][0]['position']) + ' | Civil Infrastructure', 'RoleCV')
paragraph(text(person['location']) + ' | ' + text(person['contact']['email']) + '<br/>' + text(person['contact']['linkedin']), 'ContactCV')
paragraph(text(person['cv_summary']))
paragraph('CORE COMPETENCIES', 'SectionCV')
paragraph(' | '.join(text(item) for item in data['core_competencies']))
paragraph('PROFESSIONAL EXPERIENCE', 'SectionCV')
for job in data['work_experience']:
    first = len(story)
    paragraph(text(job['company']) + ' | ' + text(job['position']), 'JobCV')
    paragraph(text(job['location']) + ' | ' + text(job['duration']), 'MetaCV')
    for responsibility in job['responsibilities']:
        paragraph('- ' + text(responsibility), 'BulletCV')
    block = story[first:]
    del story[first:]
    story.append(KeepTogether(block))

paragraph('EDUCATION', 'SectionCV')
for record in data['education']:
    paragraph('<b>' + text(record['degree']) + '</b> - ' + text(record['institution']) + ' | ' + text(record['year']))
paragraph('POSTGRADUATE TRAINING', 'SectionCV')
for record in data['postgraduate_programs']:
    paragraph(text(record['program']) + ' - ' + text(record['institution']) + ' | ' + text(record['year']))
paragraph('LICENSES AND CERTIFICATIONS', 'SectionCV')
for record in data['professional_certifications']:
    details = record.get('jurisdictions') or [record.get('jurisdiction') or record.get('issuing_organization') or record.get('organization') or '']
    paragraph('<b>' + text(record['certification']) + '</b>' + (' - ' + text(', '.join(details)) if any(details) else '') + (' (' + text(record['country']) + ')' if record.get('country') else ''))

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#ccd6df'))
    canvas.line(.55 * inch, .45 * inch, LETTER[0] - .55 * inch, .45 * inch)
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(colors.HexColor('#555555'))
    canvas.drawString(.55 * inch, .28 * inch, person['full_name'])
    canvas.drawRightString(LETTER[0] - .55 * inch, .28 * inch, f'Updated {date.today().isoformat()} - Page {doc.page}')
    canvas.restoreState()

document = SimpleDocTemplate(str(output), pagesize=LETTER, rightMargin=.55 * inch, leftMargin=.55 * inch, topMargin=.5 * inch, bottomMargin=.65 * inch, title=person['full_name'] + ' - Curriculum Vitae', author=person['full_name'])
document.build(story, onFirstPage=footer, onLaterPages=footer)
manifest = {'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'pdf_sha256': hashlib.sha256(output.read_bytes()).hexdigest(), 'current_company': data['work_experience'][0]['company'], 'current_title': data['work_experience'][0]['position'], 'generated_on': date.today().isoformat()}
(ROOT / 'public/cv-source.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Generated {output.name} from public/data.json.')
