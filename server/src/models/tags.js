import fs from 'fs';

class TagsDataModel {
    constructor(tagsFile) {
        this.tagsFile = tagsFile;

        if (!fs.existsSync(this.tagsFile)) {
            fs.writeFileSync(this.tagsFile, JSON.stringify({}));
        }
    }

    getTags() {
        const tags = JSON.parse(fs.readFileSync(this.tagsFile, 'utf-8'));

        return tags;
    }

    getTagsForFile(filename) {
        const tags = this.getTags();

        if (tags[filename]) {
            return tags[filename];
        }

        return [];
    }

    add(filename, tag) {
        const tags = this.getTags();

        if (!tags[filename]) {
            tags[filename] = [tag];
        } else {
            tags[filename].push(tag);
        }

        fs.writeFileSync(this.tagsFile, JSON.stringify(tags, null, 4));
    }

    removeFile(filename) {
        const tags = this.getTags();

        if (tags[filename]) {
            delete tags[filename];
            fs.writeFileSync(this.tagsFile, JSON.stringify(tags, null, 4));
        }

        return tags;
    }

    removeTag(filename, tag) {
        const tags = this.getTags();

        if (tags[filename]) {
            const filteredTags = tags[filename].filter(t => t !== tag);

            if (tags[filename].length === 0) {
                delete tags[filename];
            } else {
                tags[filename] = filteredTags;
            }

            fs.writeFileSync(this.tagsFile, JSON.stringify(tags, null, 4));
        }

        return tags;
    }
}

export default TagsDataModel;