const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'resources/js/Pages/Admin/AcademicClasses');

function fixFiles(currentPath) {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
        const fullPath = path.join(currentPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixFiles(fullPath);
        } else if (file.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Fix auth.user
            content = content.replace(/auth\.academic_class/g, 'auth.user');
            content = content.replace(/academic_class=\{auth\?\.user\}/g, 'user={auth?.user}');
            content = content.replace(/auth\?\.academic_class/g, 'auth?.user');
            
            // Fix plural variables and routes
            content = content.replace(/academic_classs/g, 'classes');
            content = content.replace(/admin\.classes\.index/g, 'admin.classes.index');
            
            // Re-read some table properties (name, numeric_value, sections_count)
            // Fix route names
            content = content.replace(/route\(['"]admin\.classes\./g, "route('admin.classes.");
            
            fs.writeFileSync(fullPath, content);
        }
    }
}

fixFiles(dir);
console.log("Fix script complete.");
