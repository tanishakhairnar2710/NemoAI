from fastapi.testclient import TestClient
from app.main import app
import uuid

client = TestClient(app)
print('health', client.get('/health').status_code, client.get('/health').json())

payload = {
    'email': f'smoketest+{uuid.uuid4().hex}@example.com',
    'full_name': 'Smoke Tester',
    'password': 'Password123!',
    'study_goal': 'Test backend',
}
r = client.post('/signup', json=payload)
print('signup', r.status_code, r.json())
if r.status_code != 200:
    raise SystemExit('signup failed')

token = r.json()['access_token']
headers = {'Authorization': f'Bearer {token}'}
text = 'Test document content for flashcards and quizzes. This most likely contains terms and examples.'
files = {'file': ('test.txt', text, 'text/plain')}
r = client.post('/upload', headers=headers, files=files)
print('upload', r.status_code, r.json())
docs = client.get('/documents', headers=headers).json()
print('documents count', len(docs))
doc_id = docs[0]['id'] if docs else None
print('doc_id', doc_id)
if doc_id:
    summary = client.get(f'/documents/{doc_id}/summary', headers=headers)
    print('summary', summary.status_code, summary.json())
    print('flashcards', client.get(f'/flashcards/{doc_id}', headers=headers).status_code)
    print('quiz', client.get(f'/quiz/{doc_id}', headers=headers).status_code)
    print('mnemonics', client.get(f'/mnemonics/{doc_id}', headers=headers).status_code)
    print('analytics', client.get('/analytics', headers=headers).status_code)
