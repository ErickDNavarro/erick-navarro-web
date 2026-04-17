import glob, re

with open('index.html', 'r', encoding='utf-8') as f: content = f.read()

nav_match = re.search(r'<nav class="nav">.*?</nav>', content, re.DOTALL)
footer_match = re.search(r'<footer class="footer">.*?</footer>', content, re.DOTALL)

nav_str = nav_match.group(0) if nav_match else ''
footer_str = footer_match.group(0) if footer_match else ''

html_files = glob.glob('*.html')
nav_mismatches = []
footer_mismatches = []

for file in html_files:
    if file == 'index.html': continue
    with open(file, 'r', encoding='utf-8') as f: c = f.read()
    
    n_match = re.search(r'<nav class="nav">.*?</nav>', c, re.DOTALL)
    f_match = re.search(r'<footer class="footer">.*?</footer>', c, re.DOTALL)
    
    if n_match and n_match.group(0) != nav_str: nav_mismatches.append(file)
    if f_match and f_match.group(0) != footer_str: footer_mismatches.append(file)

print('Nav mismatches:', nav_mismatches)
print('Footer mismatches:', footer_mismatches)
