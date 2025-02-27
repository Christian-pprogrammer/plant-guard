import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Dropout, Flatten, Dense
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

os.chdir('../dataset/plantGuard_dataset')

IMG_HEIGHT, IMG_WIDTH = 224, 224
BATCH_SIZE = 32
EPOCHS = 20

# Create data generators with augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    validation_split=0.2
)

# Flow from disease directories
train_disease_generator = train_datagen.flow_from_directory(
    'images',
    target_size=(IMG_HEIGHT, IMG_WIDTH),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training'
)

validation_disease_generator = train_datagen.flow_from_directory(
    'images',
    target_size=(IMG_HEIGHT, IMG_WIDTH),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation'
)

# Get the number of classes (disease types)
num_disease_classes = len(train_disease_generator.class_indices)
print(f"Disease classes: {train_disease_generator.class_indices}")

# Build the disease classification model
disease_model = Sequential([
    # Convolutional layers
    Conv2D(32, (3, 3), activation='relu', input_shape=(IMG_HEIGHT, IMG_WIDTH, 3)),
    MaxPooling2D(2, 2),

    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),

    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),

    # Flatten and dense layers
    Flatten(),
    Dense(512, activation='relu'),
    Dropout(0.5),
    Dense(num_disease_classes, activation='softmax')  # Output layer - one node per disease
])

# Compile the model
disease_model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Train the model
disease_history = disease_model.fit(
    train_disease_generator,
    steps_per_epoch=train_disease_generator.samples // BATCH_SIZE,
    epochs=EPOCHS,
    validation_data=validation_disease_generator,
    validation_steps=validation_disease_generator.samples // BATCH_SIZE
)

# Save the model
disease_model.save('disease_classifier_model.h5')

# Get the disease class names for later use
disease_class_names = {v: k for k, v in train_disease_generator.class_indices.items()}
print(disease_class_names)

