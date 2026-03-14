from anvil.js.window import clearTimeout, setTimeout




class Timer:
    """Utility for delayed and repeat operations."""

    def __init__(
        self,
        interval: int = None,
        name: str = "",
        repeat: int = None,
        run: bool = False,
        target=None,
    ):
        self._count = None
        self._id = None
        self._interval = 0
        self._paused = False
        self._repeat = None
        self._target = None

        if interval is not None:
            self._interval = interval
        self._name = name
        if repeat:
            self._repeat = repeat
        if target:
            self.set_target(target, run=run)

        owner = self

        class Target:
            def __init__(
                self, interval: int = None, repeat: int = None, run: bool = False
            ):
                """Allows reconfig."""
                if interval is not None:
                    owner._interval = interval
                if repeat:
                    owner._repeat = repeat
                self.run = run

            def __call__(self, target: callable):
                owner.set_target(target, run=self.run)
                return target

        self._target_decorator = Target

    @property
    def count(self) -> int:
        """Returns count.
        NOTE Relevant for repeat operations."""
        return self._count

    @count.setter
    def count(self, count: int):
        """Sets count.
        XXX Should typically not be set explicitly, but can be to cater for
        special cases."""
        self._count = count

    @property
    def id(self) -> str:
        """Return timer id."""
        return self._id

    @property
    def interval(self) -> int:
        """Returns timer interval."""
        return self._interval

    @property
    def name(self) -> str:
        """Returns name for soft identification."""
        return self._name

    @name.setter
    def name(self, name: str):
        """Set name for soft identification."""
        self._name = name

    @property
    def repeat(self) -> int:
        """Returns number of times target should be repeated."""
        return self._repeat

    @repeat.setter
    def repeat(self, repeat: int):
        """Sets number of times target should be repeated."""
        self._repeat = repeat

    # NOTE target getter/setter deliberately not "orthogonal";
    # unconventional, but keeps the API intuitive and lean.

    @property
    def target(self) -> type:
        """Decorates target."""
        return self._target_decorator

    @target.setter
    def target(self, target: callable):
        """Sets target."""
        self.set_target(target)

    def clear(self) -> "Timer":
        """Clears timer."""
        if self.id:
            clearTimeout(self.id)
            self._id = None
        return self

    def pause(self):
        """Pauses execution of repeat targets."""
        self._paused = True

    def restart(self):
        """Unpauses execution of repeat targets."""
        self._paused = False

    def reset(self, interval: int = None, repeat: int = None) -> "Timer":
        """Recreates timer with existing target and option to reconfig."""
        if not self._target:
            raise ValueError("Target not set.")
        if interval is not None:
            self._interval = interval
        if repeat:
            self.repeat = repeat
        self.set_target(self._target)
        return self

    def set_target(self, target: callable, run: bool = False) -> "Timer":
        """Sets up dealyed execution of target. Optional for immediate execution.
        NOTE
        The timer instance is passed into the target to enable dynamic control.
        """
        # Clean up any previous targets
        if self._target:
            self.clear()

        # Handle class targets
        if isinstance(target, type):
            if "__init__" in target.__dict__:
                target = target(timer=self)
            else:
                target = target()

        self._target = target

        if self.repeat is None:

            def wrapper():
                # Clear id before calling target
                self.clear()
                target(timer=self)

            self._id = setTimeout(wrapper, self.interval)
        else:
            # Reset count
            self._count = 0

            def wrapper():
                if self._paused:
                    return
                if self._count <= self.repeat:
                    # Prevent premature run
                    if self._count:
                        target(timer=self)
                    self._count += 1
                    self._id = setTimeout(wrapper, self.interval)
                else:
                    self._count = 0
                    self.clear()

            wrapper()

        if run:
            target(timer=self)

        return self


class timer:
    """Utility for delayed and repeat operations.
    NOTE Compact decorator-oriented implementation of 'Timer'."""

    def __init__(
        self,
        interval: int = None,
        name: str = "",
        repeat: int = None,
        run: bool = False,
    ):
        self.interval = interval
        self.name = name
        self.repeat = repeat
        self.run = run

    def __call__(self, target: callable) -> callable:
        Timer(
            interval=self.interval,
            name=self.name,
            repeat=self.repeat,
            run=self.run,
            target=target,
        )
        return target


class delay:
    
    def __init__(
        self,
        delay: int = 0,
    ):
        self.delay = delay
        

    def __call__(self, target: callable) -> callable:
        if isinstance(target, type):
            _target = target()
        else:
            _target = target
        setTimeout(_target, self.delay)
        return target
