from pydantic import BaseModel

class DepartmentBase(BaseModel):
    name: str
    description: str | None = None

class DepartmentCreate(DepartmentBase):
    pass

class Department(DepartmentBase):
    id: int

    class Config:
        orm_mode = True 