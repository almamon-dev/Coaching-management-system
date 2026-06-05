const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, 'resources/js/Pages/Admin/AcademicClasses');
const DEST_DIR = path.join(__dirname, 'resources/js/Pages/Admin/Students');

function replaceContent(content) {
    let newContent = content;
    // Simple replacements
    newContent = newContent.replace(/AcademicClass/g, 'Student');
    newContent = newContent.replace(/academic_class/g, 'student');
    newContent = newContent.replace(/Academic Class/g, 'Student');
    newContent = newContent.replace(/academic classes/gi, 'students');
    newContent = newContent.replace(/classes/g, 'students');
    newContent = newContent.replace(/class/gi, 'student');
    newContent = newContent.replace(/admin\.students\.index/g, 'admin.students.index'); // already replaced classes -> students
    
    // Fix any double replacements
    newContent = newContent.replace(/studentes/g, 'students');

    return newContent;
}

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        // Rename file if it contains AcademicClass
        const destName = entry.name.replace(/AcademicClass/g, 'Student');
        const destPath = path.join(dest, destName);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else if (entry.name.endsWith('.jsx')) {
            const content = fs.readFileSync(srcPath, 'utf8');
            fs.writeFileSync(destPath, replaceContent(content));
        }
    }
}

copyDir(SOURCE_DIR, DEST_DIR);
console.log("Successfully copied and transformed UI components!");
