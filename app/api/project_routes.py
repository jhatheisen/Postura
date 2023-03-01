from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Project, db, User, Task
from ..forms.project_form import CreateProjectForm, EditProjectForm
from ..forms.task_form import CreateTaskForm
from .auth_routes import validation_errors_to_error_messages

from datetime import datetime

project_routes = Blueprint('projects', __name__)

def idInDictArr(arr, id):
    arr = list(filter(lambda dict: dict["id"] == id, arr))
    if len(arr) == 0:
        return False
    return True

@project_routes.route('/current')
@login_required
def curr_user_projects():
    user_projects = Project.query.all()
    trimmedProjects = []
    for project in user_projects:
        project = project.to_dict()
        for user in project['users']:
           if user['id'] == current_user.id:
              trimmedProjects.append({
                  "id": project["id"],
                  "owner_id": project["owner_id"],
                  "name": project["name"],
                  "description": project['description'],
                  "due_date": project["due_date"]
              })
    return {"Projects": trimmedProjects}

@project_routes.route('/', methods=["POST"])
@login_required
def create_project():
   form = CreateProjectForm()
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
              "errors": ["due_date: Invalid date format, must be formatted '2020-12-31'"]
            }, 400

      today = datetime.now().date()
      if date_object:
        if date_object < today:
            return {
                  "message": "Validation Error",
                  "statusCode": 400,
                  "errors": ["creation_date: Due date cannot come before today's Date"]
                }, 400

      newProject = Project(
         name = data["name"],
         owner_id = current_user.id,
         description = data["description"],
         due_date = date_object
      )

      user = User.query.get(current_user.id)

      newProject.users.append(user)

      db.session.add(newProject)
      db.session.commit()

      allProjects = Project.query.all()

      return {
         "id": allProjects[len(allProjects)-1].id,
         "owner_id": current_user.id,
         "name": data["name"],
         "description": data["description"],
         "due_date": date_object
      }
   return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@project_routes.route('/<int:projectId>')
@login_required
def single_project(projectId):
    #find project
    project = Project.query.get(projectId)

    print('project: ', project)
    print(project is None)

    # if can't find return
    if project is None:
      return {
            "message": "Project couldn't be found",
            "statusCode": 404
        }, 404
    print('passing')

    # if in project
    project = project.to_dict()

    # return project
    if idInDictArr(project["users"], current_user.id):
      project.pop("owner_id")
      return project

    # else don't return

    return {
            "message": "Project not owned",
            "statusCode": 403
        }, 403

@project_routes.route('/<int:projectId>', methods=["PUT"])
@login_required
def edit_project(projectId):

   edit_project = Project.query.get(projectId)

   if edit_project is None:
      return {
        "message": "Project couldn't be found",
        "statusCode": 404
      }, 404

   if edit_project.owner_id != current_user.id:
        return {'errors': ['Unauthorized']}, 401

   form = EditProjectForm()
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
              "errors": ["due_date: Invalid date format, must be formatted '2020-12-31'"]
            }, 400

      today = datetime.now().date()
      if date_object:
        if date_object < today:
            return {
                  "message": "Validation Error",
                  "statusCode": 400,
                  "errors": ["creation_date: Due date cannot come before today's Date"]
                }, 400

      edit_project.name = data["name"]
      edit_project.description = data["description"]
      edit_project.due_date = date_object

      db.session.commit()

      return {
         "id": projectId,
         "owner_id": current_user.id,
         "name": data["name"],
         "description": data["description"],
         "due_date": date_object
      }
   return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@project_routes.route('/<int:projectId>', methods=["DELETE"])
@login_required
def delete_project(projectId):

   delete_project = Project.query.get(projectId)

   if delete_project is None:
      return {
        "message": "Project couldn't be found",
        "statusCode": 404
      }, 404

   if delete_project.owner_id != current_user.id:
        return {'errors': ['Unauthorized']}, 401

   db.session.delete(delete_project)
   db.session.commit()

   return {"message": "Successfully deleted"}

@project_routes.route('/<int:projectId>/tasks')
@login_required
def get_project_tasks(projectId):

   project = Project.query.get(projectId)
   users = project.to_dict()["users"]

   if not idInDictArr(users, current_user.id):
    return {'errors': ['Unauthorized']}, 401

   project_tasks = Task.query.filter_by(project_id=projectId)
   return {"Tasks": [task.to_dict() for task in project_tasks]}

@project_routes.route('/<int:projectId>/tasks', methods=["POST"])
@login_required
def create_project_task(projectId):
   form = CreateTaskForm()
   form['csrf_token'].data = request.cookies['csrf_token']

   if form.validate_on_submit():
      data = form.data

      date_object = None

      createDate = datetime.now().date()

      if data["due_date"]:
        try:
          date_object = datetime.strptime(data["due_date"], '%Y-%m-%d').date()
        except:
          return {
              "message": "Validation Error",
              "statusCode": 400,
              "errors": ["due_date: Invalid date format, must be formatted '2020-12-31'"]
            }, 400

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
                "errors": ["due_date: Due Date must exist"]
              }, 400

      newTask = Task(
         name = data["name"],
         project_id = projectId,
         description = data["description"],
         due_date = date_object,
         creation_date = createDate
      )

      user = User.query.get(current_user.id)

      newTask.users.append(user)

      db.session.add(newTask)
      db.session.commit()

      allTasks = Task.query.all()

      return {
         "id": allTasks[len(allTasks)-1].id,
         "project_id": projectId,
         "name": data["name"],
         "description": data["description"],
         "users": newTask.to_dict()["users"],
         "due_date": date_object,
         "creation_date": createDate
      }
   return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@project_routes.route('/<int:projectId>/users/<int:userId>', methods=["POST"])
@login_required
def add_user(projectId, userId):

   project = Project.query.get(projectId)

   if project is None:
      return {
        "message": "Project couldn't be found",
        "statusCode": 404
      }, 404

   if project.owner_id != current_user.id:
        return {'errors': ['Unauthorized']}, 401

   users = project.to_dict()["users"]

   if idInDictArr(users, userId):
    return {
      "message": "Validation Error",
      "statusCode": 400,
      "errors": ['"user": "User is already assigned to project"']
    }, 400

   user = User.query.get(userId)

   if user is None:
      return {
          "message": "User couldn't be found",
          "statusCode": 404
      }, 404

   project.users.append(user)
   db.session.commit()

   return {
        "user_id": userId,
        "project_id": projectId,
        "username": user.to_dict()['username'],
        "email" : user.to_dict()['email']
    }, 200

@project_routes.route('/<int:projectId>/users/<int:userId>', methods=["DELETE"])
@login_required
def remove_user(projectId, userId):

   project = Project.query.get(projectId)

   if project is None:
      return {
        "message": "Project couldn't be found",
        "statusCode": 404
      }, 404

   if project.owner_id != current_user.id:
        return {'errors': ['Unauthorized']}, 401

   user = User.query.get(userId)

   if user is None:
      return {
          "message": "User couldn't be found",
          "statusCode": 404
      }, 404

   users = project.to_dict()["users"]

   if not idInDictArr(users, userId):
    return {
      "message": "Validation Error",
      "statusCode": 400,
      "errors": ['"user": "User is not added to project"']
    }, 400

   project.users.remove(user)
   db.session.commit()

   return {
      "message": "User successfully removed",
      "statusCode": 200
    }, 200
