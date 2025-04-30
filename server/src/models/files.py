import os
import shutil
from urllib.parse import unquote

from models.tags import TagsDataModel


class FilesDataModel:
    def __init__(self, files_dir: list[str], tags_model: TagsDataModel):
        self.files_dir = files_dir
        self.tags_model = tags_model

    def get_files(self, sort=True):
        if os.path.exists(self.files_dir):
            # Get all files in files directory
            files = [
                f
                for f in os.listdir(self.files_dir)
                if os.path.isfile(os.path.join(self.files_dir, f))
            ]

            if sort:
                files.sort()

            return self.populate_files(files)

        return []

    def get_file_content(self, filename):
        file_path = os.path.join(self.files_dir, filename)

        if not os.path.exists(file_path):
            return None

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        return {"name": filename, "content": content}

    def populate_files(self, files):
        tags = self.tags_model.get_tags()
        populated_files = []

        for file in files:
            file_info = self.get_file_content(filename=file)

            if not file_info:
                continue

            # Get tags for the file
            if file in tags:
                file_tags = tags[unquote(file)]
            else:
                file_tags = []

            populated_files.append(
                {
                    "name": file_info["name"],
                    "content": file_info["content"],
                    "tags": file_tags,
                }
            )

        return populated_files

    def add(self, filename, content):
        os.makedirs(self.files_dir, exist_ok=True)

        file_path = os.path.join(self.files_dir, filename)

        if os.path.exists(file_path):
            return None

        with open(file_path, "w") as f:
            f.write(content)

        return {"name": filename, "content": content}

    def add_buffer(self, filename, content_buffer):
        os.makedirs(self.files_dir, exist_ok=True)

        file_path = os.path.join(self.files_dir, filename)

        if os.path.exists(file_path):
            return None

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(content_buffer, buffer)

        return {
            "name": filename,
        }

    def update(self, filename, content):
        os.makedirs(self.files_dir, exist_ok=True)

        file_path = os.path.join(self.files_dir, filename)

        if not os.path.exists(file_path):
            return None

        with open(file_path, "w") as f:
            f.write(content)

        return {"name": filename}

    def delete(self, filename):
        os.makedirs(self.files_dir, exist_ok=True)

        file_path = os.path.join(self.files_dir, filename)

        if not os.path.exists(file_path):
            return None

        os.remove(file_path)
