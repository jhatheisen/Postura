from .db import db, environment, SCHEMA, add_prefix_for_prod

from datetime import datetime

today = datetime.now()

class Task(db.Model):
    __tablename__ = 'tasks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(25), nullable=False)
    description = db.Column(db.String(250))
    due_date = db.Column(db.DateTime, nullable=False)
    creation_date = db.Column(db.DateTime, nullable=False, default=today)

    # relationship with project

    project_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("projects.id")), nullable=False)

    project = db.relationship("Project", back_populates="tasks")

    # many to many relationship with users and tasks

    users = db.relationship(
        "User",
        secondary="users_tasks",
        back_populates="tasks"
    )

# join table

users_tasks = db.Table(
    "users_tasks",
    db.Column(
        "user_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("users.id")),
        primary_key=True
    ),
    db.Column(
        "task_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("tasks.id")),
        primary_key=True
    )
)

if environment == "production":
    users_tasks.schema = SCHEMA
