# Serverless Training Module Generator

A serverless web application for creating and managing video-based training modules, with a React frontend, local MinIO (S3) and DynamoDB Local backend, and Streamlit analytics dashboard.

## Quick Start
1. Start MinIO and DynamoDB Local (see "Set Up MinIO" and "Set Up DynamoDB Local" below).
2. Create the `training-module-videos` bucket in MinIO and the `TrainingModules` table in DynamoDB Local.
3. Install dependencies:
   ```bash
   npm install --prefix frontend
   npm install --prefix backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt

# Start the mock API, frontend, and Streamlit dashboard:
   npm run start:mock --prefix backend
   npm run dev --prefix frontend
   export DASHBOARD_PASSWORD='your_secure_password'
   streamlit run streamlit/app.py


