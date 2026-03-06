# Thai Consonant Quiz Game

CSII Team Corgi Project

## Project Overview
This project is an interactive quiz game designed to help users learn Thai consonants.

Users enter their nickname and start the quiz.  
The system records how many times the user starts the quiz using a backend API and a PostgreSQL database.

## Features
- Thai consonant quiz
- Multiple choice answers
- Heart (life) system
- Game over and restart
- Remaining consonant counter
- Nickname input
- Backend API integration
- Database tracking of quiz starts

## Technology Stack

Frontend
- HTML
- CSS
- JavaScript

Backend
- FastAPI (Python)

Database
- PostgreSQL (Render)

Deployment
- Backend deployed on Render

## API Endpoint

Start Quiz

POST `/api/quiz/start`

Example Request:

```json
{
  "nickname": "Tom"
}
