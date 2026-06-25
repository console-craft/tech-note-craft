---
category: FastAPI
order: 19
quiz:
  - type: choice
    question: Which packages are installed to use JWT tokens in the card?
    options: [pyjwt, "pwdlib[argon2]", requests, sqlalchemy]
    answers: [pyjwt, "pwdlib[argon2]"]

  - type: choice
    question: Which authentication scheme object reads bearer tokens from requests?
    options: [OAuth2PasswordBearer, OAuth2PasswordRequestForm, PasswordHash, HTTPException]
    answers: [OAuth2PasswordBearer]

  - type: choice
    question: What token URL is configured for `oauth2_scheme`?
    options: [token, login, users/me, items]
    answers: [token]

  - type: choice
    question: Which algorithm is used to encode and decode the JWT?
    options: [HS256, RS256, ES256, none]
    answers: [HS256]

  - type: choice
    question: Which JWT claim stores the username in this example?
    options: [sub, exp, iss, aud]
    answers: [sub]

  - type: choice
    question: Which model represents the response from the token endpoint?
    options: [Token, TokenData, User, Item]
    answers: [Token]

  - type: choice
    question: Why does `authenticate_user` verify a dummy hash when a user is missing?
    options: [mitigate timing attacks, create a new user, refresh the token, validate email]
    answers: [mitigate timing attacks]

  - type: choice
    question: Which endpoint returns items owned by the current active user?
    options: [/items, /token, /users/me, "/send-notification/{email}"]
    answers: [/items]

  - type: fill
    question: Complete the OAuth2 bearer scheme setup.
    text: "oauth2_scheme = OAuth2PasswordBearer(tokenUrl=\"token\")"
    blanks: [oauth2_scheme, OAuth2PasswordBearer, tokenUrl, token]

  - type: fill
    question: Complete the JWT encode call.
    text: "encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)"
    blanks: [jwt.encode, to_encode, SECRET_KEY, ALGORITHM]
---

# Authentication

- To use JWT tokens, install the dependencies using `pip install pyjwt pwdlib[argon2]` or `uv add pyjwt pwdlib[argon2]`
- See a detailed example of how to implement OAuth2 with JWT tokens in FastAPI bellow.

<details>

```python
from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pydantic import BaseModel

# to get a string like this run `openssl rand -hex 32`
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$wagCPXjifgvUFBzq4hqe3w$CYaIb8sB+wtD+Vu/P4uod1+Qof8h+1g7bbDlBID48Rc",
        "disabled": False,
    }
}

fake_items_db = [
    {
        "id": "item-1",
        "title": "Foo",
        "owner": "johndoe",
    },
    {
        "id": "item-2",
        "title": "Bar",
        "owner": "johndoe",
    },
]

class Item(BaseModel):
    id: str
    title: str
    owner: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None

class UserInDB(User):
    hashed_password: str

password_hash = PasswordHash.recommended()

DUMMY_HASH = password_hash.hash("dummypassword")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

def get_password_hash(password):
    return password_hash.hash(password)

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)

def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        verify_password(password, DUMMY_HASH) # to mitigate timing attacks, we verify the password even if the user doesn't exist, using a dummy hash
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub") # the "sub" (subject) claim is a standard claim in JWT tokens that is used to identify the principal that is the subject of the token, in this case, the username of the user
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@app.post("/token")
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

@app.get("/users/me")
def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> User:
    return current_user

@app.get("/items", response_model=list[Item])
def read_items(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return [item for item in fake_items_db if item["owner"] == current_user.username]
```

</details>
