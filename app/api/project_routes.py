from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Project, db, User
from ..forms.project_form import CreateProjectForm, EditProjectForm
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
   print('reached')
   form = CreateProjectForm()
   form['csrf_token'].data = request.cookies['csrf_token']

   if form.validate_on_submit():
      data = form.data

      date_object = None

      if data["due_date"]:
        try:
          date_object = datetime.strptime(data["due_date"], '%m-%d-%Y').date()
        except:
          return {
              "message": "Validation Error",
              "statusCode": 400,
              "errors": {
                "due_date": "Invalid date format, must be formatted '12-31-2020'"
              }
            }, 400

      newProject = Project(
         name = data["name"],
         owner_id = current_user.id,
         description = data["description"],
         due_date = date_object
      )

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

    # if can't find return
    if project is None:
      return {
            "message": "Project couldn't be found",
            "statusCode": 404
        }, 404

    # if in project
    project = project.to_dict()

    # return project
    if idInDictArr(project["users"], current_user.id):
      project.pop("owner_id")
      return project

    # else don't return

    return {
            "message": "Project couldn't be found",
            "statusCode": 404
        }, 404

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

      try:
         date_object = datetime.strptime(data["due_date"], '%m-%d-%Y').date()
      except:
         return {
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
              "due_date": "Invalid date format, must be formatted '12-31-2020'"
            }
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
      "errors": {
        "user": "User is already assigned to project",
      }
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
        "username": user.to_dict()['username']
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
      "errors": {
        "user": "User is not added to project",
      }
    }, 400

   project.users.remove(user)
   db.session.commit()

   return {
      "message": "User successfully removed",
      "statusCode": 200
    }, 200
