"""Independently decode screenshots of the running app's QR, never a re-created
source matrix. Development QA needs opencv-python; not an app dependency.
Usage: python3 tests/verify-app-share-qr.py /path/to/browser-artifacts
"""
from pathlib import Path
import json
import sys
import cv2

TARGET = 'https://play.google.com/store/apps/details?id=com.qashi.islamic'
files = sorted(Path(sys.argv[1]).glob('qr-*.png'))
assert files, 'No actual rendered QR screenshots supplied'
detector = cv2.QRCodeDetector()
results = []
for file in files:
    image = cv2.imread(str(file))
    assert image is not None, str(file)
    decoded, corners, _ = detector.detectAndDecode(image)
    assert decoded == TARGET and corners is not None, (str(file), decoded)
    results.append({'file': file.name, 'width': image.shape[1], 'height': image.shape[0], 'decoded': decoded})
print(json.dumps({'decoder': f'OpenCV {cv2.__version__} QRCodeDetector', 'count': len(results), 'results': results}, indent=2))
