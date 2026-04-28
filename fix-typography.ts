import * as fs from 'fs';
import * as path from 'path';

const componentsDir = path.join(process.cwd(), 'src/components');

function replaceTypography(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceTypography(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // We want to replace font-black with font-bold for h3, h4, and p.
            // But we can just aggressively replace font-black to font-bold everywhere
            // EXCEPT on text-4xl, text-5xl, text-7xl, text-3xl.
            
            // First, change all font-black to font-bold.
            content = content.replace(/className="([^"]*)font-black([^"]*)"/g, (match, p1, p2) => {
                if (match.includes('text-4xl') || match.includes('text-5xl') || match.includes('text-6xl') || match.includes('text-7xl') || match.includes('text-3xl')) {
                    return match.replace('font-black', 'font-black'); // keep it
                }
                // Also keep numbers like metrics (we might not know from regex, but numbers are usually large text-4xl+)
                return `className="${p1}font-bold${p2}"`;
            });

            fs.writeFileSync(fullPath, content);
        }
    }
}

replaceTypography(componentsDir);
console.log('Typography replacements done.');
