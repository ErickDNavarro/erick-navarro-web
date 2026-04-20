import os
import glob

links = '<li><a href="privacidad.html">Privacidad</a></li>\n                <li><a href="https://www.linkedin.com/in/erickdavidnavarro" target="_blank" rel="noopener">LinkedIn</a></li>'

for f in glob.glob('*.html'):
    if f in ['index.html', 'privacidad.html']:
        continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if '<li><a href="https://www.linkedin.com/in/erickdavidnavarro"' not in content:
        content = content.replace('<li><a href="privacidad.html">Privacidad</a></li>', links)
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print('Updated', f)
