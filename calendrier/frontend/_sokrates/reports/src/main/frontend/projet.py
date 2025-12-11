import os

# Folder to scan
root_folder = r"C:\Users\Tech\Calendrier-1\calendrier\frontend"

# Output file (inside the scanned folder)
output_file = os.path.join(root_folder, "all_files_content.txt")

# File extensions to include
TEXT_EXTENSIONS = (
    '.php', '.html', '.js', '.jsx', '.ts', '.tsx',
    '.css', '.scss', '.json', '.xml', '.md', '.txt', '.yml', '.yaml'
)

# Folders to skip completely
EXCLUDED_FOLDERS = {".git", "node_modules", "_sokrates", "_sokrates-explorer", "dist"}

# Specific files to skip (only by filename, not full path)
EXCLUDED_FILES = {
    "analysis_conventions.json",
    ".eslintrc.json",
    "eslint-config.json",
    "eslint.config.js",
    "git-history.txt",
    "jest.config.js",
    "package.json"
}

with open(output_file, "w", encoding="utf-8") as out:
    for foldername, subfolders, filenames in os.walk(root_folder):
        # Skip unwanted folders
        subfolders[:] = [d for d in subfolders if d not in EXCLUDED_FOLDERS]

        out.write(f"\n📂 Directory: {foldername}\n")
        out.write("=" * 80 + "\n")

        for filename in filenames:
            file_path = os.path.join(foldername, filename)

            # Skip the output file itself
            if os.path.abspath(file_path) == os.path.abspath(output_file):
                continue

            # Skip excluded files
            if filename in EXCLUDED_FILES:
                continue

            # Skip package-lock.json at the root folder
            if (
                filename == "package-lock.json"
                and os.path.dirname(file_path) == os.path.abspath(root_folder)
            ):
                continue

            # Skip non-text files
            if not filename.lower().endswith(TEXT_EXTENSIONS):
                continue

            out.write(f"\n📝 File: {filename}\nPath: {file_path}\n")
            out.write("-" * 80 + "\n")
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read().strip()
                    if content:
                        out.write(content + "\n")
                    else:
                        out.write("⚠️ File is empty\n")
            except Exception as e:
                out.write(f"⚠️ Could not read file: {e}\n")
        out.write("\n" + "=" * 80 + "\n")

print(f"✅ Done. Output saved to: {output_file}")