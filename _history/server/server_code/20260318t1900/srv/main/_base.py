from anvil.server import call, context
from ..tools import Api, api, log, meta


class Base:

    @property
    def context(self):
        """browser, server_module, uplink."""
        return context.type

    @property
    def ip(self):
        return context.client.ip

    @property
    def location(self):
        if not self._.get("location"):
            self._["location"] = (
                dict(
                    city=context.client.location.city,
                    country=context.client.location.country,
                    latitude=context.client.location.latitude,
                    longitude=context.client.location.longitude,
                )
                if context.client.location
                else {}
            )
        return self._["location"]

    @property
    def meta(self):
        return self._.get("meta", {})

    @property
    def submission(self):
        return self._.get("submission")

    @property
    def type(self):
        return dict(http="api", browser="rpc").get(context.remote_caller.type)

    ##
    ##
    ##
    def state(self):
        """."""
        if meta.env and (
            self.type == "rpc" or (self.type == "api" and self.meta.get("same_origin"))
        ):

            from anvil.server import session, get_session_id

            session_id = get_session_id()
            state = session.get("state")
            if state is None:
                session["state"] = dict(private={}, public={})

            log('session_id:', session_id)##
            log('session:', session)##
            log('state:', state)##
        else:
            session_id = None
            state = dict(private={}, public={})
        self.meta["session"] = session_id
        self.meta["state"] = state["public"]
        return state

    @staticmethod
    def test(name):
        """Allows injection of uncommitted target from local test server."""
        if meta.DEV:
            try:
                text = call("_get_api_text", name)
                exec(
                    text,
                    dict(Api=Api, api=api, print=log),
                    {},
                )
            except:
                pass
