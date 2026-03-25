from ._bootstrap import bootstrap

bootstrap()

from server_code.srv import tools

api = tools.api
Api = tools.Api
