from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Task, db, User
from ..forms.project_form import CreateProjectForm, EditProjectForm
from .auth_routes import validation_errors_to_error_messages

task_routes = Blueprint('tasks', __name__)

@task_routes.route('/current')
@login_required
def curr_user_tasks():
    return 
