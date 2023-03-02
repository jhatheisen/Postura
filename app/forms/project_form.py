from flask_wtf import FlaskForm
from wtforms.fields import (
StringField
)
from wtforms.validators import DataRequired, ValidationError

def name_validator(form, field):
    if len(field.data) < 3 or len(field.data) > 25 :
        raise ValidationError("Project name must be between 3 and 25 characters")

def description_validator(form, field):
    if field.data is not None and (len(field.data) < 3 or len(field.data) > 250) :
        raise ValidationError("Project description must be between 3 and 250 characters")



class CreateProjectForm(FlaskForm):
    name = StringField('name', validators=[DataRequired(), name_validator])
    description = StringField('description', validators=[description_validator])
    due_date = StringField('due_date')

class EditProjectForm(FlaskForm):
    name = StringField('name', validators=[DataRequired(), name_validator])
    description = StringField('description', validators=[description_validator])
    due_date = StringField('due_date')
