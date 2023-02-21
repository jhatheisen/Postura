from .db import db, environment, SCHEMA, add_prefix_for_prod

class Project(db.Model):
    __tablename__ = 'projects'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(25), nullable=False)
    description = db.Column(db.String(250))
    due_date = db.Column(db.DateTime)

    # relationship with user

    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    owner = db.relationship("User", back_populates="projects")

    # relationship with tasks

    tasks = db.relationship("Task", back_populates="project")

    # many to many between users and projects

    users = db.relationship(
        "User",
        secondary="users_projects",
        back_populates="projects"
    )

    def to_dict(self):

        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'due_date': self.due_date,
            'owner_id': self.owner_id,
            'owner': self.owner.to_dict(),
            'users': [user.to_dict() for user in self.users]
        }

# join table

users_projects = db.Table(
    "users_projects",
    db.Column(
        "user_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("users.id")),
        primary_key=True
    ),
    db.Column(
        "project_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("projects.id")),
        primary_key=True
    )
)

if environment == "production":
    users_projects.schema = SCHEMA
