from fastapi import FastAPI
from pydantic import BaseModel
import os
import psycopg2

app = FastAPI()

DATABASE_URL = os.getenv("DATABASE_URL")

def get_conn():
    return psycopg2.connect(DATABASE_URL)

class StartRequest(BaseModel):
    nickname: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/quiz/start")
def start_quiz(data: StartRequest):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        nickname TEXT PRIMARY KEY,
        starts INTEGER
    )
    """)

    cur.execute("SELECT starts FROM users WHERE nickname=%s", (data.nickname,))
    row = cur.fetchone()

    if row:
        starts = row[0] + 1
        cur.execute("UPDATE users SET starts=%s WHERE nickname=%s", (starts, data.nickname))
    else:
        starts = 1
        cur.execute("INSERT INTO users (nickname, starts) VALUES (%s, %s)", (data.nickname, starts))

    conn.commit()
    cur.close()
    conn.close()

    return {"nickname": data.nickname, "starts": starts}

@app.get("/api/user/{nickname}")
def get_user(nickname: str):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT starts FROM users WHERE nickname=%s", (nickname,))
    row = cur.fetchone()

    cur.close()
    conn.close()

    if row:
        return {"nickname": nickname, "starts": row[0]}
    return {"nickname": nickname, "starts": 0}