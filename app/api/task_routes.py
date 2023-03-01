from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Task, db, User, Project
from ..forms.task_form import EditTaskForm
from .auth_routes import validation_errors_to_error_messages
from .project_routes import idInDictArr

from datetime import datetime

task_routes = Blueprint('tasks', __name__)

@task_routes.route('/current')
@login_required
def curr_user_tasks():
    user_tasks = Task.query.all()
    trimmedTasks = []
    for task in user_tasks:
        task = task.to_dict()
        for user in task['users']:
           if user['id'] == current_user.id:
              trimmedTasks.append({
                  "id": task["id"],
                  "project_id": task["project_id"],
                  "name": task["name"],
                  "description": task['description'],
                  "due_date": task["due_date"],
                  "creation_date": task["creation_date"]
              })
    return {"Tasks": trimmedTasks}

@task_routes.route('/<int:taskId>/users/<int:userId>', methods=["POST"])
@login_required
def add_user(taskId, userId):

    task = Task.query.get(taskId)

    # task not exist
    if task is None:
        return {
        "message": "Task couldn't be found",
        "statusCode": 404
      }, 404

    user = User.query.get(userId)

    # user not exist
    if user is None:
      return {
          "message": "User couldn't be found",
          "statusCode": 404
      }, 404

    project = Project.query.get(task.to_dict()["project_id"])
    projectUsers = project.to_dict()["users"]

    # you not part of project
    if not idInDictArr(projectUsers, current_user.id):
      return {'errors': ['Unauthorized']}, 401

    # user not part of project
    if not idInDictArr(projectUsers, userId):
      return {
        "message": "Validation Error",
        "statusCode": 400,
        "errors": ['User is not added to project']
      }, 400

    taskUsers = task.to_dict()["users"]

    # User already assigned to task
    if idInDictArr(taskUsers, userId):
       return {
          "message": "Validation Error",
          "statusCode": 400,
          "errors": [
            "user: User is already assigned to task",
          ]
        }, 400

    task.users.append(user)
    db.session.commit()

    return {
       "user_id": userId,
       "task_id": taskId,
       "username": user.to_dict()["username"]
    }, 201

@task_routes.route('/<int:taskId>/users/<int:userId>', methods=["DELETE"])
@login_required
def remove_user(taskId, userId):
    task = Task.query.get(taskId)

    # task not exist
    if task is None:
        return {
        "message": "Task couldn't be found",
        "statusCode": 404
      }, 404

    user = User.query.get(userId)

    # user not exist
    if user is None:
      return {
          "message": "User couldn't be found",
          "statusCode": 404
      }, 404

    project = Project.query.get(task.to_dict()["project_id"])
    projectUsers = project.to_dict()["users"]

    # you not part of project
    if not idInDictArr(projectUsers, current_user.id):
      return {'errors': ['Unauthorized']}, 401

    # user not part of project
    if not idInDictArr(projectUsers, userId):
      return {
        "message": "Validation Error",
        "statusCode": 400,
        "errors": ['User is not added to project']
      }, 400

    taskUsers = task.to_dict()["users"]

    # User already not assigned to task
    if not idInDictArr(taskUsers, userId):
       return {
          "message": "Validation Error",
          "statusCode": 400,
          "errors": {
            "user": "User is not assigned to task",
          }
        }, 400

    task.users.remove(user)
    db.session.commit()

    return {
      "message": "User successfully removed",
      "statusCode": 200
    }, 200

@task_routes.route('/<int:taskId>', methods=["PUT"])
@login_required
def edit_task(taskId):
   editing_task = Task.query.get(taskId)

   if editing_task is None:
      return {
        "message": "Task couldn't be found",
        "statusCode": 404
      }, 404

   project = Project.query.get(editing_task.to_dict()["project_id"])
   projectUsers = project.to_dict()["users"]

   # you not part of project
   if not idInDictArr(projectUsers, current_user.id):
      return {'errors': ['Unauthorized']}, 401

   form = EditTaskForm()
   form['csrf_token'].data = request.cookies['csrf_token']

   if form.validate_on_submit():
      data = form.data

      date_object = None

      if data["due_date"]:
        try:
          date_object = datetime.strptime(data["due_date"], '%Y-%m-%d').date()
        except:
          return {
              "message": "Validation Error",
              "statusCode": 400,
              "errors": ["Invalid date format, must be formatted '2020-12-31'"]
            }, 400

      createDate = editing_task.creation_date.date()

      try:
        if date_object < createDate:
          return {
                "message": "Validation Error",
                "statusCode": 400,
                "errors": ["creation_date: Due date cannot come before today's Date"]
              }, 400
      except:
         return {
                "message": "Validation Error",
                "statusCode": 400,
                "errors": ["Due Date must exist"]
              }, 400

      editing_task.name = data["name"]
      editing_task.description = data["description"]
      editing_task.due_date = date_object

      db.session.commit()

      print("--------------------------",editing_task.to_dict())

      return {
         "id": taskId,
         "project_id": editing_task.project_id,
         "users": editing_task.to_dict()["users"],
         "name": data["name"],
         "description": data["description"],
         "due_date": date_object,
         "creation_date": createDate
      }
   return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@task_routes.route('/<int:taskId>', methods=["DELETE"])
@login_required
def del_task(taskId):
  del_task = Task.query.get(taskId)

  if del_task is None:
    return {
      "message": "Task couldn't be found",
      "statusCode": 404
    }, 404

  project = Project.query.get(del_task.to_dict()["project_id"])
  projectUsers = project.to_dict()["users"]

  # you not part of project
  if not idInDictArr(projectUsers, current_user.id):
    return {'errors': ['Unauthorized']}, 401

  db.session.delete(del_task)
  db.session.commit()

  return {"message": "Successfully deleted"}
