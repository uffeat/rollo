from anvil import app

env = app.environment.name
DEV = app.environment.name == "development"
PROD = app.environment.name == "production"