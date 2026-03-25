"""Serves endpoint without the need to commit.
NOTE Replaces the 'echo' endpoint in server_code (both as api and rpc)."""

from tools import Api, api, connect

wait = connect()



@api()
class echo(Api):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self, *args, **kwargs):

        submission = self.meta["submission"]

        print('self.state.id:', self.state.id)

        state = self.state.public()
        print('state:', state)

        history = self.state.public.history

        ##print('history:', history)


        if history:
            history = [*history, submission]
        else:
            history = [submission]

        

        print('history:', history)



        self.state.public(history=history)



        return "PING"


wait()
