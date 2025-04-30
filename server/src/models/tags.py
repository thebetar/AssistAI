import os
import json


class TagsDataModel:
    def __init__(self, tags_file):
        self.tags_file = tags_file

    def get_tags(self):
        if os.path.exists(self.tags_file):
            with open(self.tags_file, "r") as f:
                return json.load(f)

        return {}

    def add(self, filename, tag):
        tags = self.get_tags()

        if filename in tags:
            tags[filename].append(tag)
            tags[filename].sort()
        else:
            tags[filename] = [tag]

        with open(self.tags_file, "w") as f:
            json.dump(tags, f)

        return tags

    def remove_file(self, filename):
        tags = self.get_tags()

        if filename not in tags:
            return None

        del tags[filename]

        with open(self.tags_file, "w") as f:
            json.dump(tags, f)

        return tags

    def remove_tag(self, filename, tag):
        tags = self.get_tags()

        if filename not in tags:
            return None

        tags[filename] = [t for t in tags[filename] if t != tag]

        with open(self.tags_file, "w") as f:
            json.dump(tags, f)

        return tags

    def get_tags_for_file(self, filename):
        tags = self.get_tags()

        if filename in tags:
            return tags[filename]

        return []
