# models.py

from django.db import models


class Group(models.Model):
    group_id = models.AutoField(primary_key=True)
    group_name = models.CharField(max_length=20, unique=True)
    course = models.IntegerField()

    def __str__(self):
        return self.group_name


class Classroom(models.Model):
    classroom_id = models.AutoField(primary_key=True)
    classroom_number = models.CharField(max_length=10, unique=True)
    building = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.building}-{self.classroom_number}"


class Teacher(models.Model):
    teacher_id = models.AutoField(primary_key=True)
    last_name = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50)
    patronymic = models.CharField(max_length=50, blank=True, null=True)
    classroom = models.ForeignKey(
        Classroom,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='teachers'
    )

    def __str__(self):
        return f"{self.last_name} {self.first_name} {self.patronymic or ''}"


class Subject(models.Model):
    subject_id = models.AutoField(primary_key=True)
    subject_name = models.CharField(max_length=100)
    hours = models.IntegerField()

    def __str__(self):
        return self.subject_name


class Student(models.Model):
    student_id = models.AutoField(primary_key=True)
    last_name = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50)
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='students'
    )
    enrollment_date = models.DateField()
    status = models.CharField(
        max_length=10,
        choices=[('активен', 'Активен'), ('отчислен', 'Отчислен')],
        default='активен'
    )

    def __str__(self):
        return f"{self.last_name} {self.first_name}"


class Schedule(models.Model):
    schedule_id = models.AutoField(primary_key=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='schedules')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='schedules')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='schedules')
    classroom = models.ForeignKey(
        Classroom,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='schedules'
    )
    day_of_week = models.IntegerField(choices=[(i, i) for i in range(1, 7)])
    lesson_number = models.IntegerField(choices=[(i, i) for i in range(1, 9)])
    semester = models.IntegerField(choices=[(1, '1'), (2, '2')])
    academic_year = models.IntegerField()

    class Meta:
        unique_together = ['group', 'day_of_week', 'lesson_number', 'semester', 'academic_year']

    def __str__(self):
        return f"{self.group} - {self.subject} ({self.get_day_of_week_display()})"


class Grade(models.Model):
    grade_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='grades')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='grades')
    grade_value = models.DecimalField(max_digits=3, decimal_places=1)
    semester = models.IntegerField(choices=[(1, '1'), (2, '2')])
    academic_year = models.IntegerField()

    class Meta:
        unique_together = ['student', 'subject', 'semester', 'academic_year']

    def __str__(self):
        return f"{self.student} - {self.subject}: {self.grade_value}"