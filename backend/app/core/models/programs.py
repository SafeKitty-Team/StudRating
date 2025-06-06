import enum
from sqlalchemy import String, Integer, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
from .faculties import Faculty
from .mixins.id_mixin import IDMixin


class DegreeLevel(enum.Enum):
    specialist = "specialist"
    bachelor = "bachelor"
    master = "master"
    phd = "phd"


class Program(IDMixin, Base):
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    degree_level: Mapped[DegreeLevel] = mapped_column(
        Enum(DegreeLevel, name="program_level", native_enum=False),
        default=DegreeLevel.bachelor,
        nullable=False,
    )
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty.id"), nullable=False)

    # Fix the relationship - change "program" to "programs" to match Faculty model
    faculty: Mapped[Faculty] = relationship("Faculty", back_populates="programs")

    # Add relationship to Subject model
    subjects: Mapped[list["Subject"]] = relationship("Subject", back_populates="program")

    def __repr__(self):
        return (
            f"<Program(id={self.id}, name={self.name}, degree_level={self.degree_level},"
            f" faculty_id={self.faculty_id}, faculty={self.faculty})>"
        )