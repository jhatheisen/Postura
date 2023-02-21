from app.models import db, Project, environment, SCHEMA
from .users import demo, marnie, bobbie, donnie, lena

import datetime


# Adds a demo projects, you can add other projects here if you want
def seed_projects():

    project1 = Project(
        name='Website',
        description='project for a website',
        owner_id=1,
        due_date=datetime.datetime(2024, 2, 28),
        users=[demo, marnie, bobbie])
    project2 = Project(
        name='Door Build',
        description='project for a Door Build',
        owner_id=2,
        due_date=datetime.datetime(2024, 4, 13),
        users=[demo, donnie, lena])
    project3 = Project(
        name='Tv Show',
        description='project for a Tv Show',
        owner_id=3,
        due_date=datetime.datetime(2024, 5, 21),
        users=[demo, marnie, donnie])

    db.session.add(project1)
    db.session.add(project2)
    db.session.add(project3)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the projects table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_projects():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users_projects RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.projects RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM users_projects")
        db.session.execute("DELETE FROM projects")

    db.session.commit()
