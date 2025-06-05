from pydantic import BaseModel

class RoleBase(BaseModel):
    name: str
    description: str | None = None

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: int
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    full_name: str | None = None
    email: str

class UserCreate(UserBase):
    password: str
    role_id: int

class User(UserBase):
    id: int
    role: Role | None = None
    class Config:
        orm_mode = True 