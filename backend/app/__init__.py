# app/routes/__init__.py
from flask import Blueprint

# Create a Blueprint instance
position = Blueprint('position', __name__)

from . import positions
