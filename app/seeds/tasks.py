from app.models import db, Task, environment, SCHEMA
from .users import demo, marnie, bobbie, donnie, lena

import datetime

# Adds a demo tasks, you can add other tasks here if you want
def seed_tasks():
    task1 = Task(
        name='Build models',
        description='build models for a website',
        project_id=1 ,
        due_date=datetime.datetime(2024, 2, 24),
        creation_date=datetime.datetime(2024, 2, 22),
        users=[demo])
    task2 = Task(
        name='Write Docs',
        description='Write Docs for a website',
        project_id=1 ,
        due_date=datetime.datetime(2024, 2, 20),
        creation_date=datetime.datetime(2024, 2, 12),
        users=[marnie])
    task3 = Task(
        name='draw wireframe',
        description='draw wireframe for a website',
        project_id=1 ,
        due_date=datetime.datetime(2024, 1, 28),
        creation_date=datetime.datetime(2024, 2, 27),
        users=[bobbie, demo])
    task4 = Task(
        name='draw blueprint',
        description='draw blueprint for a door',
        project_id=2 ,
        due_date=datetime.datetime(2024, 4, 5),
        creation_date=datetime.datetime(2024, 3, 8),
        users=[demo, lena])
    task5 = Task(
        name='construct door',
        description='draw blueprint for a door',
        project_id=2 ,
        due_date=datetime.datetime(2024, 4, 13),
        creation_date=datetime.datetime(2024, 4, 1),
        users=[donnie])
    task6 = Task(
        name='create box',
        description='create box for a door',
        project_id=2 ,
        due_date=datetime.datetime(2024, 4, 13),
        creation_date=datetime.datetime(2024, 4, 5),
        users=[demo, lena])
    task7 = Task(
        name='create title',
        description='create title for a tv show',
        project_id=3,
        due_date=datetime.datetime(2024, 5, 21),
        creation_date=datetime.datetime(2024, 5, 15),
        users=[demo, marnie, donnie])
    task8 = Task(
        name='write script',
        description='write script for a tv show',
        project_id=3,
        due_date=datetime.datetime(2024, 4, 28),
        creation_date=datetime.datetime(2024, 5, 21),
        users=[demo, donnie])
    task9 = Task(
        name='film show',
        description='film show for a tv show',
        project_id=3,
        due_date=datetime.datetime(2024, 5, 21),
        creation_date=datetime.datetime(2024, 5, 4),
        users=[demo, marnie])

    db.session.add(task1)
    db.session.add(task2)
    db.session.add(task3)
    db.session.add(task4)
    db.session.add(task5)
    db.session.add(task6)
    db.session.add(task7)
    db.session.add(task8)
    db.session.add(task9)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the tasks table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_tasks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users_tasks RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.tasks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM users_tasks")
        db.session.execute("DELETE FROM tasks")

    db.session.commit()
