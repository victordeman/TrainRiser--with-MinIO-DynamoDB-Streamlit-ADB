import streamlit as st
import boto3
import pandas as pd
import botocore.exceptions
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

st.title("Training Module Analytics Dashboard")

# DynamoDB Local client
try:
    dynamodb = boto3.client(
        'dynamodb',
        endpoint_url='http://localhost:8000',
        region_name='us-east-1',
        aws_access_key_id='fake',
        aws_secret_access_key='fake'
    )
except botocore.exceptions.NoCredentialsError:
    st.error("Failed to connect to DynamoDB Local. Ensure it is running on http://localhost:8000.")
    st.stop()

# Password protection
password = st.text_input("Enter password", type="password")
if password != os.getenv('DASHBOARD_PASSWORD', 'default_secure_password'):
    st.error("Incorrect password")
    st.stop()

# Fetch modules from DynamoDB
try:
    response = dynamodb.scan(TableName='TrainingModules')
    modules = response['Items']
except botocore.exceptions.ClientError as e:
    st.error(f"Failed to fetch data from DynamoDB: {e.response['Error']['Message']}")
    st.stop()

# Display analytics
if modules:
    data = [
        {
            'Module ID': item['moduleId']['S'],
            'Title': item['title']['S'],
            'Views': int(item['views']['N']),
            'Completions': int(item['completions']['N'])
        }
        for item in modules
    ]
    df = pd.DataFrame(data)
    st.dataframe(df)
    st.bar_chart(df.set_index('Module ID')[['Views', 'Completions']])
else:
    st.write("No modules found.")
