import requests
import os

def read_filenames(file_path):
    with open(file_path, 'r') as file:
        # Read lines and remove any leading/trailing whitespace
        return [line.strip() for line in file if line.strip()]

def download_jpg_files(base_url, file_list, output_directory):
    # Create the output directory if it doesn't exist
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    # Download each file in the list
    for filename in file_list:
        # Construct the full URL
        full_url = f"{base_url}/{filename}"
        
        # Construct the full local path
        local_path = os.path.join(output_directory, filename)
        
        # Download the file
        response = requests.get(full_url)
        if response.status_code == 200:
            with open(local_path, 'wb') as file:
                file.write(response.content)
            print(f"Downloaded: {filename}")
        else:
            print(f"Failed to download {filename}. Status code: {response.status_code}")

# Usage
base_url = "https://www.planyourrecovery.com/img/illustration"
output_directory = "H:/My Drive/PYR Images"
filenames_file = "jpg_filenames.txt"

# Read filenames from the text file
jpg_files = read_filenames(filenames_file)

# Download the files
download_jpg_files(base_url, jpg_files, output_directory)