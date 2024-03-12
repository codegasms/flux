import os
import requests

def download_images(txt_file_name):
    script_folder = os.path.dirname(os.path.realpath(__file__))
    output_folder = script_folder

    txt_file_path = os.path.join(script_folder, txt_file_name)

    with open(txt_file_path, 'r') as file:
        image_urls = file.read().splitlines()

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for url in image_urls:
        try:
            response = requests.get(url, stream=True)
            if response.status_code == 200:
                image_name = url.split("/")[-1]
                image_path = os.path.join(output_folder, image_name)
                with open(image_path, 'wb') as img_file:
                    for chunk in response.iter_content(chunk_size=128):
                        img_file.write(chunk)
                print(f"Downloaded: {image_name}")
            else:
                print(f"Failed to download: {url}")
        except Exception as e:
            print(f"Error downloading {url}: {e}")

# Example usage:
txt_file_name = 'a.txt'
download_images(txt_file_name)
