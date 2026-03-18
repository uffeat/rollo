import time
from anvil.server import (
    background_task,
    list_background_tasks,
    launch_background_task,
    task_state,
)


class store:
    """Decorator for storing (caching) data server-side between server function/HTTP calls.
    Typically, used to serve static db data without requiring repeated db queries."

    Example:

    @store()
    def get_media_list():
        value = []
        for row in app_tables.test.search():
            value.append(row["media"])
        return value

    TODO Mechanism for self-relaunch, if failure
    """

    # NOTE How it works: The decorated function is transformed into a background task.
    # This background task is only run once. The data to be stored is stored in the task's
    # state (rather than its return value) to also enable storage of media objects.

    def __init__(self, name: str=None):
        self.name = name

    def __call__(self, func: callable):
        # NOTE 'func' should return the data object to be stored

        if not self.name:
            self.name = func.__name__

        self.task = self.search(self.name)
        if not self.task:

            def source():
                value = func()
                task_state["value"] = value

            # Rename 'source' to register background task with the 'self.name'
            source.__name__ = self.name
            # Register background task
            background_task()(source)
            self.launch()

        return self.get_value

    def get_value(self):
        """Awaits task completion and returns the value of the task states's 'value' item."""
        
        # TODO try-except.
        # TODO Limit on while loop.
        
        while not self.task.is_completed():
            time.sleep(0.1)
        return self.task.get_state()["value"]

    def launch(self):
        """Launches task ans stores task in 'self.task'."""

        # TODO try-except.

        self.task = launch_background_task(self.name)

    @staticmethod
    def search(name: str):
        """Returns task by name; return None, if task not found."""
        for task in list_background_tasks():
            if task.get_task_name() == name:
                return task
