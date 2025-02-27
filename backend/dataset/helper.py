import pandas as pd
import os
import shutil
import json
from sklearn.model_selection import train_test_split
import re
from collections import Counter

# Read and analyze the CSV file
df = pd.read_csv('data.csv')

# Extract unique disease classes
disease_classes = df['Label'].unique()
print(f"Found {len(disease_classes)} unique disease classes")

# Create directory structure
base_dir = 'plantGuard_dataset'
image_dir = os.path.join(base_dir, 'images')
metadata_dir = os.path.join(base_dir, 'metadata')
en_metadata_dir = os.path.join(metadata_dir, 'english')
rw_metadata_dir = os.path.join(metadata_dir, 'kinyarwanda')

# Create directories
os.makedirs(base_dir, exist_ok=True)
os.makedirs(image_dir, exist_ok=True)
os.makedirs(metadata_dir, exist_ok=True)
os.makedirs(en_metadata_dir, exist_ok=True)
os.makedirs(rw_metadata_dir, exist_ok=True)

# Create directories for each disease class
for disease in disease_classes:
    # Clean up disease name for directory name
    dir_name = re.sub(r'[\s\(\)\[\]\{\},]', '_', disease)
    dir_name = re.sub(r'_+', '_', dir_name)  # Replace multiple underscores with single one
    dir_name = dir_name.strip('_')  # Remove leading/trailing underscores
    
    os.makedirs(os.path.join(image_dir, dir_name), exist_ok=True)

# Copy and organize images
source_image_dir = './SVMTrain/SVMTrain'

for _, row in df.iterrows():
    disease_class = row['Label']
    image1 = row['name_1']
    image2 = row['name_2']
    
    # Clean up disease name for directory name
    dir_name = re.sub(r'[\s\(\)\[\]\{\},]', '_', disease_class)
    dir_name = re.sub(r'_+', '_', dir_name)  # Replace multiple underscores with single one
    dir_name = dir_name.strip('_')  # Remove leading/trailing underscores
    
    # Create destination paths
    dest_dir = os.path.join(image_dir, dir_name)
    
    # Copy images (if they exist)
    try:
        if os.path.exists(os.path.join(source_image_dir, image1)):
            shutil.copy(
                os.path.join(source_image_dir, image1),
                os.path.join(dest_dir, image1)
            )
        if os.path.exists(os.path.join(source_image_dir, image2)):
            shutil.copy(
                os.path.join(source_image_dir, image2),
                os.path.join(dest_dir, image2)
            )
    except Exception as e:
        print(f"Error copying image: {e}")

# Create metadata template for each disease
for disease in disease_classes:
    # Clean up disease name for display
    clean_name = re.sub(r'[_]', ' ', disease).replace('___', ' - ')
    
    # Create a filename-friendly version of the disease name 
    # Replace spaces and special characters with underscores
    filename = re.sub(r'[\s\(\)\[\]\{\},]', '_', disease)
    filename = re.sub(r'_+', '_', filename)  # Replace multiple underscores with single one
    filename = filename.strip('_')  # Remove leading/trailing underscores
    
    # English metadata template
    en_metadata = {
        "name": clean_name,
        "symptoms": [
            "Symptom 1 - To be filled",
            "Symptom 2 - To be filled"
        ],
        "treatment": [
            "Treatment 1 - To be filled",
            "Treatment 2 - To be filled"
        ],
        "prevention": [
            "Prevention 1 - To be filled",
            "Prevention 2 - To be filled"
        ]
    }
    
    # Save English metadata with uniform filename
    with open(os.path.join(en_metadata_dir, f"{filename}.json"), 'w') as f:
        json.dump(en_metadata, f, indent=4)
    
    # Kinyarwanda metadata template (to be translated)
    rw_metadata = {
        "name": "To be translated to Kinyarwanda",
        "symptoms": [
            "Symptom 1 - To be translated",
            "Symptom 2 - To be translated"
        ],
        "treatment": [
            "Treatment 1 - To be translated",
            "Treatment 2 - To be translated"
        ],
        "prevention": [
            "Prevention 1 - To be translated",
            "Prevention 2 - To be translated"
        ]
    }
    
    # Save Kinyarwanda metadata with the same uniform filename
    with open(os.path.join(rw_metadata_dir, f"{filename}.json"), 'w') as f:
        json.dump(rw_metadata, f, indent=4)

# Generate train/validation/test splits
all_image_paths = []
for disease in disease_classes:
    # Clean up disease name for directory name
    dir_name = re.sub(r'[\s\(\)\[\]\{\},]', '_', disease)
    dir_name = re.sub(r'_+', '_', dir_name)  # Replace multiple underscores with single one
    dir_name = dir_name.strip('_')  # Remove leading/trailing underscores
    
    disease_dir = os.path.join(image_dir, dir_name)
    image_paths = [os.path.join(disease_dir, img) for img in os.listdir(disease_dir) if img.endswith('.JPG')]
    all_image_paths.extend([(img_path, disease) for img_path in image_paths])

# Check class distribution
class_distribution = Counter([label for _, label in all_image_paths])
print("Class distribution:")
for class_name, count in class_distribution.items():
    print(f"{class_name}: {count} images")

# Identify classes with fewer than 3 samples
small_classes = [cls for cls, count in class_distribution.items() if count < 3]
print(f"\nFound {len(small_classes)} classes with fewer than 3 samples")

# Filter out images from small classes for stratified split
stratified_images = [(path, label) for path, label in all_image_paths if label not in small_classes]
small_class_images = [(path, label) for path, label in all_image_paths if label in small_classes]

# Perform stratified split only on classes with enough samples
if stratified_images:
    train_strat, temp_strat = train_test_split(
        stratified_images, 
        test_size=0.3, 
        stratify=[label for _, label in stratified_images],
        random_state=42
    )
    val_strat, test_strat = train_test_split(
        temp_strat, 
        test_size=0.5, 
        stratify=[label for _, label in temp_strat],
        random_state=42
    )
else:
    train_strat, val_strat, test_strat = [], [], []

# Add small classes to training set
train_data = train_strat + small_class_images
val_data = val_strat
test_data = test_strat

print(f"Training set: {len(train_data)} images")
print(f"Validation set: {len(val_data)} images")
print(f"Test set: {len(test_data)} images")

# Save splits to CSV
def save_split(split_data, filename):
    split_df = pd.DataFrame(split_data, columns=['image_path', 'label'])
    split_df.to_csv(os.path.join(base_dir, filename), index=False)

save_split(train_data, 'train.csv')
save_split(val_data, 'validation.csv')
save_split(test_data, 'test.csv')

# Create a summary file with class distribution
with open(os.path.join(base_dir, 'dataset_summary.txt'), 'w') as f:
    f.write(f"Total number of disease classes: {len(disease_classes)}\n")
    f.write(f"Total number of images: {len(all_image_paths)}\n\n")
    f.write("Class distribution:\n")
    for class_name, count in class_distribution.items():
        f.write(f"{class_name}: {count} images\n")
    
    f.write(f"\nTraining set: {len(train_data)} images\n")
    f.write(f"Validation set: {len(val_data)} images\n")
    f.write(f"Test set: {len(test_data)} images\n")
    
    f.write("\nNote: Classes with fewer than 3 samples were added to the training set only.\n")

print("Dataset preparation complete!")