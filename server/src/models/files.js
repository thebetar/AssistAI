import fs from 'fs';
import path from 'path';

class FilesDataModel {
    constructor(filesDir, tagsModel) {
        this.filesDir = filesDir;
        this.tagsModel = tagsModel;

        if (!fs.existsSync(this.filesDir)) {
            fs.mkdirSync(this.filesDir, { recursive: true });
        }
    }

    getFiles(sort = false) {
        if (!fs.existsSync(this.filesDir)) {
            return [];
        }

        const files = fs.readdirSync(this.filesDir).filter(file => fs.statSync(path.join(this.filesDir, file)).isFile());

        if (sort) {
            files.sort();
        }

        return this.populateFiles(files);
    }

    getFileContent(file) {
        const filePath = path.join(this.filesDir, file);

        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
            return null;
        }

        return fs.readFileSync(filePath, 'utf-8');
    }

    populateFiles(files) {
        const tags = this.tagsModel.getTags();
        const populatedFiles = [];

        for (const file of files) {
            const content = this.getFileContent(file);
            const fileTags = tags[file] || [];

            populatedFiles.push({
                name: file,
                content,
                tags: fileTags
            });
        }

        return populatedFiles;
    }

    add(filename, content) {
        const filePath = path.join(this.filesDir, `${filename}.md`);

        if (fs.existsSync(filePath)) {
            return null;
        }

        fs.writeFileSync(filePath, content, 'utf-8');

        return {
            name: filename,
            content,
        }
    }

    update(oldFilename, filename, content) {
        let filePath = path.join(this.filesDir, `${oldFilename}.md`);

        if (!fs.existsSync(filePath)) {
            return null;
        }

        if (oldFilename !== filename) {
            fs.unlinkSync(filePath);
            filePath = path.join(this.filesDir, `${filename}.md`);
        }

        fs.writeFileSync(filePath, content, 'utf-8');

        return {
            name: filename,
            content,
        }
    }

    delete(filename) {
        const filePath = path.join(this.filesDir, filename);

        if (!fs.existsSync(filePath)) {
            return null;
        }

        fs.unlinkSync(filePath);

        return filename;
    }
}

export default FilesDataModel;