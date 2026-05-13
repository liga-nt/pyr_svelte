import csv
import json
import time
import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/indexing"]
DAILY_LIMIT = 195
STATE_FILE = "indexing_state.json"
TASKS_FILE = "indexing_tasks.csv"
CLIENT_SECRETS = "client_secret_6444820287-a0p40ehknee3bdg2m43b3b0hhi8tue82.apps.googleusercontent.com.json"
TOKEN_FILE = "token.json"

# Load or refresh credentials
creds = None
if os.path.exists(TOKEN_FILE):
    creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS, SCOPES)
        creds = flow.run_local_server(port=0)
    with open(TOKEN_FILE, "w") as f:
        f.write(creds.to_json())

service = build("indexing", "v3", credentials=creds)

with open(TASKS_FILE) as f:
    tasks = [(row["url"], row["notification_type"]) for row in csv.DictReader(f)]

try:
    with open(STATE_FILE) as f:
        state = json.load(f)
except FileNotFoundError:
    state = {"completed": 0}

start = state["completed"]
submitted = 0

if start >= len(tasks):
    print("All tasks already completed.")
else:
    for i, (url, notification_type) in enumerate(tasks[start:], start=start):
        if submitted >= DAILY_LIMIT:
            print(f"Daily limit reached. {len(tasks) - i} tasks remaining.")
            break
        try:
            service.urlNotifications().publish(
                body={"url": url, "type": notification_type}
            ).execute()
            print(f"[{i+1}/{len(tasks)}] {notification_type}: {url}")
            state["completed"] = i + 1
            submitted += 1
            time.sleep(0.3)
        except HttpError as e:
            print(f"Error on {url}: {e}")
            break

    if state["completed"] >= len(tasks):
        print("All tasks complete.")

with open(STATE_FILE, "w") as f:
    json.dump(state, f)
