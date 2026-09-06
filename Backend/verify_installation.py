# verify_installation.py
try:
    from fastcoref import spacy_component
    print("fastcoref is installed correctly.")
except ImportError as e:
    print(f"Error: {e}")
# import spacy

# try:
#     nlp = spacy.load("en_core_web_sm")
#     print("Model loaded successfully!")
# except Exception as e:
#     print(f"An error occurred: {e}")