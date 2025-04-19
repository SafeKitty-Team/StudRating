from pydantic import BaseModel
from enum import Enum


class ProgramLevel(str, Enum):
    specialist = "specialist"
    bachelor = "sachelor"
    master = "saster"
    phd = "phd"


class ProgramBase(BaseModel):
    name: str
    degree_level: ProgramLevel
    faculty_id: int

    class Config:
        from_attributes = True


class ProgramCreate(ProgramBase):
    pass


class ProgramRead(ProgramBase):
    id: int


class ProgramUpdate(ProgramBase):
    pass
